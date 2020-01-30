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
        v-if="imagesLoading === 0"
        type="button"
        class="btn btn-animated btn-default btn-sm"
        title="certificat de situation administrative"
        @click="generatePDF"
      >
        Imprimer le CSA
        <i class="fa fa-print"></i>
      </button>
    </p>
  </div>
</template>

<script>

import dayjs from 'dayjs'
import { generateCsa } from '../../utils/csaAsPdf'

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
  data () {
    return {
      imagesLoading: -1,
      images: {
        marianne: {
          url: 'assets/images/logo_mi_header.png'
        },
        histovec: {
          url: 'assets/images/histovec-logo-droite-name.png'
        }
      }
    }
  },
  computed: {
    validityDate () {
      return dayjs().add(1, 'month').date(8).format('DD/MM/YYYY')
    }
  },
  created () {
    this.imagesLoading = Object.keys(this.images).length
    Object.keys(this.images).forEach((key) => {
      this.images[key].status = false
      this.images[key].img = new Image()
      this.images[key].img.src = this.images[key].url
      this.images[key].img.onload = () => {
        this.imagesLoading = this.imagesLoading - 1
      }
    })
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/csa`)
  },
  methods: {
    generatePDF () {
      this.$store.dispatch('log', `${this.$route.path}/csa/download`)

      generateCsa({
        annulation: this.v.administratif.annulation,
        dateAnnulation: this.v.administratif.dateAnnulation,
        duplicataTitre: this.v.administratif.titre.duplicata,
        gage: this.v.administratif.gage,
        hasPVE: this.$store.state.siv.v.suspensions && this.$store.state.siv.v.suspensions.includes('PVE'),
        historyItems: this.v.historique.map((item) => `${item.date} ${item.nature}`),
        histoVecLogo: this.images['histovec'].img,
        marianneImage: this.images['marianne'].img,
        marque: this.v.ctec.marque,
        ove: this.v.administratif.ove,
        otci: this.v.administratif.otci,
        perteTitre: this.v.administratif.titre.perte,
        plaque: this.$store.state.identity.plaque,
        premierCertificat: this.v.certificat.premier,
        pv: this.v.administratif.pv,
        qrCodeUrl: this.url,
        saisie: this.v.administratif.saisie,
        suspension: this.v.administratif.suspension,
        suspensions: this.v.administratif.suspensions,
        validityDate: this.validityDate,
        vin: this.v.ctec.vin,
        volTitre: this.v.administratif.titre.vol,
        volVehicule: this.v.administratif.vol,
        webSiteUrl: this.baseUrl
      })
    }
  }
}

</script>
