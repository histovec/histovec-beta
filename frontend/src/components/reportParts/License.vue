<template>
  <div>
    <h6 class="title">
      Titulaire
    </h6>
    <!-- debut titulaire et co-titulaire -->
    <div v-if="titulaire.nature">
      <div class="row">
        <div class="col-sm-5">
          <span class="txt-small-12">Nature</span>
        </div>
        <div class="col-sm-7">
          <span class="txt-small-12">{{ titulaire.nature }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>

    <div class="row">
      <div class="col-sm-5">
        <span class="txt-small-12">Identité</span>
      </div>
      <div class="col-sm-7">
        <span class="info_red txt-small-12">{{ titulaire.identite }}</span>
      </div>
    </div>
    <div class="separator"></div>

    <div class="row">
      <div class="col-sm-5">
        <span class="txt-small-12">Code postal</span>
      </div>
      <div class="col-sm-7">
        <span class="info_red txt-small-12">{{ titulaire.adresse }}</span>
      </div>
    </div>
    <div class="separator"></div>
    <!-- fin tableau titulaire et co-titulaire -->
    <h6 class="title">
      Carte grise
    </h6>
    <!-- debut tableau carte grise -->
    <div class="row">
      <div class="col-sm-5">
        <span class="txt-small-12">Date de première immatriculation</span>
        <span
          v-if="certificat.isVehiculeImporteDepuisEtranger"
          class="txt-small-12"
        >
          à l'étranger
        </span>
      </div>
      <div class="col-sm-7">
        <span class="info_red txt-small-12">{{ datePremiereImmatriculationFR }}</span>
      </div>
    </div>
    <div class="separator"></div>
    <div v-if="certificat.isVehiculeImporteDepuisEtranger">
      <div class="row">
        <div class="col-sm-5">
          <span class="txt-small-12">Date de première immatriculation en France</span>
        </div>
        <div class="col-sm-7">
          <span class="info_red txt-small-12">{{ datePremiereImmatriculationEnFranceFR }}</span>
        </div>
      </div>
      <div class="separator"></div>
    </div>
    <div class="row">
      <div class="col-sm-5">
        <span class="txt-small-12">Date de la carte grise actuelle</span>
      </div>
      <div class="col-sm-7">
        <span class="info_red txt-small-12">{{ dateEmissionCIFR }}</span>
      </div>
    </div>
    <div class="separator"></div>
  </div>
</template>

<script>

import { formatIsoToFrDate } from '../../assets/js/format.js'

export default {
  props: {
    certificat: {
      type: Object,
      default: () => {}
    },
    titulaire: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/holder`)
  },
  computed: {
    datePremiereImmatriculationFR () {
      return formatIsoToFrDate(this.certificat.datePremiereImmatriculation)
    },
    datePremiereImmatriculationEnFranceFR () {
      return formatIsoToFrDate(this.certificat.datePremiereImmatriculationEnFrance)
    },
    dateEmissionCIFR () {
      return formatIsoToFrDate(this.certificat.dateEmissionCI)
    },
  }
}

</script>
