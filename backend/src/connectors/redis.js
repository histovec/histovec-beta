import redis from 'redis'
import { promisify } from 'util'
import { appLogger } from '../util/logger.js'
import config from '../config.js'
import retryStrategy from 'node-redis-retry-strategy'


const client = redis.createClient({
  host: config.redisHost,
  port: config.redisPort,
  retry_strategy: retryStrategy({
    allow_to_start_without_connection: true
  })
})

client.auth(config.redisPassword, (err, response) => {
  if (err) {
    appLogger.error({
      error: 'Redis authentication failed !',
    })

    throw err
  }
})

client.config('SET', 'save', '')

export const getAsync = promisify(client.get).bind(client)
export const setAsync = promisify(client.set).bind(client)
export const keysAsync = promisify(client.keys).bind(client)

export default { getAsync, setAsync, keysAsync }
