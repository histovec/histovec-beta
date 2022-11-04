import npmVersion from '../package.json' assert {type: "json"}
import {config as configWinston} from 'winston'

const isDevelopmentMode = process.env.NODE_ENV === 'development'
const isPublicApi = process.env.PUBLIC_BACKEND === 'true'
const isProductionMode = process.env.NODE_ENV === 'production'
const isTestMode = process.env.NODE_ENV === 'test'

const niveauLogAForcer = process.env.NIVEAU_LOG_A_FORCER

// Si on paramètre un niveau de log spécifique on l'utilise,
// sinon on utilise des niveaux par défaut (prod = info, test = warn sinon debug)
const niveauLog = niveauLogAForcer
  ? niveauLogAForcer
  : (isProductionMode ? 'info' : isTestMode ? 'warn' : 'debug');

const config = {
  port: process.env.BACKEND_PORT,
  apiName: process.env.BACKEND_NAME,
  apiUuid: process.env.PUBLIC_BACKEND_API_UUID,
  version: npmVersion.version,
  publicApiVersion: '1.0.0',
  utacIdKey: process.env.UTAC_ID_KEY,
  isProd: isProductionMode,
  isTest: isTestMode,
  niveauLog: niveauLog,
  isDevelopmentMode,
  isPublicApi,
  isHistovecUnavailable: process.env.PUBLIC_BACKEND_IS_HISTOVEC_UNAVAILABLE === 'true',
  isUtacCacheIgnorable: isDevelopmentMode || process.env.IS_UTAC_CACHE_IGNORABLE === 'true',
  env: process.env.NODE_ENV,
  app: process.env.APP,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPersit: parseInt(process.env.REDIS_PERSIST, 10) || 86400, // 24h
  redisPassword: process.env.REDIS_PASSWORD,
  esUrl: process.env.ES_URL,
  esSIVIndex: process.env.ES_INDEX,
  mailTo: process.env.MAIL_TO,
  apiPrefix: `/${process.env.APP}/api/v1`,
  usePreviousMonthForData: process.env.USE_PREVIOUS_MONTH_FOR_DATA === 'true',
  previousMonthShift: parseInt(process.env.PREVIOUS_MONTH_SHIFT, 10) || 1,

  // UTAC api
  utac: {
    isApiActivated: process.env.IS_UTAC_API_ACTIVATED === 'true',
    isUtacMockForBpsaActivated: process.env.IS_UTAC_MOCK_FOR_BPSA_ACTIVATED === 'true',
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

const verifierParametrages = () => {
  // Vérification que le niveau de log à forcer paramétré est correct par rapport
  // aux valeurs possibles pour "winston" (format "npm" par défaut)
  if(niveauLogAForcer && configWinston.npm.levels[niveauLogAForcer] === undefined) {
    throw new Error(`Mauvaise configuration du paramètre [NIVEAU_LOG_A_FORCER] : ${niveauLogAForcer}`)
  }
}

export {config as default, verifierParametrages}
