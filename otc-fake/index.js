const server = require('restana/libs/turbo-http')
const service = require('restana')({
  server
})

const ct = require('./otc_sample.json')

const nb = ct.length

const latency = 1000

function getCT() {
  let response = ct[Math.floor(Math.random() * (nb + 1))]
  return response
}

async function latencyResSend(res, response, time) {
  return await setTimeout(function(){
    res.send(response); 
  }, Math.floor(Math.random() * (latency + 1)));
} 

service.post('/otc', async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  await latencyResSend(res, getCT());
})

service.start(9000)