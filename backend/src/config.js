import { generateKey } from './util/crypto'
import npmVersion from '../package.json'

const config = {
  port: process.env.BACKEND_PORT,
  version: npmVersion.version,
  secret: process.env.BACKEND_SECRET || '%Ch4NGm3+',
  appKey: generateKey(process.env.BACKEND_SECRET || '%Ch4NGm3+'),
  utacIdKey: process.env.UTAC_ID_KEY || '%Ch4NGm3+',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  env: process.env.NODE_ENV,
  app: process.env.APP,
  redisUrl: `redis://${process.env.REDIS_URL}`,
  redisPersit: process.env.REDIS_PERSIST || 86400, // 24h
  esUrl: process.env.ES_URL,
  esSIVIndex: process.env.ES_INDEX,
  esFeedbackIndex: 'feedback',
  smtpServer: process.env.SMTP_SERVER,
  smtpPort: process.env.SMTP_PORT,
  mailFrom: process.env.MAIL_FROM,
  mailTo: process.env.MAIL_TO,
  apiPrefix: `/${process.env.APP}/api/v1`,

  // UTAC api
  isUtacApiActivated: process.env.IS_UTAC_API_ACTIVATED || false, // /!\ value is passed as String
  utacThroughInesUrl: process.env.UTAC_THROUGH_INES_URL,
  utacTimeout: process.env.UTAC_TIMEOUT || 30,
  utacHealthCheckRetrySeconds: process.env.UTAC_HEALTHCHECK_RETRY_SECONDS || 30,
  utacAuthenticateRetrySeconds: process.env.UTAC_AUTHENTICATE_RETRY_SECONDS || 30
}

export const smtpOptions = {
  host: config.smtpServer,
  port: config.smtpPort,
  secure: false,
  tls: {
    // do not failed with selfsign certificates
    rejectUnauthorized: false,
  },
}

export default config
