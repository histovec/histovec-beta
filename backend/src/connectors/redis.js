// redis-client.js
import redis from 'redis'
import { promisify } from 'util'
import { appLogger } from '../util/logger'
import config from '../config'
const client = redis.createClient(config.redisUrl)

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
