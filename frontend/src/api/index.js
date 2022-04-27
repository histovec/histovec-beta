import 'whatwg-fetch'
import { apiUrl } from '../config.js'


export default {
  getHolderReport: async (
    uuid,
    payload
  ) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify({ uuid, ...payload }),
    }

    try {
      const response = await fetch(`${apiUrl}/report_by_data`, options)
      const report = await response.json()

      return {
        report,
        status: response.status
      }
    } catch (error) {
      return {
        report: null,
        status: 500
      }
    }
  },
  getBuyerReport: async (
    uuid,
    payload
  ) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify({ uuid, ...payload })
    }

    try {
      const response = await fetch(`${apiUrl}/report_by_code`, options)
      const report = await response.json()


      return {
        report,
        status: response.status
      }
    } catch (error) {
      return {
        report: null,
        status: 500
      }
    }
  },
  log: async (path, uid) => {
    const normalizedPath = path.replace(/^\/\w+\//, '')

    const options = {
      method: 'PUT',
    }

    const response = await fetch(`${apiUrl}/log/${uid}/${normalizedPath}`, options)

    return response
  },
  sendContact: async (contact) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(contact)
    }

    try {
      const response = await fetch(`${apiUrl}/contact`, options)

      return {
        status: response.status
      }
    } catch (error) {
      return {
        status: 500
      }
    }
  }
}
