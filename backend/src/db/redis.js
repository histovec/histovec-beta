// redis-client.js
import redis from 'redis'

const client = redis.createClient(process.env.REDIS_URL)

export default {
  async getAsync () { await client.get.bind(client) },
  async setAsync () { await client.set.bind(client) },
  async keysAsync () { await client.keys.bind(client) }
}

