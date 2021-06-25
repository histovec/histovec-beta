import axios from 'axios'
import { readFileSync } from 'fs'
import config from '../config'
import { Agent as HttpsAgent } from 'https'
import { decodingJWT } from '../util/jwt'
import { appLogger } from '../util/logger'


// /!\ boolean setting is passed as string /!\
// @todo: we should use typed yaml to load settings
const isVinSentToUtac = config.utac.isVinSentToUtac === true || config.utac.isVinSentToUtac === 'true'

module.exports.UTACClient = class UTACClient {
  constructor () {
    // /!\ boolean setting is passed as string /!\
    // @todo: we should use typed yaml to load settings
    const isFakedUtacApi = config.utac.isFakedApi === true || config.utac.isFakedApi === 'true'
    const baseURL = isFakedUtacApi ? config.utac.fakeApiUrl : config.utac.apiUrl

    const options = {
      ...(
        // No https needed for local faked api
        // For production, https certificate is managed by the PIO
        isFakedUtacApi || config.isProd
          ? {}
          : { httpsAgent: new HttpsAgent({
            keepAlive: true,
            ca: readFileSync(config.utac.utacPem),
            pfx: readFileSync(config.utac.histovecPfx),
            passphrase: config.utac.histovecPfxPassphrase,
          }) }
      ),
      baseURL,
      timeout: config.utac.timeout,
      headers: {
        Accepts: 'application/json',
        'Content-Type': 'application/json',
        ...((config.isProd && !isFakedUtacApi) ? { Token: config.utac.inesToken } : {}),
      },
    }

    this.axios = axios.create(options)

    this.axios.interceptors.request.use(
      async (request) => {
        appLogger.debug({
          debug: `UTAC - ${request.url}`,
          data: request.data || {},
          auth: request.auth || {},
          headers: request.headers || {},
        })

        if (request.url !== '/auth') {
          const authorizationHeader = this.axios.defaults.headers.common['Authorization']

          if (authorizationHeader) {
            const utacApiJWT = authorizationHeader.split(' ')[1]
            const { exp: expirationTimeAsSeconds } = decodingJWT(utacApiJWT)

            // Convert Date.getTime() to seconds since JWT uses time with seconds
            const nowTimeAsSeconds = Math.floor(new Date().getTime() / 1000)

            if (nowTimeAsSeconds > expirationTimeAsSeconds) {
              const authorizationHeader = await this._authenticate()
              if (authorizationHeader) {
                request.headers.Authorization = authorizationHeader
              }
            }
          } else {
            const authorizationHeader = await this._authenticate()
            if (authorizationHeader) {
              request.headers.Authorization = authorizationHeader
            }
          }
        }

        return request
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  async healthCheck () {
    appLogger.debug({
      debug: 'UTACClient - healthCheck',
    })

    try {
      const response = await this.axios.get('/healthcheck')

      return {
        status: response.status,
        message: 'OK',
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // @todo: use https://www.npmjs.com/package/request-rate-limiter instead
        const errorMessage = 'Too many request'

        appLogger.error({
          error: errorMessage,
          remote_error: error.message,
        })

        return {
          status: 429,
          message: errorMessage,
        }
      } else if (error.response && error.response.status === 503) {
        const errorMessage = 'Unavailable UTAC api'

        appLogger.error({
          error: errorMessage,
          remote_error: error.message,
        })

        return {
          status: 503,
          message: errorMessage,
        }
      } else {
        const errorMessage = 'Unexpected UTAC api error'

        appLogger.error({
          error: errorMessage,
          remote_error: error.message,
        })

        return {
          status: 500,
          message: errorMessage,
        }
      }
    }
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
        remote_error: error,
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

    const errorMessages = {
      401: 'Authentication to UTAC api failed',
      403: 'Forbidden',
      404: 'Unknown immatriculation',
      406: 'Invalid request',
      429: 'Too many request',
      500: 'Missing information in UTAC response',
      503: 'Unavailable UTAC api',
      default: 'Unexpected error from UTAC api',
    }

    try {
      const response = await this.axios.post('/immat/search', {
        immat,
        ...(isVinSentToUtac ? { vin } : {}),
      })

      const end = new Date()
      const executionTime = end - start
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_end ${executionTime}`)

      if (response.data && response.data.ct && response.data.update_date) {
        appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_ok`)

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
      } else {
        appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_ko`)

        appLogger.error({
          error: errorMessages[500],
          response: response,
        })
        return {
          status: 500,
          message: errorMessages[500],
        }
      }
    } catch (error) {
      const end = new Date()
      const executionTime = end - start
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_end ${executionTime}`)

      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_ko`)

      if (error.response && error.response.status === 401) {
        appLogger.error({
          error: errorMessages[401],
          remote_error: error.message,
        })

        return {
          status: 401,
          message: errorMessages[401],
        }
      } else if (error.response && error.response.status === 403) {
        appLogger.error({
          error: errorMessages[403],
          remote_error: error.message,
        })

        return {
          status: 403,
          message: errorMessages[403],
        }
      } else if (error.response && error.response.status === 404) {
        appLogger.error({
          error: errorMessages[404],
          remote_error: error.message,
        })

        return {
          status: 404,
          message: errorMessages[404],
        }
      } else if (error.response && error.response.status === 406) {
        appLogger.error({
          error: errorMessages[406],
          remote_error: error.message,
        })

        return {
          status: 406,
          message: errorMessages[406],
        }
      } else if (error.response && error.response.status === 429) {
        appLogger.error({
          error: errorMessages[429],
          remote_error: error.message,
        })

        return {
          status: 429,
          message: errorMessages[429],
        }
      } else if (error.response && error.response.status === 503) {
        appLogger.error({
          error: errorMessages[503],
          remote_error: error.message,
        })

        return {
          status: 503,
          message: errorMessages[503],
        }
      } else {
        appLogger.error({
          error: errorMessages['default'],
          remote_error: error.message,
        })

        return {
          status: error.response.status,
          message: errorMessages['default'],
        }
      }
    }
  }
}
