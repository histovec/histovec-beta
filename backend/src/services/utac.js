import axios from 'axios'
import config from '../config'
import { appLogger } from '../util/logger'
import { getAsync, setAsync } from '../connectors/redis'
import { techLogger } from '../util'

module.exports.UTACClient = class UTACClient {
  constructor () {
    this.axios = axios.create({
      baseURL: config.utacThroughInesUrl,
      timeout: config.utacTimeout,
      headers: {
        Accepts: 'application/json',
        'Content-Type': 'application/json',
      },
    })

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
        if (error.response.status === 429 || error.response.status === 503) {
          this.isApiAvailable = false
          setTimeout(async () => {
            const response = await this.healthCheck()
            this.isApiAvailable = response.status === 200
          }, config.utacHealthCheckRetrySeconds)
        }
        if (error.response.status === 401) {
          this.isApiAvailable = false
          setTimeout(async () => {
            const response = await this._authenticate()
            this.isAuthenticated = response.status === 200
          }, config.utacAuthenticateRetrySeconds)
        } else {
          return Promise.reject(error)
        }
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

        appLogger.debug({
          error: errorMessage,
          remote_error: error.message,
        })

        return {
          status: 429,
          message: errorMessage,
        }
      } else if (error.response && error.response.status === 503) {
        const errorMessage = 'Unavailable UTAC api'

        appLogger.debug({
          error: errorMessage,
          remote_error: error.message,
        })

        return {
          status: 503,
          message: errorMessage,
        }
      } else {
        const errorMessage = 'Unexpected UTAC api error'

        appLogger.debug({
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

    if (!this.isApiAvailable) {
      return {
        status: 503,
        message: 'Unavailable UTAC api',
      }
    }

    const UTAC_AUTH_TOKEN = await this._getAuthenticationCache()
    if (UTAC_AUTH_TOKEN) {
      this.axios.defaults.headers.common['Authorization'] = UTAC_AUTH_TOKEN
      appLogger.debug({
        debug: 'UTAC authentication already done',
        token: UTAC_AUTH_TOKEN,
      })
      return
    }

    try {
      const response = await this.axios.get('/auth', {
        auth: {
          username: config.utacUsername,
          password: config.utacPassword,
        },
      })

      techLogger.info(`-- AUTH response token -- ${response.data.token}`)
      const token = response.data && response.data.token
      if (token) {
        appLogger.debug({
          debug: 'UTAC authentication succeed',
          token: token,
        })

        await this._setAuthenticationCache(token)
        this.axios.defaults.headers.common['Authorization'] = UTAC_AUTH_TOKEN

        return {
          status: 200,
        }
      } else {
        const errorMessage = 'Token not found while authenticating to UTAC api'
        appLogger.warn({
          error: errorMessage,
          response,
        })

        return {
          status: 500,
          message: errorMessage,
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        appLogger.debug({
          error: 'Invalid login / password',
          remote_error: error.message,
        })
        return {
          status: 401,
          message: 'Not Found',
        }
      } else {
        techLogger.info(`-- ERROR -- ${error.message}`)
        appLogger.warn({
          error: 'Unexpected error from UTAC api server',
          remote_error: error.message,
        })
        return {
          status: 500,
          message: error.message,
        }
      }
    }
  }

  async _resetAuthenticate () {
    appLogger.debug({
      debug: 'reset UTAC authentication',
    })

    await setAsync('UTAC_AUTH_TOKEN', '')
    this.axios.defaults.headers.common['Authorization'] = null
    this.isAuthenticated = false

    return this._authenticate()
  }

  async _getAuthenticationCache () {
    return getAsync('UTAC_AUTH_TOKEN')
  }

  async _setAuthenticationCache (authToken) {
    await setAsync('UTAC_AUTH_TOKEN', authToken)
  }

  // /!\ This method must be called to configure UTACClient before using it /!\
  async initialize () {
    try {
      await this._authenticate()
      this.isAuthenticated = true
    } catch (error) {
      if (error.response && error.response.status === 401) {
        appLogger.warn({
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

    this.checkInitialization()
    if (!this.isApiAvailable) {
      return {
        status: 503,
        message: 'Unavailable UTAC api',
      }
    }

    if (resetAuthentication) {
      try {
        this._resetAuthenticate()
        this.isAuthenticated = true
      } catch (error) {
        return {
          status: 403,
          message: 'Failed to authenticate UTAC api',
        }
      }
    }

    if (!this.isAuthenticated) {
      return {
        status: 403,
        message: 'Failed to authenticate UTAC api',
      }
    }

    try {
      const response = await this.axios.post('/immat/search', {
        data: { immat: plaque },
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
        const errorMessage = 'Missing information in UTAC response'
        appLogger.warn({
          error: errorMessage,
          response: response,
        })
        return {
          status: 500,
          message: errorMessage,
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

        const errorMessage = 'Authentication to UTAC api failed'

        // The second one is real a login / password error
        appLogger.debug({
          error: errorMessage,
          plaque,
          remote_error: error.message,
        })

        return {
          status: 401,
          message: errorMessage,
        }
      } else if (error.response && error.response.status === 403) {
        const errorMessage = 'Forbidden'

        appLogger.debug({
          error: errorMessage,
          plaque,
          remote_error: error.message,
        })

        return {
          status: 403,
          message: errorMessage,
        }
      } else if (error.response && error.response.status === 404) {
        appLogger.debug({
          error: 'Unknown immatriculation',
          plaque,
          remote_error: error.message,
        })

        return {
          status: 200,
          source: 'utac',
          ct: [],
          updateDate: null,
        }
      } else if (error.response && error.response.status === 406) {
        const errorMessage = 'Invalid request'

        appLogger.debug({
          error: errorMessage,
          plaque,
          remote_error: error.message,
        })

        return {
          status: 406,
          message: errorMessage,
        }
      } else if (error.response && error.response.status === 429) {
        const errorMessage = 'Too many request'

        appLogger.debug({
          error: errorMessage,
          plaque,
          remote_error: error.message,
        })

        return {
          status: 429,
          message: errorMessage,
        }
      } else if (error.response && error.response.status === 503) {
        const errorMessage = 'Unavailable UTAC api'

        appLogger.debug({
          error: errorMessage,
          plaque,
          remote_error: error.message,
        })

        return {
          status: 503,
          message: errorMessage,
        }
      } else {
        const errorMessage = 'Unexpected error from UTAC api'

        appLogger.warn({
          error: errorMessage,
          plaque,
          remote_error: error.message,
        })

        return {
          status: error.response.status,
          message: errorMessage,
        }
      }
    }
  }
}
