import axios from 'axios'
import config from '../config.js'

export class ApiDataCLient {
  constructor () {
    // utiliser cette variable pour gérer le bouchon de l'appel à l'API data
    // const bouchonActive = config.apiData.isMocked
    const baseURL = config.apiData.apiUrl

    const options = {
      baseURL,
      headers: {
        header: 'application/json',
      },
    }

    this.axios = axios.create(options)
  }

  get = async (url) => {
    return await this.axios.get(url)
      .then(response => {
        return response.data
      })
      .catch(error => {
        throw error
      })
  }

  post = async (url, data) => {
    return await this.axios.post(url, data)
      .then(response => {
        return response.data
      })
      .catch(error => {
        throw error
      })
  }

  getByCode = async (uuid, clefAcheteur) => {
    return await this.get('/report_by_code/' + uuid + '/' + clefAcheteur)
  }

  getSivPhysique = async (uuid, data) => {
    return await this.post('/report_by_data/siv/physique/' + uuid, data)
  }

  getDictionnaireOpaType = async () => {
    return await this.get('/dicos/opa_type')
  }
}
