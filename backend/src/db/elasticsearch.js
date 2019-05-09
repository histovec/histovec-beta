import Elasticsearch from 'elasticsearch'

console.log(process.env)

export default { 
  Client : new Elasticsearch.Client({
    host: `${process.env.ES_URL}`
  }),
  defaultIndex: `${process.env.ES_INDEX}`
}

