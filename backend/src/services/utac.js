import axios from 'axios'
import { readFileSync } from 'fs'
import config from '../config'
import { Agent as HttpsAgent } from 'https'
import { decodingJWT } from '../util/jwt'
import { appLogger } from '../util/logger'

// /!\ boolean setting is passed as string /!\
// @todo: we should use typed yaml to load settings
const isVinSentToUtac = config.utac.isVinSentToUtac === true || config.utac.isVinSentToUtac === 'true'

// @todo: remove after BPSA test
const CONTROL_TECHNIQUES_MOCK_FOR_BPSA = {
  ct: [
    {
      ct_id: 1,
      ct_pv: null,
      ct_centre: null,
      ct_date: '11/12/2014',
      ct_deb: null,
      ct_fin: null,
      ct_nature: 'VTP',
      ct_resultat: 'A',
      ct_km: 98429,
      ct_immat: 'AW-753-TD',
      ct_vin: 'VF7JM8HZC97374672'
    },
    {
      ct_id: 2,
      ct_pv: null,
      ct_centre: null,
      ct_date: '10/12/2016',
      ct_deb: null,
      ct_fin: null,
      ct_nature: 'VTP',
      ct_resultat: 'A',
      ct_km: 132874,
      ct_immat: 'DN-134-AG',
      ct_vin: 'VF7JM8HZC97374672'
    },
    {
      ct_id: 3,
      ct_pv: null,
      ct_centre: null,
      ct_date: '26/12/2018',
      ct_deb: null,
      ct_fin: null,
      ct_nature: 'VTP',
      ct_resultat: 'A',
      ct_km: 160532,
      ct_immat: 'DN-134-AG',
      ct_vin: 'VF7JM8HZC97374672'
    }
  ],
  update_date: '01/08/2021',
  status: 200
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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

  async readControlesTechniques ({ immat, vin }, { uuid, encryptedImmat, encryptedVin, isMocked }) {
    if (isMocked) {
      // Wait same times as production UTAC api response time
      const utacResponseTimeEstimationInMs = Math.trunc(248 + (100*Math.random() - 100/2))
      appLogger.debug(`-- utacResponseTimeEstimationInMs begin ==> ${utacResponseTimeEstimationInMs}`)
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} bpsa_mock_time_to_wait ${utacResponseTimeEstimationInMs}`)

      const start = new Date()
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} bpsa_mock_call_start`)

      await sleep(utacResponseTimeEstimationInMs)

      const end = new Date()
      const executionTime = end - start
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} bpsa_mock_call_end ${executionTime}`)

      const data = CONTROL_TECHNIQUES_MOCK_FOR_BPSA

      return {
        status: data.status,
        ct: data.ct,
        updateDate: data.update_date,
      }
    }

    const start = new Date()
    appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_start`)

    appLogger.debug({
      debug: 'UTACClient - readControlesTechniques',
      immat,
      vin,
    })

    let response = null

    try {
      const anonymizedUtacImmat = anonymize(immat)
      const anonymizedUtacVin = anonymize(vin)

      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} anonymized_sent_immat ${anonymizedUtacImmat}`)
      if (isVinSentToUtac) {
        appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} anonymized_sent_vin ${anonymizedUtacVin}`)
      }

      response = await this.axios.post('/immat/search', {
        immat,
        ...(isVinSentToUtac ? { vin } : {}),
      })
      const end = new Date()
      const executionTime = end - start
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_end ${executionTime}`)

      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_ok`)
    } catch (error) {
      const end = new Date()
      const executionTime = end - start
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_end ${executionTime}`)

      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_ko`)

      return error
    }

    if (!response?.data?.ct || !response?.data?.update_date) {
      appLogger.error({
        error: ERROR_MESSAGES.malformedResponse,
        response,
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
