import { defineStore } from 'pinia'
import axios from 'axios'
import api from '@Api/index.js'
import {
  reponseRequeteApiCode200,
} from '@/tests/fixtures/index'

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
    async fetchRapport(url, id = null, dataBody = null) {
/*
      this.id = id
      this.status = reponseRequeteApiCode200.status //500
      this.message = reponseRequeteApiCode200.message
      this.reponseData = reponseRequeteApiCode200.data
      this.rapportData = null
      this.chargement = false
      return
 */

      try {
        this.chargement = true
        const data = await axios.post(url, dataBody)

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
        api.log('/holder/unavailable/' + JSON.stringify(error))

        this.id = id
        this.status = error.response.status
        this.message = error.response.statusText
        this.reponseData = null
        this.rapportData = null
        this.chargement = false
      }
    },
    async fetchRapportSivPersonne(dataBody, id) {
      await this.fetchRapport('/report_by_data/siv/personne', id, dataBody)
    },
    async fetchRapportAcheteur(uuidNavigateur, key) {
      await this.fetchRapport('/report_by_code/'.concat(uuidNavigateur + '/' + key))
    },
    async setRapport(rapport) {
      this.rapportData = rapport
    },
  },
})
