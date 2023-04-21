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
  syslogLogger.info({ key: 'server_shutting_down', tag: 'SERVER-STOP', value: { code, reason } })

  if (!config.isHistovecUnavailable) {
    try {
      // Closing elasticsearch connection
      await elasticsearchClient.close()
      syslogLogger.info({ key: 'elasticsearch_shutdown_properly', tag: 'SERVER-STOP' })
    } catch (error) {
      syslogLogger.info({ key: 'elasticsearch_shutdown_error', tag: 'SERVER-STOP', value: error })
    }

    try {
      // Closing redis connection
      await redisClient.quit()
      syslogLogger.info({ key: 'redis_shutdown_properly', tag: 'SERVER-STOP' })
    } catch (error) {
      syslogLogger.info({ key: 'redis_shutdown_hardly', tag: 'SERVER-STOP' })
      try {
        await redisClient.disconnect()
        syslogLogger.info({ key: 'redis_disconnect', tag: 'SERVER-STOP' })
      } catch {
        syslogLogger.info({ key: 'redis_already_stopped', tag: 'SERVER-STOP' })
      }
    }
    syslogLogger.info({ key: 'redis_shutdown_complete', tag: 'SERVER-STOP' })
  }

  // Stopping server
  try {
    await server.stop({ timeout: 10000 }) // Wait 10s to stop
    syslogLogger.info({ key: 'server_shutdown_complete', tag: 'SERVER-STOP' })
  } catch (error) {
    syslogLogger.info({ key: 'server_hardstop_shutdown_complete_with_error', tag: 'SERVER-STOP', value: error })
  }
  process.exit(code)
}

const initServer = async () => {
  syslogLogger.debug({ key: 'detail_informations_configuration', tag: 'CONFIG', value: config })
  syslogLogger.info({ key: 'detail_informations_configuration', tag: 'CONFIG', value: { usePreviousMonthForData: config.usePreviousMonthForData, previousMonthShift: config.previousMonthShift, version: config.version } })

  const server = await createServer()

  if (!config.isHistovecUnavailable) {
    try {
      await elasticsearchClient.search({
        index: config.esIndex,
        q: 'version',
        size: '1',
      })
      syslogLogger.info({ key: 'elasticsearch_up_and_connected', tag: 'SERVER-START' })
    } catch (error) {
      syslogLogger.info({ key: 'elasticsearch_down_unable_to_connect', tag: 'SERVER-START', value: error })
    }

    try {
      await redisClient.get('', '')
      syslogLogger.info({ key: 'redis_up_and_connected', tag: 'SERVER-START' })
    } catch (error) {
      syslogLogger.info({ key: 'redis_down_unable_to_connect', tag: 'SERVER-START', value: error })
    }

    try {
      const response = await utacClient.healthCheck()

      if (response.status === 200) {
        syslogLogger.info({ key: 'utac_api_ok', tag: 'SERVER-START' })
      } else {
        syslogLogger.info({ key: 'utac_api_ko', tag: 'SERVER-START', value: { status: response.status } })
      }
    } catch (error) {
      syslogLogger.info({ key: 'utac_api_ko', tag: 'SERVER-START', value: error })
    }
  }

  try {
    await server.start()
    syslogLogger.info({ key: 'server_started', tag: 'SERVER-START', value: { uri: server.info.uri } })
  } catch (error) {
    syslogLogger.error({ key: 'server_failed_to_start', tag: 'SERVER-START', value: error })
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
