import { createServer } from './server.js'
import { getRedisClient } from './connectors/redis.js'
import { getElasticsearchClient } from './connectors/elasticsearch.js'
import { getUtacClient } from './connectors/utac.js'
import { syslogLogger } from './util/logger.js'
import config from './config.js'

const elasticsearchClient = getElasticsearchClient()
const redisClient = getRedisClient()
const utacClient = getUtacClient()

const cleanUp = async (server, code, reason) => {
  syslogLogger.info({ key: 'REST server shutting down…', tag: 'SERVER-STOP', value: { code, reason } })

  if (!config.isHistovecUnavailable) {
    try {
      // Closing elasticsearch connection
      await elasticsearchClient.close()
      syslogLogger.info({ key: 'elasticsearch client is shutting down properly…', tag: 'SERVER-STOP' })
    } catch (error) {
      syslogLogger.info({ key: 'elasticsearch client shutdown with error', tag: 'SERVER-STOP', value: error })
    }

    try {
      // Closing redis connection
      await redisClient.quit()
      syslogLogger.info({ key: 'redis client is shutting down properly…', tag: 'SERVER-STOP' })
    } catch (error) {
      syslogLogger.info({ key: 'redis client is shutting down hardly…', tag: 'SERVER-STOP' })
      try {
        await redisClient.disconnect()
        syslogLogger.info({ key: 'redis disconnect', tag: 'SERVER-STOP' })
      } catch {
        syslogLogger.info({ key: 'redis is already stopped', tag: 'SERVER-STOP' })
      }
    }
    syslogLogger.info({ key: 'redis client shutdown complete', tag: 'SERVER-STOP' })
  }

  // Stopping server
  try {
    await server.stop({ timeout: 10000 }) // Wait 10s to stop
    syslogLogger.info({ key: 'REST server graceful-stop shutdown complete', tag: 'SERVER-STOP' })
  } catch (error) {
    syslogLogger.info({ key: 'REST server hard-stop shutdown complete with error', tag: 'SERVER-STOP', value: error })
  }
  process.exit(code)
}

const initServer = async () => {
  syslogLogger.debug({ key: 'config infos', tag: 'CONFIG', value: config })
  syslogLogger.info({ key: 'usePreviousMonthForData', tag: 'CONFIG', value: config.usePreviousMonthForData })
  syslogLogger.info({ key: 'previousMonthShift', tag: 'CONFIG', value: config.previousMonthShift })
  syslogLogger.info({ key: 'version', tag: 'CONFIG', value: config.version })

  const server = await createServer()

  if (!config.isHistovecUnavailable) {
    try {
      await elasticsearchClient.search({
        index: config.esIndex,
        q: 'version',
        size: '1',
      })
      syslogLogger.info({ key: '✅ REST server connected to elasticsearch', tag: 'SERVER-START' })
    } catch (error) {
      syslogLogger.info({ key: '❌ elasticsearch_down unable_to_connect_at_start', tag: 'SERVER-START', value: error })
    }

    try {
      await redisClient.get('')
      syslogLogger.info({ key: '✅ redis connected', tag: 'SERVER-START' })
    } catch (error) {
      syslogLogger.info({ key: '❌ redis_down unable_to_connect_at_start', tag: 'SERVER-START', value: error })
    }

    try {
      const response = await utacClient.healthCheck()

      if (response.status === 200) {
        syslogLogger.info({ key: '✅ utac_api ok', tag: 'SERVER-START' })
      } else {
        syslogLogger.info({ key: '❌ utac_api ko', tag: 'SERVER-START', value: { status: response.status } })
      }
    } catch (error) {
      syslogLogger.info({ key: '❌ utac_api ko', tag: 'SERVER-START', value: error })
    }
  }

  try {
    await server.start()
    syslogLogger.info({ key: `✅ REST server started at ${server.info.uri}`, tag: 'SERVER-START' })
  } catch (error) {
    syslogLogger.error({ key: '❌ REST server failed to start, exiting…', tag: 'SERVER-START', value: error })
  }

  // Uncatched errors
  process.on('uncaughtException', async () => cleanUp(server, 1, 'uncaughtException'))
  process.on('unhandledRejection', async () => cleanUp(server, 1, 'unhandledRejection'))

  // Graceful shutdown
  process.on('SIGTERM', async () => cleanUp(server, 0, 'SIGTERM'))
  process.on('SIGINT', async () => cleanUp(server, 0, 'SIGINT'))
}

(async () => {
  await initServer()
})()
