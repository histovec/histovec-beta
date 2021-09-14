import Redis from 'ioredis'
import { appLogger } from '../util/logger.js'
import config from '../config.js'


class RedisClient {
  constructor () {
    // Enable await/async usage with all Redis client methods
    Redis.Promise = global.Promise

    this.redisClient = new Redis({
      host: config.redisHost,
      port: config.redisPort,
      password: config.redisPassword,
      db: 0,
      maxRetriesPerRequest: null,  // Infinite retry
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)  // Retry quick, then progressivly long. Will wait 2s max delay before to retry.
        return delay
      }
    })

    this.redisClient.config('SET', 'save', '')

    this.redisClient.on('error', (error) => {
      appLogger.info(`redis server crashed with error: ${error}`)
      appLogger.info('[SERVER-RUN] redis_down unable_to_connect')
    })
  }

  _isUp () {
    return this.redisClient.status === 'ready'
  }

  async get (key) {
    if (this._isUp()) {
      return this.redisClient.get(key)
    }
    appLogger.info(`--> skipping get() call...`)
  }

  async set (key, value) {
    if (this._isUp()) {
      return this.redisClient.set(key, value)
    }
    appLogger.info(`--> skipping set() call...`)
  }

  async quit () {
    return this.redisClient.quit()
  }

  async disconnect () {
    return this.redisClient.disconnect()
  }
}

export const redisClient = new RedisClient()

