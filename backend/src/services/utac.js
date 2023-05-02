import axios from 'axios'
import { readFileSync } from 'fs'
import { utacResponseSchema } from '../services/utac/schemas/response.js'
import { Agent as HttpsAgent } from 'https'
import { syslogLogger } from '../util/logger.js'
import { decodingJWT } from '../util/jwt.js'
import config from '../config.js'

// @todo: A supprimer si on ne souhaite plus avoir de mock API UTAC
// @todo: Ou à migrer vers un serveur de mock API UTAC
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
      ct_vin: 'VF7JM8HZC97374672',
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
      ct_vin: 'VF7JM8HZC97374672',
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
      ct_vin: 'VF7JM8HZC97374672',
    },
  ],
  update_date: '01/08/2021',
  status: 200,
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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

class UTACClient {
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
        })
        : undefined,
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

      const authorizationHeader = this.axios.defaults.headers.common.Authorization

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
      syslogLogger.debug(
        {
          key: 'requete_to',
          tag: 'UTAC',
          value: {
            url: request.url,
            data: request.data || {},
            auth: request.auth || {},
            headersCommon: request.headers.common || {},
            headers: request.headers || {},
          },
        },
      )

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

      syslogLogger.info({ key: 'error_interceptor', tag: 'UTAC', value: { status, message } })

      const customError = new Error(message)
      customError.status = status === 'default' ? 500 : status
      return Promise.reject(customError)
    }

    // @todo: use 'runWhen' when it will be released
    this.axios.interceptors.request.use(authInterceptor) //, null, { runWhen: needAuth })
    this.axios.interceptors.response.use(null, errorInterceptor)
  }

  async healthCheck () {
    syslogLogger.debug({ key: 'health_check', tag: 'UTAC' })

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
        syslogLogger.debug({ key: 'authentication_succeed', tag: 'UTAC', value: { token } })

        const authorizationHeader = `bearer ${token}`
        this.axios.defaults.headers.common.Authorization = authorizationHeader

        return authorizationHeader
      }

      syslogLogger.error({ key: 'authentication_error_no_token', tag: 'UTAC' })
    } catch (error) {
      syslogLogger.error({ key: 'authentication_failed', tag: 'UTAC', value: { error } })
    }
  }

  async readControlesTechniques ({ immat, vin }, { uuid, isMocked }) {
    if (isMocked) {
      // Wait same times as production UTAC api response time
      const utacResponseTimeEstimationInMs = Math.trunc(248 + (100 * Math.random() - 100 / 2))
      syslogLogger.debug({ key: 'mock_time_to_wait', tag: 'UTAC', uuid, value: { utacResponseTimeEstimationInMs } })

      const start = new Date()
      syslogLogger.info({ key: 'mock_call_start', tag: 'UTAC', uuid })

      await sleep(utacResponseTimeEstimationInMs)

      const end = new Date()
      const executionTime = end - start
      syslogLogger.info({ key: 'mock_call_end', tag: 'UTAC', uuid, value: { executionTime } })

      const data = CONTROL_TECHNIQUES_MOCK_FOR_BPSA

      const { error } = utacResponseSchema.validate(data)

      if (error) {
        syslogLogger.error({ key: 'malformed_mock_utac_response', tag: 'UTAC', uuid, value: { error } })

        return {
          status: 500,
          message: ERROR_MESSAGES.malformedResponse,
        }
      }

      return {
        status: data.status,
        ct: data.ct,
        updateDate: data.update_date,
      }
    }

    const start = new Date()
    syslogLogger.info({ key: 'call_utac_start', tag: 'UTAC', uuid })
    syslogLogger.debug({ key: 'call_utac_start_data', tag: 'UTAC', uuid, value: { immat, vin } })

    let response = null

    try {
      response = await this.axios.post('/immat/search', {
        immat,
        vin,
      })
      const { data } = response

      const end = new Date()
      const executionTime = end - start

      const { error } = utacResponseSchema.validate(data)
      if (error) {
        syslogLogger.error({ key: 'malformed_utac_response', tag: 'UTAC', uuid, value: { error } })

        return {
          status: 500,
          message: ERROR_MESSAGES.malformedResponse,
        }
      }

      syslogLogger.info({ key: 'call_utac_end_ok', tag: 'UTAC', uuid, value: { executionTime } })
    } catch (error) {
      // That should never happen
      const end = new Date()
      const executionTime = end - start
      syslogLogger.error({ key: 'call_utac_end_ko', tag: 'UTAC', uuid, value: { executionTime, error } })

      return {
        status: 500,
        message: ERROR_MESSAGES[500],
      }
    }

    syslogLogger.debug({ key: 'result_found', tag: 'UTAC', uuid, value: { immat, ct: response.data.ct, update_date: response.data.update_date } })

    return {
      status: response.status,
      ct: response.data.ct,
      updateDate: response.data.update_date,
    }
  }
}

export { UTACClient }
