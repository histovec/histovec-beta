// redis-client.js
import redis from 'redis'
import { config } from '../config'
const client = redis.createClient(config.redisUrl)

export default {
  async getAsync () { await client.get.bind(client) },
  async setAsync () { await client.set.bind(client) },
  async keysAsync () { await client.keys.bind(client) }
}

