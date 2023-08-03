import { defineStore } from 'pinia'
import axios from 'axios'

export const useRapportStore = defineStore('rapport',{
  state: () => ({
    id: null,
    status: null,
    message: null,
    reponseData: null,
    rapportData: null,
    chargement: false,
    ignorerRequete: false,
  }),
  getters: {
    getId(state){
      return state.id
    },
    getStatus(state){
      return state.status
    },
    getMessage(state){
      return state.message
    },
    getReponseData(state){
      return state.reponseData
    },
    getRapport(state){
      return state.rapportData
    },
    getChargement(state){
      return state.chargement
    },
    getIgnorerRequete(state){
      return state.ignorerRequete
    },
    getControlesTechniques(state){
      return state.rapportData && state.rapportData.utac ? state.rapportData.utac : null
    },
  },
  actions: {
    async fetchRapport(methode, url, dataBody, id) {
      try {
        this.chargement = true
        const data = await axios[methode](url, dataBody)

        this.id = id
        this.status = data.status
        this.message = data.message
        this.reponseData = data.status === 200 ?data.data : null
        this.rapportData = null
        this.chargement = false
      } catch (error) {
        this.id = id
        this.status = error.response.status
        this.message = error.response.statusText
        this.reponseData = null
        this.rapportData = null
        this.chargement = false
      }
    },
    async fetchRapportSivPersonne(dataBody, id, uuidNavigateur) {
      await this.fetchRapport('post', `/report_by_data/siv/physique/${uuidNavigateur}`, dataBody, id)
    },
    async fetchRapportSivMorale(dataBody, id, uuidNavigateur){
      await this.fetchRapport('post', `/report_by_data/siv/morale/${uuidNavigateur}`, dataBody, id)
    },
    async fetchRapportIvtPhysique(dataBody, id, uuidNavigateur){
      await this.fetchRapport('post', `/report_by_data/ivt/physique/${uuidNavigateur}`, dataBody, id)
    },
    async fetchRapportIvtMorale(dataBody, id, uuidNavigateur){
      await this.fetchRapport('post', `/report_by_data/ivt/morale/${uuidNavigateur}`, dataBody, id)
    },
    async fetchRapportAcheteur(key, uuidNavigateur){
      await this.fetchRapport('get', `/report_by_code/${uuidNavigateur}/${key}`, null, key)
    },
  },
})
