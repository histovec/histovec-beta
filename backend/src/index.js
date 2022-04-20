import http from 'http'

import { createServer } from './server.js'
import { getRedisClient } from './connectors/redis.js'
import { getElasticsearchClient } from './connectors/elasticsearch.js'
import { getUtacClient } from './connectors/utac.js'
import { appLogger, techLogger } from './util/logger.js'
import config from './config.js'

const API_NAME = config.apiName  // 'backend' or 'public-backend'

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
      await redisClient.disconnect()
      appLogger.info('[SERVER-STOP] redis disconnect')
    }
    appLogger.info('redis client shutdown complete')
  }

  // Stopping server
  try {
    await server.stop({ timeout: 10000 })  // Wait 10s to stop
    appLogger.info(`${API_NAME} REST server shutdown complete`)
    appLogger.info('[SERVER-STOP] server graceful-stop')
  } catch(error) {
    appLogger.info(`${API_NAME} REST server shutdown complete with error: ${error}`)
    appLogger.info('[SERVER-STOP] server hard-stop')
  }
  process.exit(code)
}

const initServer = async () => {
  techLogger.debug(
    `🔧  ${JSON.stringify(config)}`
  )
  appLogger.info(`[CONFIG] isVinSentToUtac ${config.utac.isVinSentToUtac}`)
  appLogger.info(`[CONFIG] usePreviousMonthForData ${config.usePreviousMonthForData}`)
  appLogger.info(`[CONFIG] version ${config.version}`)

  const server = await createServer()

  if (!config.isHistovecUnavailable) {
    try {
      await elasticsearchClient.search({
        index: config.esIndex,
        q: 'version',
        size: '1',
      })
      techLogger.info(
        `✅  ${API_NAME} REST server connected to elasticsearch`
      )
      appLogger.info('[SERVER-START] elasticsearch connect')
    } catch (error) {
      techLogger.error(
        `❌  ${API_NAME} REST server could not connect to elasticsearch…`
      )
      techLogger.error(error)
      appLogger.info('[SERVER-START] elasticsearch_down unable_to_connect_at_start')
      appLogger.info('-- elasticsearch is down => cannot connect to elasticsearch')
    }

    try {
      await redisClient.get('')
      techLogger.info(
        `✅  ${API_NAME} REST server connected to redis`
      )
      appLogger.info('[SERVER-START] redis connect')
    } catch (error) {
      techLogger.error(
        `❌  ${API_NAME} REST server could not connect to redis…`
      )
      techLogger.error(error)
      appLogger.info('[SERVER-START] redis_down unable_to_connect_at_start')
      appLogger.info('-- redis is down => cannot connect to redis')
    }

    try {
      const response = await utacClient.healthCheck()

      if (response.status === 200) {
        techLogger.info(
          `✅  UTAC API server is ok`
        )
        appLogger.info('[SERVER-START] utac_api ok')
      } else {
        techLogger.info(
          `❌  UTAC API is not available… (status : ${response.status})`
        )
        appLogger.info(`[SERVER-START] utac_api ko ${status}`)
      }
    } catch (error) {
      techLogger.error(
        `❌  UTAC API is not available…`
      )
      techLogger.error(error)
      appLogger.info(`[SERVER-START] utac_api ko`)
    }
  }

  try {
    await server.start()
    techLogger.info(
      `✅  ${API_NAME} REST server started at ${server.info.uri}`
    )
  } catch (error) {
    techLogger.error(
      `❌  ${API_NAME} REST server failed to start, exiting…`
    )
    techLogger.error(error)
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
