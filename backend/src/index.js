import http from 'http'

import { createServer } from './server.js'
import { getAsync } from './connectors/redis.js'
import { getElasticsearchClient } from './connectors/elasticsearch.js'
import { appLogger, techLogger } from './util/logger.js'
import config from './config.js'

const API_NAME = config.apiName  // 'backend' or 'public-backend'


const elasticsearchClient = getElasticsearchClient()

// Graceful shutdown : React to a SIGTERM signal for a quick and proper shutdown
const cleanUp = (server) => {
  console.log(`${server.name} REST server shutting down…`)
  // Server no longer accept any other incoming request, but process all remaining requests
  server.close(async () => {
    // Database no longer accept any other incoming request, but process all remaining requests
    await connection.close()
    console.log(`${server.name} REST server shutdown complete`)
  })
}

const initServer = async () => {
  techLogger.debug(
    `🔧  ${JSON.stringify(config)}`
  )

  appLogger.info(`[CONFIG] isVinSentToUtac ${config.utac.isVinSentToUtac}`)

  const server = await createServer()

  try {
    await elasticsearchClient.search({
      index: config.esIndex,
      q: 'version',
      size: '1',
    })
  } catch (error) {
    techLogger.error(
      `❌  ${API_NAME} REST server could not connect to elasticsearch, exiting…`
    )
    techLogger.error(error)
  }

  try {
    await getAsync('')
  } catch (error) {
    techLogger.error(
      `❌  ${API_NAME} REST server could not connect to redis, exiting…`
    )
    techLogger.error(error)
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

  // Graceful shutdown
  process.on('SIGTERM', () => cleanUp(server))
}


(async () => {
  await initServer()
})()
