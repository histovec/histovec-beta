import { generateKey } from './util/crypto'
import npmVersion from '../package.json'

const isProduction = process.env.NODE_ENV === 'production'

export const config = {
  port: process.env.BACKEND_PORT,
  version: npmVersion.version,
  secret: process.env.BACKEND_SECRET || '%Ch4NGm3+',
  appKey: generateKey(process.env.BACKEND_SECRET || '%Ch4NGm3+'),
  isProduction: process.env.NODE_ENV === 'production',
  env: process.env.NODE_ENV,
  app: process.env.APP,
  redisUrl: process.env.REDIS_URL,
  esUrl: process.env.ES_URL,
  esIndex: process.env.ES_INDEX,
  otcUrl: process.env.OTC_URL,
  smtpServer: process.env.SMTP_SERVER,
  smtpPort: process.env.SMTP_PORT,
  mailFrom: process.env.MAIL_FROM,
  apiPrefix: `/${process.env.APP}/api/v1`
}
