import 'whatwg-fetch'
import { apiUrl } from '@/config.js'
import axios from 'axios'

const VITE_DISABLE_API_LOG = import.meta.env.VITE_DISABLE_API_LOG
const IS_API_LOG_DISABLED = VITE_DISABLE_API_LOG === 'true'


export default {
  getHolderReport: async (payload) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }

    try {
      const response = await fetch(`${apiUrl}/report_by_data`, options)
      const report = await response.json()

      return {
        report,
        status: response.status,
      }
    } catch (error) {
      return {
        report: null,
        status: 500,
      }
    }
  },
  getBuyerReport: async (payload) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }

    try {
      const response = await fetch(`${apiUrl}/report_by_code`, options)
      const report = await response.json()

      return {
        report,
        status: response.status,
      }
    } catch (error) {
      return {
        report: null,
        status: 500,
      }
    }
  },
  authentication: async () => {
    const dataBody = {
      login: import.meta.env.VITE_LOGIN_API_DATA,
      password: import.meta.env.VITE_PASSWORD_API_DATA,
    }

    await axios.post('/get_token', dataBody)
      .then(response => {
        axios.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`
      })
      .catch(async error => {
        if (error.response.status !== 403) {
          await axios.post('/get_token', dataBody)
            .then(response => {
              axios.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`
            })
            .catch(() => {
              axios.defaults.headers.common.Authorization = null
            })
        } else {
          axios.defaults.headers.common.Authorization = null
        }
      })
  },
  log: async (path) => {
    if (IS_API_LOG_DISABLED) {
      return new Promise(resolve => resolve())
    }

    const uuid = localStorage.getItem('userId')

    const options = {
      method: 'PUT',
    }

    return await fetch(`${apiUrl}/log/${uuid}${path}`, options)
  },
  sendContactEmail: async (contact) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(contact),
    }

    try {
      const response = await fetch(`${apiUrl}/contact`, options)

      return {
        status: response.status,
      }
    } catch (error) {
      return {
        status: 500,
      }
    }
  },
}
