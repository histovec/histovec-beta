import npmVersion from '../package.json'

const config = {
  port: process.env.BACKEND_PORT,
  version: npmVersion.version,
  utacIdKey: process.env.UTAC_ID_KEY,
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  env: process.env.NODE_ENV,
  app: process.env.APP,
  redisUrl: `redis://${process.env.REDIS_URL}`,
  redisPersit: parseInt(process.env.REDIS_PERSIST, 10) || 86400, // 24h
  redisPassword: process.env.REDIS_PASSWORD,
  esUrl: process.env.ES_URL,
  esSIVIndex: process.env.ES_INDEX,
  smtpServer: process.env.SMTP_SERVER,
  smtpPort: process.env.SMTP_PORT,
  mailFrom: process.env.MAIL_FROM,
  mailTo: process.env.MAIL_TO,
  apiPrefix: `/${process.env.APP}/api/v1`,

  // UTAC api
  utac: {
    isApiActivated: process.env.IS_UTAC_API_ACTIVATED || false, // /!\ value is passed as String
    isVinSentToUtac: process.env.IS_VIN_SENT_TO_UTAC || false, // /!\ value is passed as String
    isFakedApi: false, // /!\ value is passed as String
    apiUrl: process.env.UTAC_URL,
    fakeApiUrl: process.env.FAKE_UTAC_URL,
    timeout: parseInt(process.env.UTAC_TIMEOUT, 10) || 30,
    username: process.env.UTAC_USERNAME,
    password: process.env.UTAC_PASSWORD,
    histovecPfx: process.env.HISTOVEC_PFX || 'src/utac/histovec.pfx',
    histovecPfxPassphrase: process.env.HISTOVEC_PFX_PASSPHRASE,
    inesToken: process.env.INES_TOKEN,
    utacPem: process.env.UTAC_PEM || 'src/utac/utac.pem',
  },
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
