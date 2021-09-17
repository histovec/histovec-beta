import Elasticsearch from 'elasticsearch'
import config from '../config.js'

const elasticsearchClient = new Elasticsearch.Client({
  host: config.esUrl,
})

export const getElasticsearchClient = () => {
  return elasticsearchClient
}
