import { defineStore } from 'pinia'
import axios from 'axios'
import api from '@Api/index.js'

export const useRapportStore = defineStore('rapport',{
  state: () => ({
    id: null,
    status: null,
    message: null,
    reponseData: null,
    rapportData: null,
    chargement: false,
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
    getControlesTechniques(state){
      return state.rapportData.vehicule.controlesTechniques
    },
  },
  actions: {
    async fetchRapport(url, dataBody, id) {
      try {
        this.chargement = true
        const data = await axios.post('/report_by_data'.concat(url), dataBody)

        if (data.status !== 200) {
          api.log('/holder/notFound')

          this.id = id
          this.status = data.status
          this.message = data.message
          this.reponseData = null
          this.rapportData = null
          this.chargement = false
        } else {
          this.id = id
          this.status = data.status
          this.message = data.message
          this.reponseData = data.data
          this.rapportData = null
          this.chargement = false
        }
      }
      catch (error) {
        api.log('/holder/unavailable')

        this.id = id
        this.status = error.response.status
        this.message = error.response.statusText
        this.reponseData = null
        this.rapportData = null
        this.chargement = false
      }
    },
    async fetchRapportSivPersonne(dataBody, id) {
      await this.fetchRapport('/siv/personne', dataBody, id)
    },
    async setRapport(rapport) {
      this.rapportData = rapport
    },
  },
})
