import Redis from 'ioredis'
import { syslogLogger } from '../util/logger.js'
import config from '../config.js'

class RedisClient {
  constructor () {
    this.redisClient = new Redis({
      host: config.redisHost,
      port: config.redisPort,
      password: config.redisPassword,
      db: 0,
      maxRetriesPerRequest: null, // Infinite retry
      retryStrategy (times) {
        const delay = Math.min(times * 50, 2000) // Retry quick, then progressivly long. Will wait 2s max delay before to retry.
        return delay
      },
    })

    this.redisClient.config('SET', 'save', '')
    this.redisClient.on('error', (error) => {
      syslogLogger.info({ key: 'redis_down_unable_to_connect', tag: 'REDIS', value: error })
    })
  }

  _isUp () {
    return this.redisClient.status === 'ready'
  }

  async get (key, uuid) {
    if (this._isUp()) {
      return this.redisClient.get(key)
    }
    syslogLogger.info({ key: 'redis_not_started_skipping_get_fonction', tag: 'REDIS', uuid })
  }

  async set (key, value, uuid) {
    if (this._isUp()) {
      return this.redisClient.set(key, value)
    }
    syslogLogger.info({ key: 'redis_not_started_skipping_set_fonction', tag: 'REDIS', uuid })
  }

  async quit () {
    return this.redisClient.quit()
  }

  async disconnect () {
    return this.redisClient.disconnect()
  }
}

const redisClient = new RedisClient()

export const getRedisClient = () => {
  return redisClient
}
