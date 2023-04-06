import 'whatwg-fetch'
import { apiUrl } from '../config.js'

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
