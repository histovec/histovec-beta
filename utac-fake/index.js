import dayjs from 'dayjs'
const bodyParser = require('body-parser')
const service = require('restana')()

service.use(bodyParser.json())

const config = {
  apiPath: process.env.FAKE_UTAC_API,
  latency: process.env.FAKE_UTAC_LATENCY || 300,
  port: process.env.FAKE_UTAC_PORT || 9000
}

console.log(JSON.stringify({ start_date: dayjs().toISOString(), config: config }))

const allCt = (
  require('./utac_sample.json')
    .map((item) => { return {ct: item['ct'], plaque: item['plaque']} })
    .reduce((accumulator, {ct, plaque}) => {
      return {
        ...accumulator,
        [immatNorm(plaque)]: ct,
      }
    }, {})
)

const immatNorm = (plaque) => {
  if (!plaque || typeof plaque != 'string') {
    return undefined
  }
  return (
    plaque.toUpperCase()
      .replace(/^([A-Z]+)(\s|-)*([0-9]+)(\s|-)*([A-Z]+)$/, '$1-$3-$5')
      .replace(/^([0-9]+)(\s|-)*([A-Z]+)(\s|-)*([0-9]+)$/, '$1$3$5')
  )
}

const getCT = (plaque) => {
  const myCt = allCt[plaque]
  console.log({
    plaque: plaque,
    ct: myCt ? `Found ${myCt.length} tech controls` : 'Not Found',
  })
  const res = {
    status: myCt ? 200 : 404,
    update_date: dayjs().toISOString(),
    ct: myCt
  }
  console.log(res)
  return res
}

const erlangWait = () =>
  // Erelang generated response time with lambda = 1 and k = 5
  - ( config.latency / 4 ) * Math.log(Math.random() * Math.random() * Math.random() * Math.random() * Math.random())

const latencyResSend = async (req, res, response, time) => setTimeout(
  () => res.send(response, response.status),
  erlangWait()
)


service.get(`/${config.apiPath}/auth`, async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  await latencyResSend(req, res, {
    status: 200,
    token: 'yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw'
  })
})


service.get(`/${config.apiPath}/healthcheck`, async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  await latencyResSend(req, res, {
    status: 200,
  })
})

service.post(`/${config.apiPath}/immat/search`, async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const { immat } = req.body
  await latencyResSend(req, res, getCT(immat))
})

service.start(config.port)