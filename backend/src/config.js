import npmVersion from '../package.json'


const isDevelopmentMode = process.env.NODE_ENV === 'development'

const config = {
  port: process.env.BACKEND_PORT,
  apiName: process.env.BACKEND_NAME,
  apiUuid: process.env.PUBLIC_BACKEND_API_UUID,
  version: npmVersion.version,
  publicApiVersion: '1.0.0',
  utacIdKey: process.env.UTAC_ID_KEY,
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopmentMode,
  isPublicApi: process.env.PUBLIC_BACKEND === 'true',
  isUtacCacheIgnorable: isDevelopmentMode || process.env.IS_UTAC_CACHE_IGNORABLE === 'true',
  env: process.env.NODE_ENV,
  app: process.env.APP,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPersit: parseInt(process.env.REDIS_PERSIST, 10) || 86400,  // 24h
  redisPassword: process.env.REDIS_PASSWORD,
  esUrl: process.env.ES_URL,
  esSIVIndex: process.env.ES_INDEX,
  mailTo: process.env.MAIL_TO,
  apiPrefix: `/${process.env.APP}/api/v1`,
  usePreviousMonthForData: process.env.PUBLIC_BACKEND_USE_PREVIOUS_MONTH_FOR_DATA === 'true',
  previousMonthShift: parseInt(process.env.PUBLIC_BACKEND_PREVIOUS_MONTH_SHIFT, 10) || 1,

  // UTAC api
  utac: {
    isApiActivated: process.env.IS_UTAC_API_ACTIVATED === 'true',
    isVinSentToUtac: process.env.IS_VIN_SENT_TO_UTAC === 'true',
    isUtacMockForBpsaActivated: process.env.IS_UTAC_MOCK_FOR_BPSA_ACTIVATED === 'true',
    isFakedApi: false,  // /!\ value is passed as String
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

  smtp: {
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: false,
    tls: {
      // do not failed with selfsign certificates
      rejectUnauthorized: false,
    },
  },
}

export default config
