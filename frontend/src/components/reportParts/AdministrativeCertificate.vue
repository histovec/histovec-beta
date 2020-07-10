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
        Imprimer le CSA
        <i class="fa fa-print"></i>
      </button>
    </p>
  </div>
</template>

<script>

import dayjs from 'dayjs'
import { generateCsa } from '@sebastien.nicolas/csa-as-pdf'
import { RAPPORT_FILENAME } from '../../utils/csaAsPdfRewrite/constants'

import histoVecLogo from '@/assets/img/histovec_logo_droite_name.png'
import marianneImage from '@/assets/img/logo_mi_header.png'


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
    v: {
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
      return dayjs().add(1, 'month').date(8).format('DD/MM/YYYY')
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
    console.log('before free CSA object URL')  // eslint-disable-line no-console
    URL.revokeObjectURL(this.csaObjectURL)
    console.log('after free CSA object URL')  // eslint-disable-line no-console
  },
  methods: {
    async generatePdf () {
      this.$store.dispatch('log', `${this.$route.path}/csa/download`)

      const isAnnulationCI = this.v.administratif.isAnnulationCI
      const csaLabels = this.v.administratif.csaLabels

      const csaPdfBytes = await generateCsa({
        isAnnulationCI,
        annulationCurrentStatus: csaLabels.annulationCurrentStatus,
        dateAnnulation: this.v.administratif.dateAnnulation,
        histoVecLogoBytes: this.histoVecLogoBytes,
        marianneImageBytes: this.marianneImageBytes,
        marque: this.v.ctec.marque,
        plaque: this.$store.state.identity.plaque,
        premierCertificat: this.v.certificat.premier,
        qrCodeUrl: this.url,
        validityDate: this.validityDate,
        vin: this.v.ctec.vin,
        webSiteUrl: this.baseUrl
      },
      (
        !isAnnulationCI ? {
          duplicataTitre: csaLabels.titre.duplicata,
          dvsCurrentStatusLines: csaLabels.dvsCurrentStatusLines,
          gagesCurrentStatusLines: csaLabels.gagesCurrentStatusLines,
          historyItems: this.v.historique.map((item) => `${item.date} ${item.nature}`),
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

      console.log('before csa Object URL')  // eslint-disable-line no-console
      this.csaObjectURL = downloadBlob(
        new Blob([csaPdfBytes], { type: 'application/pdf' }),
        `${RAPPORT_FILENAME}.pdf`
      )
      // this.csaObjectURL = URL.createObjectURL(
      //   new Blob([csaPdfBytes], { type: 'application/pdf' }),
      // )

      console.log('after download CSA')  // eslint-disable-line no-console
      // window.open(this.csaObjectURL, '_blank')
    }
  }
}

</script>
