import axios from 'axios'
import config from '../config.js'
import { SIV_PHYSIQUE, SIV_PHYSIQUE_MIN } from '../constant/bouchon/siv_physique.js'

// utiliser cette variable pour gérer le bouchon de l'appel à l'API data
const bouchonActive = config.apiData.isSIVMockActivated

export class ApiDataCLient {
  constructor () {
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
    if (bouchonActive) {
      return SIV_PHYSIQUE
    }
    return await this.get('/report_by_code/' + uuid + '/' + clefAcheteur)
  }

  getSivPhysique = async (uuid, data) => {
    if (bouchonActive) {
      if (data.nom === 'vehiculeMin') {
        return {
          status: SIV_PHYSIQUE_MIN.status,
          message: SIV_PHYSIQUE_MIN.message,
          payload: SIV_PHYSIQUE_MIN.payload,
        }
      } else {
        return {
          status: SIV_PHYSIQUE.status,
          message: SIV_PHYSIQUE.message,
          payload: SIV_PHYSIQUE.payload,
        }
      }
    }
    return await this.post('/report_by_data/siv/physique/' + uuid, data)
  }

  getDictionnaireOpaType = async () => {
    return await this.get('/dicos/opa_type')
  }
}
