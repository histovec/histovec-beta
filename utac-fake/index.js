const { DateTime } = require('luxon')
const bodyParser = require('body-parser')
const service = require('restana')()

service.use(bodyParser.json())

const config = {
  apiPath: process.env.UTAC_API,
  latency: process.env.UTAC_LATENCY || 300,
  port: process.env.UTAC_PORT || 9000
}

console.log(JSON.stringify({ start_date: DateTime.local(), config: config }))
let ct = {}

require('./utac_sample.json').map( item => ct[immatNorm(item['plaque'])]=item['ct'])

function immatNorm (plaque) {
  if (!plaque || typeof plaque != 'string') {
    return undefined
  }
  let p = plaque.toUpperCase()
  p = p.replace(/^([A-Z]+)(\s|-)*([0-9]+)(\s|-)*([A-Z]+)$/, '$1-$3-$5')
  p = p.replace(/^([0-9]+)(\s|-)*([A-Z]+)(\s|-)*([0-9]+)$/, '$1$3$5')
  return p
}

const nb = ct.length

function getCT(plaque) {
  let myCt = ct[plaque]
  console.log({
    plaque: plaque,
    ct: myCt ? `Found ${myCt.length} tech controls` : 'Not Found'
  })
  return {
    status: myCt ? 200 : 404,
    update_date: DateTime.local(),
    ct: myCt
  }
}

function erlangWait() {
  // Erelang generated response time with lambda = 1 and k = 5
  return - ( config.latency / 4 ) * Math.log(Math.random() * Math.random() * Math.random() * Math.random() * Math.random())
}

async function latencyResSend(req, res, response, time) {
  return await setTimeout(function(){
    res.send(response, response.status)
  }, erlangWait() );
}

service.post(`/${config.apiPath}`, async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await latencyResSend(req, res, getCT(req.body.plaque));
})

service.start(config.port)