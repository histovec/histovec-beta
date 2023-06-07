import { defineStore } from 'pinia'
import axios from 'axios'
import api from '@Api/index.js'
import { vehiculeMapping } from '@Utils/mapping/mapper'

export const useRapportStore = defineStore('rapport',{
  state: () => ({
    id: null,
    status: null,
    message: null,
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
    getRapport(state){
      return state.rapportData
    },
    getChargement(state){
      return state.chargement
    },
  },
  actions: {
    async fetchRapportSivPersonne(dataBody, id) {
      try {
        this.chargement = true
        const data = await axios.post('/report_by_data/siv/personne', dataBody)

        if (data.status !== 200) {
          api.log('/holder/notFound')

          this.id = id
          this.status = data.status
          this.message = data.message
          this.rapportData = null
          this.chargement = false
        } else {
          this.id = id
          this.status = data.status
          this.message = data.message
          this.rapportData = vehiculeMapping(data.data.payload)
          this.chargement = false
        }
      }
      catch (error) {
        api.log('/holder/unavailable')

        this.id = id
        this.status = error.response.status
        this.message = error.response.statusText
        this.rapportData = null
        this.chargement = false
      }
    },
  },
})
