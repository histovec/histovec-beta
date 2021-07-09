import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { loggerStream } from './util/logger'
import getRouter from './routes'
import config from './config'

export default function createApp (utacClient) {
  const app = express()

  // Remove x-powered-by header for security reason
  app.disable('x-powered-by')

  morgan.token('id', function (req) {
    return req.body.id
  })

  morgan.token('uuid', function (req) {
    return req.body.uuid
  })

  morgan.token('fwd-addr', function (req) {
    return req.headers['x-forwarded-for']
  })

  function formatAsJson (tokens, req, res) {
    return JSON.stringify({
      backend: {
        'remote-address': tokens['remote-addr'](req, res),
        'forwarded-address': tokens['fwd-addr'](req, res),
        'remote-user': tokens['remote-user'](req, res),
        'server-date': tokens['date'](req, res, 'iso'),
        'response-time': +tokens['response-time'](req, res, 'iso'),
        method: tokens['method'](req, res),
        url: tokens['url'](req, res),
        'http-version': tokens['http-version'](req, res),
        'status-code': +tokens['status'](req, res),
        'content-length': +tokens['res'](req, res, 'content-length'),
        referrer: tokens['referrer'](req, res),
        'user-agent': tokens['user-agent'](req, res),
        id: tokens['id'](req, res),
        uuid: tokens['uuid'](req, res),
      },
    })
  }

  app.use(morgan(formatAsJson, { stream: loggerStream }))
  app.use(bodyParser.json({ limit: '2kb' }))
  app.use(bodyParser.urlencoded({ limit: '2kb', extended: false }))

  const router = getRouter(utacClient)
  app.use(config.apiPrefix, router)

  return app
}
