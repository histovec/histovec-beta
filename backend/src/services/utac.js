import axios from 'axios'
import { readFileSync } from 'fs'
import config from '../config'
import { Agent as HttpsAgent } from 'https'

import { appLogger } from '../util/logger'
import { techLogger } from '../util'

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
    this.isApiAvailable = true
    this.isAuthenticated = false

    this.axios.interceptors.request.use(
      request => {
        appLogger.debug({
          debug: `UTAC - ${request.url}`,
          data: request.data || {},
          auth: request.auth || {},
          headers: request.headers || {},
        })

        return request
      },
      error => {
        return Promise.reject(error)
      }
    )

    this.axios.interceptors.response.use(
      response => {
        return response
      },
      error => {
        if (error.response && (error.response.status === 429 || error.response.status === 503)) {
          this.isApiAvailable = false
          setTimeout(async () => {
            const response = await this.healthCheck()
            this.isApiAvailable = response.status === 200
          }, config.utac.healthCheckRetrySeconds)
        }
        if (error.response && error.response.status === 401) {
          this.isApiAvailable = false
          setTimeout(async () => {
            const response = await this._authenticate()

            this.isAuthenticated = response.status === 200
          }, config.utac.authenticateRetrySeconds)
        } else {
          return Promise.reject(error)
        }
      }
    )
  }

  async ensureTokenValidity () {

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
    appLogger.debug({
      debug: 'UTACClient - authenticate',
    })

    const errorMessages = {
      401: 'Authentication to UTAC api failed',
      500: 'Missing information in UTAC response',
      503: 'Unavailable UTAC api',
      default: 'Unexpected error from UTAC api',
    }

    if (!this.isApiAvailable) {
      return {
        status: 503,
        message: errorMessages[503],
      }
    }

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

        this.axios.defaults.headers.common['Authorization'] = `bearer ${token}`

        return {
          status: 200,
        }
      } else {
        appLogger.error({
          error: 'Token not found while authenticating to UTAC api',
          response,
        })

        return {
          status: 500,
          message: errorMessages[500],
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        appLogger.error({
          error: errorMessages[401],
          remote_error: error.message,
        })
        return {
          status: 401,
          message: errorMessages[401],
        }
      } else {
        appLogger.error({
          error: errorMessages['default'],
          remote_error: error.message,
        })
        return {
          status: 500,
          message: errorMessages['default'],
        }
      }
    }
  }

  async _resetAuthenticate () {
    appLogger.debug({
      debug: 'reset UTAC authentication',
    })

    this.axios.defaults.headers.common['Authorization'] = null
    this.isAuthenticated = false

    return this._authenticate()
  }

  // /!\ This method must be called to configure UTACClient before using it /!\
  async initialize () {
    try {
      await this._authenticate()
      this.isAuthenticated = true
    } catch (error) {
      if (error.response && error.response.status === 401) {
        appLogger.error({
          error: 'UTACClient - Failed to authenticate',
          response: error.response,
        })
      }
    }

    this.isInitialized = true
  }

  checkInitialization () {
    if (!this.isInitialized) {
      throw new Error(
        'You should call UTACClient.initialize() before using this method'
      )
    }
  }

  async readControlesTechniques (plaque, resetAuthentication = false) {
    appLogger.debug({
      debug: 'UTACClient - readControlesTechniques',
      plaque,
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

    this.checkInitialization()
    if (!this.isApiAvailable) {
      return {
        status: 503,
        message: errorMessages[503],
      }
    }

    if (resetAuthentication) {
      try {
        this._resetAuthenticate()
        this.isAuthenticated = true
      } catch (error) {
        return {
          status: 403,
          message: errorMessages[403],
        }
      }
    }

    if (!this.isAuthenticated) {
      return {
        status: 403,
        message: errorMessages[403],
      }
    }

    try {
      const response = await this.axios.post('/immat/search', {
        immat: plaque,
      })

      if (response.data && response.data.ct && response.data.update_date) {
        appLogger.debug({
          debug: 'UTAC result found',
          plaque,
          ct: response.data.ct,
          update_date: response.data.update_date,
        })

        return {
          status: response.status,
          source: 'utac',
          ct: response.data.ct,
          updateDate: response.data.update_date,
        }
      } else {
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
      if (error.response && error.response.status === 401) {
        // The first 401 may be due to a token expiration
        if (!resetAuthentication) {
          return this.readControlesTechniques(
            plaque,
            (resetAuthentication = true)
          )
        }

        // The second one is real a login / password error
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
