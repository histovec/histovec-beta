import { apiUrl } from '../config';
import api from '@/api/index.js'

export default {
  getVersionApi: async () => {
    try {
      const response = await fetch(`${apiUrl}/version`, {method: 'GET'})
      const report = await response.json()
      await api.log(`/version/${report.version}`)
    } catch (error) {
      return {
        report: null,
        status: 500,
      }
    }
  },
  getHealthApi: async () => {
    try {
      const response = await fetch(`${apiUrl}/health`, {method: 'GET'})
      const report = await response.json()
      await api.log(`/health/${report.status}`)
    } catch (error) {
      await api.log('/health/ko')
      return {
        report: null,
        status: 500,
      }
    }
  },
}
