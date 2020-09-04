import config from '../config'
const { Client } = require('@elastic/elasticsearch')

export default {
  Client: new Client({
    node: config.elasticSearch.url,
  }),
}
