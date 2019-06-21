const server = require('restana/libs/turbo-http')
const service = require('restana')({
  server
})

const config = {
  apiPath: process.env.UTAC_API,
  latency: process.env.UTAC_LATENCY || 300,
  port: process.env.UTAC_PORT || 9000
}

let ct = {}

require('./utac_sample.json').map( item => ct[immatNorm(item['plaque'])]=item['ct'])

console.log(ct)

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

function getCT() {
  let response = ct[Math.floor(Math.random() * (nb + 1))]
  return response
}

function erlangWait() {
  // Erelang generated response time with lambda = 1 and k = 5
  return - ( config.latency / 4 ) * Math.log(Math.random() * Math.random() * Math.random() * Math.random() * Math.random())
}

async function latencyResSend(res, response, time) {
  return await setTimeout(function(){
    res.send(response);
  }, erlangWait() );
}

service.post(`/${config.apiPath}`, async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await latencyResSend(res, getCT(req.plaque));
})

service.start(config.port)