import { defineStore } from 'pinia'
import axios from 'axios'
import api from '@Api/index.js'
import { vehiculeMapping } from '@Utils/mapping/mapper';
import { formaterRapport } from '@Utils/format/formatRapport'

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
    getControlesTechniques(state){
      return state.rapportData.vehicule.controlesTechniques
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
          // todo Ajouter la vérification des datas

          // mappe la réponse
          let rapport = vehiculeMapping(data.data)

          // formate les dates
          rapport = formaterRapport(rapport)

          this.id = id
          this.status = data.status
          this.message = data.message
          this.rapportData = rapport
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
