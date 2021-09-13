import axios from 'axios'
import { readFileSync } from 'fs'
import { Agent as HttpsAgent } from 'https'
import { appLogger } from '../util/logger.js'
import { decodingJWT } from '../util/jwt.js'
import config from '../config.js'


const anonymize = (text, nbVisibleCharAtPrefixAndSuffix=2) => {
  const anonymizedText = '*'.repeat(text.length - nbVisibleCharAtPrefixAndSuffix * 2)
  return text.substr(0, nbVisibleCharAtPrefixAndSuffix) + anonymizedText + text.substr(nbVisibleCharAtPrefixAndSuffix + anonymizedText.length)
}

const ERROR_MESSAGES = {
  401: 'Authentication to UTAC api failed',
  403: 'Forbidden',
  404: 'Unknown immatriculation',
  406: 'Invalid request',
  429: 'Too many request',
  500: 'Error while asking UTAC API',
  503: 'Unavailable UTAC api',
  malformedResponse: 'Missing information in UTAC response',
  default: 'Unexpected error from UTAC api',
}

module.exports.UTACClient = class UTACClient {
  constructor () {
    // /!\ boolean setting is passed as string /!\
    // @todo: we should use typed yaml to load settings
    const isFakedUtacApi = config.utac.isFakedApi === true || config.utac.isFakedApi === 'true'
    const baseURL = isFakedUtacApi ? config.utac.fakeApiUrl : config.utac.apiUrl

    const options = {
      // No https needed for local faked api
      // For production, https certificate is managed by the PIO
      httpsAgent: !config.isProd && !isFakedUtacApi
        ? new HttpsAgent({
          keepAlive: true,
          ca: readFileSync(config.utac.utacPem),
          pfx: readFileSync(config.utac.histovecPfx),
          passphrase: config.utac.histovecPfxPassphrase,
        }) : undefined,
      baseURL,
      timeout: config.utac.timeout,
      headers: {
        Accepts: 'application/json',
        'Content-Type': 'application/json',
        Token: config.isProd && !isFakedUtacApi ? config.utac.inesToken : '',
      },
    }

    this.axios = axios.create(options)

    const needAuth = (request) => {
      if (request.url === '/auth') {
        return false
      }

      const authorizationHeader = this.axios.defaults.headers.common['Authorization']

      if (!authorizationHeader) {
        return true
      }

      const utacApiJWT = authorizationHeader.split(' ')[1]
      const { exp: expirationTimeAsSeconds } = decodingJWT(utacApiJWT)

      // Convert Date.getTime() to seconds since JWT uses time with seconds
      const nowTimeAsSeconds = Math.floor(new Date().getTime() / 1000)

      return nowTimeAsSeconds > expirationTimeAsSeconds
    }

    const authInterceptor = async (request) => {
      appLogger.debug({
        debug: `UTAC - ${request.url}`,
        data: request.data || {},
        auth: request.auth || {},
        headersCommon: request.headers.common || {},
        headers: request.headers || {},
      })

      if (!needAuth(request)) {
        return request
      }

      const authorizationHeader = await this._authenticate()
      if (authorizationHeader) {
        request.headers.Authorization = authorizationHeader
      }

      return request
    }

    const errorInterceptor = (error) => {
      const status = error?.response?.status || 'default'
      const message = ERROR_MESSAGES[status]

      appLogger.debug({
        debug: 'errorInterceptor',
        error,
        status,
        message,
      })

      return Promise.reject({
        status: status === 'default' ? 500 : status,
        message,
      })
    }

    // @todo: use 'runWhen' when it will be released
    this.axios.interceptors.request.use(authInterceptor) //, null, { runWhen: needAuth })
    this.axios.interceptors.response.use(null, errorInterceptor)
  }

  async healthCheck () {
    appLogger.debug({
      debug: 'UTACClient - healthCheck',
    })

    const { status } = await this.axios.get('/healthcheck').catch(err => err)

    return { status }
  }

  async _authenticate () {
    try {
      const response = await this.axios.get('/auth', {
        auth: {
          username: config.utac.username,
          password: config.utac.password,
        },
      })

      const token = response.data && response.data.token
      if (token) {
        appLogger.debug({
          debug: 'UTAC authentication succeed',
          token: token,
        })

        const authorizationHeader = `bearer ${token}`
        this.axios.defaults.headers.common.Authorization = authorizationHeader

        return authorizationHeader
      }

      appLogger.error({
        error: 'UTAC authentication error : no token',
      })
    } catch (error) {
      appLogger.error({
        error: 'UTAC authentication failed',
        remoteError: error,
      })
    }
  }

  async readControlesTechniques ({ immat, vin }, { uuid, encryptedImmat, encryptedVin }) {
    const start = new Date()
    appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_start`)

    appLogger.debug({
      debug: 'UTACClient - readControlesTechniques',
      immat,
    })

    let response = null

    try {
      const anonymizedUtacImmat = anonymize(immat)
      const anonymizedUtacVin = anonymize(vin)

      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} anonymized_sent_immat ${anonymizedUtacImmat}`)
      if (config.utac.isVinSentToUtac) {
        appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} anonymized_sent_vin ${anonymizedUtacVin}`)
      }

      response = await this.axios.post('/immat/search', {
        immat,
        ...(config.utac.isVinSentToUtac ? { vin } : {}),
      })
      const end = new Date()
      const executionTime = end - start
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_end ${executionTime}`)
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_ok`)
    } catch (error) {
      // That should never happen
      const end = new Date()
      const executionTime = end - start
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_end ${executionTime}`)
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_ko`)

      return {
        status: 500,
        message: ERROR_MESSAGES[500],
      }
    }

    if (!response?.data?.ct || !response?.data?.update_date) {
      appLogger.error({
        error: ERROR_MESSAGES.malformedResponse,
      })

      return {
        status: 500,
        message: ERROR_MESSAGES.malformedResponse,
      }
    }

    appLogger.debug({
      debug: 'UTAC result found',
      immat,
      ct: response.data.ct,
      update_date: response.data.update_date,
    })

    return {
      status: response.status,
      ct: response.data.ct,
      updateDate: response.data.update_date,
    }
  }
}
