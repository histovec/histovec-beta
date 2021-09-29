<template>
  <div>
    <h6 class="text-center">
      Certificat de situation administrative détaillé
    </h6>
    <br />
    <p class="text-center">
      L'article R.322-4 du code de la route, précise que la remise du certificat d'immatriculation
      doit être accompagnée d'un certificat de situation administrative détaillé (CSA), établi depuis moins de quinze jours
      par le ministre de l'intérieur, attestant à sa date d'édition de la situation administrative du véhicule.
    </p>
    <p class="text-center">
      <button
        type="button"
        class="btn btn-animated btn-default btn-sm"
        title="certificat de situation administrative"
        @click="generatePdf"
      >
        Imprimer le CSA HistoVec
        <i class="fa fa-print"></i>
      </button>
    </p>
  </div>
</template>

<script>

import dayjs from 'dayjs'
import { generateCsa } from '../../utils/csaAsPdf'
import { RAPPORT_FILENAME } from '../../utils/csaAsPdf/constants'
import { FR_DATE_FORMAT } from '../../assets/js/format.js'

import histoVecLogo from '@/assets/img/histovec_logo_droite_name.png'
import marianneImage from '@/assets/img/logo_mi.png'


const downloadBlob = (blob, filename) => {
  const blobUrl = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = blobUrl
  a.download = filename || 'download'

  // Make the download to happen automatically without attaching the anchor element to the DOM
  a.click()

  // Usefull to release blobUrl when finished
  return blobUrl
}

export default {
  props: {
    processedSivData: {
      type: Object,
      default: () => {}
    },
    url: {
      type: String,
      default: ''
    },
    baseUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    validityDate () {
      return dayjs().add(1, 'month').date(8).format(FR_DATE_FORMAT)
    }
  },
  async mounted () {
    this.$store.dispatch('log', `${this.$route.path}/csa`)

    if (!this.histoVecLogoBytes) {
      this.histoVecLogoBytes = await fetch(histoVecLogo).then((res) => res.arrayBuffer())
    }

    if (!this.marianneImageBytes) {
      this.marianneImageBytes = await fetch(marianneImage).then((res) => res.arrayBuffer())
    }
  },
  beforeDestroy () {
    URL.revokeObjectURL(this.csaObjectURL)
  },
  methods: {
    async generatePdf () {
      this.$store.dispatch('log', `${this.$route.path}/csa/download`)

      const isAnnulationCI = this.processedSivData.administratif.isAnnulationCI
      const csaLabels = this.processedSivData.administratif.csaLabels

      const csaPdfBytes = await generateCsa({
        isAnnulationCI,
        annulationCurrentStatus: csaLabels.annulationCurrentStatus,
        dateAnnulation: this.processedSivData.administratif.dateAnnulation,
        dateDonnees: this.showDataDate ? this.processedSivData.dateUpdate : null,
        histoVecLogoBytes: this.histoVecLogoBytes,
        marianneImageBytes: this.marianneImageBytes,
        marque: this.processedSivData.ctec.marque,
        plaque: this.$store.state.identity.plaque,
        premierCertificat: this.processedSivData.certificat.premier,
        qrCodeUrl: this.url,
        validityDate: this.validityDate,
        vin: this.processedSivData.ctec.vin,
        webSiteUrl: this.baseUrl
      },
      (
        !isAnnulationCI ? {
          duplicataTitre: csaLabels.titre.duplicata,
          dvsCurrentStatusLines: csaLabels.dvsCurrentStatusLines,
          gagesCurrentStatusLines: csaLabels.gagesCurrentStatusLines,
          historyItems: this.processedSivData.historique.map((item) => `${item.date} ${item.nature}`),
          otcisCurrentStatusLines: csaLabels.otcisCurrentStatusLines,
          otcisPvCurrentStatusLines: csaLabels.otcisPvCurrentStatusLines,
          oveisCurrentStatusLines: csaLabels.oveisCurrentStatusLines,
          ovesCurrentStatusLines: csaLabels.ovesCurrentStatusLines,
          perteTitre: csaLabels.titre.perte,
          proceduresReparationControleeStatus: csaLabels.proceduresReparationControleeStatus,
          suspensionsCurrentStatusLines: csaLabels.suspensionsCurrentStatusLines,
          volTitre: csaLabels.titre.vol,
          volVehicule: csaLabels.vol
        } : {}
      ))

      this.csaObjectURL = downloadBlob(
        new Blob([csaPdfBytes], { type: 'application/pdf' }),
        `${RAPPORT_FILENAME}.pdf`
      )
    }
  }
}

</script>
