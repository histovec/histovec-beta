<template>
  <div>
    <div class="row">
      <div class="col-sm-4">
        <span class="txt-small-12"><h6>Date</h6></span>
      </div>
      <div class="col-sm-8">
        <span class="bold txt-small-12"><h6>Opération</h6></span>
      </div>
    </div>
    <div class="separator"></div>

    <div
      v-for="(entry, index) in processedVehicleData.historique"
      :key="index"
    >
      <div class="row">
        <div class="col-sm-2">
          <span class="txt-small-12">{{ entry.date }}</span>
        </div>
        <div class="col-sm-10">
          <span class="info_red txt-small-12">
            {{ entry.nature }}
            <span
              v-if="entry.numAgree"
            >
              n° d'agrément <b>{{ entry.numAgree }}</b> -
              <a
                class="clickable text-info"
                @click="numAgreeModal = true"
              >
                En savoir plus
                <i class="fa fa-info-circle fa-lg"></i>
              </a>
            </span>
          </span>
        </div>
      </div>
      <div class="separator pv-5"></div>
    </div>
    <div v-if="processedVehicleData.certificat.isIncertain">
      <div class="row">
        <div class="col-sm-2">
          <span class="txt-small-12">{{ processedVehicleData.certificat.fr }}</span>
        </div>
        <div class="col-sm-10">
          <span class="info_red txt-small-12"> Première immatriculation (source incertaine)</span>
        </div>
      </div>
      <div class="separator pv-5"></div>
    </div>
    <!-- fin tableau operation historique FR -->
    <br />
    <div v-if="processedVehicleData.certificat.etranger">
      Historique des opérations à l'étranger
    </div>
    <!-- debut tableau operation historique Etranger -->
    <div v-if="processedVehicleData.certificat.etranger">
      <div class="row">
        <div class="col-sm-4">
          <span class="txt-small-12"><h6>Date</h6></span>
        </div>
        <div class="col-sm-8">
          <span class="bold txt-small-12"><h6>Opération</h6></span>
        </div>
      </div>
      <div class="separator"></div>
      <div>
        <div class="row">
          <div class="col-sm-2">
            <span class="txt-small-12">{{ processedVehicleData.certificat.premier }}</span>
          </div>
          <div class="col-sm-10">
            <span class="info_red txt-small-12">Première immatriculation à l'étranger</span>
          </div>
        </div>
        <div class="separator pv-5"></div>
      </div>
    </div>

    <modal-helper
      v-if="numAgreeModal"
      @close="numAgreeModal = false"
    >
      <span slot="title">Plus d'infos à propos du numéro d'expert agréé</span>
      <div slot="body">
        <p>
          HistoVec ne délivre pas les détails des rapports d’experts en automobile.
        </p>
        <p>
          Pour davantage de précisions sur un rapport, vous pouvez rechercher les coordonnées d’un expert en automobile sur la
          <a
            href="https://www.securite-routiere.gouv.fr/sites/default/files/2019-10/liste_nationale_des_experts_en_automobile.pdf"
            target="_blank"
          >
            liste nationale
            <b><i class="fa fa-file-pdf-o"></i></b>
          </a>
          mise à jour par le ministère chargé des transports.
        </p>
      </div>
    </modal-helper>
  </div>
</template>

<script>

import ModalHelper from '../infos/ModalHelper'

export default {
  components: {
    ModalHelper
  },
  props: {
    processedVehicleData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      numAgreeModal: false,
    }
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/history`)
  }
}

</script>
