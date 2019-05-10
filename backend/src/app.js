import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import { loggerStream } from './util/logger'
import routes from './routes'

import npmVersion from '../package.json'

const app = express()

export const apiPrefix = `/${process.env.APP}/api/v1`

app.get(`${apiPrefix}/version`, function (req, res) {
  res.send(npmVersion.version)
})

const formatAsNginx =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time'

app.use(morgan(formatAsNginx, { stream: loggerStream }))
app.use(bodyParser.json({ limit: '2kb' }))
app.use(bodyParser.urlencoded({ limit: '2kb', extended: false }))

app.use(apiPrefix, routes)

export default app
