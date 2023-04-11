import { createServer } from './server.js'
import { getRedisClient } from './connectors/redis.js'
import { getElasticsearchClient } from './connectors/elasticsearch.js'
import { getUtacClient } from './connectors/utac.js'
import { appLogger, syslogLogger } from './util/logger.js'
import config from './config.js'

const API_NAME = config.apiName // 'backend' or 'public-backend'

const elasticsearchClient = getElasticsearchClient()
const redisClient = getRedisClient()
const utacClient = getUtacClient()

const cleanUp = async (server, code, reason) => {
  appLogger.info(`${API_NAME} REST server shutting down… (${reason})`)

  if (!config.isHistovecUnavailable) {
    try {
      // Closing elasticsearch connection
      await elasticsearchClient.close()
      appLogger.info('elasticsearch client is shutting down properly…')
      appLogger.info('[SERVER-STOP] elasticsearch quit')
    } catch (error) {
      appLogger.info(`elasticsearch client shutdown with error: ${error}`)
      appLogger.info('[SERVER-STOP] elasticsearch error')
    }

    try {
      // Closing redis connection
      await redisClient.quit()
      appLogger.info('redis client is shutting down properly…')
      appLogger.info('[SERVER-STOP] redis quit')
    } catch (error) {
      appLogger.info('Error while shutting down properly.')
      appLogger.info('redis client is shutting down hardly…')
      try {
        await redisClient.disconnect()
        appLogger.info('[SERVER-STOP] redis disconnect')
      } catch {
        appLogger.info('[SERVER-STOP] redis is already stopped')
      }
    }
    appLogger.info('redis client shutdown complete')
  }

  // Stopping server
  try {
    await server.stop({ timeout: 10000 }) // Wait 10s to stop
    appLogger.info(`${API_NAME} REST server shutdown complete`)
    appLogger.info('[SERVER-STOP] server graceful-stop')
  } catch (error) {
    appLogger.info(`${API_NAME} REST server shutdown complete with error: ${error}`)
    appLogger.info('[SERVER-STOP] server hard-stop')
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
