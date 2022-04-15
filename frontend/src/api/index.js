import 'whatwg-fetch'
import apiConf from '@/assets/json/backend.json'

const BASE_API_URL = apiConf.api.url.replace('<APP>', process.env.VUE_APP_TITLE).replace(/"/g, '').replace(/\/$/, '')


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
      const response = await fetch(`${BASE_API_URL}/report_by_data`, options)
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
      const response = await fetch(`${BASE_API_URL}/report_by_code`, options)
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

    const response = await fetch(`${BASE_API_URL}/log/${uid}/${normalizedPath}`, options)

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
      const response = await fetch(`${BASE_API_URL}/contact`, options)

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
