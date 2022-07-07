<template>
  <div
    class="container-fluid"
  >
    <div v-if="synthese.length === 0 && !processedVehiculeData.lastSinistreYear">
      <div class="row">
        <!-- debut ras  -->
        <div class="col-sm-1">
          <i class="fa fa-check info_green fa-2x"></i>
        </div>
        <div class="col-sm-6">
          <span class="info_red txt-small-13">Rien à signaler </span>
          <span class="txt-small-13">du point de vue administratif
            <br />
            (gages, opposition, vol,...)
          </span>
        </div>
        <div
          v-if="false"
          class="col-sm-5"
        >
          <span class="color-info_2 bold_4 txt-small-13">Demandez au Vendeur un Certificat de Situation Administratif détaillé</span>
        </div>
        <!-- fin ras  -->
      </div>
    </div>
    <div
      v-for="(entry, index) in synthese"
      :key="index"
    >
      <div class="row info_red">
        <div class="col-sm-1">
          <i
            class="fa fa-2x pr-10"
            :class="syntheseMapping[entry].icon"
          >
          </i>
        </div>
        <div class="col-sm-6 txt-small-13">
          {{ syntheseMapping[entry].text }}
          <br />
          <a
            class="clickable btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
            @click="changeTab('situation')"
          >
            Détails
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </div>
        <div class="col-sm-5 color-info_2 bold_4 txt-small-13">
          {{ syntheseMapping[entry].adv }}
          <br />
          <a
            v-if="syntheseMapping[entry].link"
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
            :href="syntheseMapping[entry].link"
            rel="noopener noreferrer"
            target="_blank"
          >
            En savoir plus
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </div>
      </div>
      <!-- debut trait separation  -->
      <div class="separator-2 separator-lg"></div>
      <!-- fin trait separation  -->
    </div>
  </div>
</template>

<script>

import { formatMixin } from '../../mixins/format.js'
import { formatIsoToFrDate } from '../../assets/js/format.js'

import { VIGNETTE } from '../../constants/vehicle/critair.js'
import { USAGE_AGRICOLE, USAGE_COLLECTION } from '../../constants/usagesSynthese.js'

import imageLogoSimplimmat from '@/assets/img/simplimmat.png'


export default {
  mixins: [formatMixin],
  props: {
    processedVehiculeData: {
      type: Object,
      default: () => {},
    },
    isHolder: Boolean,
    changeTab: {
      type: Function,
      default: () => {},
    },
  },
  data () {
    return {
      imageLogoSimplimmat,

      VIGNETTE,
      USAGE_AGRICOLE,
      USAGE_COLLECTION,
    }
  },
  computed: {
    caracteristiquesTechniques () {
      return this.processedVehiculeData.caracteristiquesTechniques
    },
    certificat () {
      return this.processedVehiculeData.certificat
    },
    datePremiereImmatriculationFR () {
      return formatIsoToFrDate(this.certificat.datePremiereImmatriculation)
    },
    hasProcedureVEEnCours () {
      return this.processedVehiculeData.administratif.hasProcedureVEEnCours
    },
    synthese () {
      return this.processedVehiculeData.administratif.reportLabels.synthese
    },
    vignetteCritair () {
      return this.processedVehiculeData.vignetteCritair
    },
  },

  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/synthesis`)
  },

  methods: {
    logSimplimmatImage () {
      this.$store.dispatch('log', `${this.$route.path}/simplimmat/image`)
    },
    logSimplimmatLink () {
      this.$store.dispatch('log', `${this.$route.path}/simplimmat/link`)
    },
  },
}

</script>
