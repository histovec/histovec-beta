<template>
  <section id="result">
    <div class="breadcrumb-container">
      <div class="container">
        <ol class="breadcrumb">
          <li>
            <i class="fa fa-home pr-10"></i>
            <router-link
              :to="{ name: 'home' }"
            >
              Accueil
            </router-link>
          </li>
          <li class="active">
            Résultats
          </li>
        </ol>
      </div>
    </div>

    <section class="main-container">
      <div class="container">
        <div class="row">
          <!-- section start -->
          <section
            class="dark-translucent-bg"
            :style="{ backgroundImage: `url('${imagePoigneeDeMain}')`, backgroundPosition: '50% 50%' }"
          >
            <div class="container">
              <div class="row justify-content-lg-center">
                <div class="col-lg-12">
                  <h2 class="text-center mt-4">
                    <div v-if="holder">
                      <span class="bold_6">Rassurez</span> vos acheteurs potentiels
                    </div>
                    <div v-else>
                      <span class="bold_6">Achetez</span> en confiance un <span class="bold_6">véhicule d'occasion</span>
                    </div>
                  </h2>
                  <div class="separator with-icon">
                    <i class="fa fa-car bordered"></i>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <!-- section end -->
        </div>
      </div>
    </section>

    <div
      v-if="status === 'ok'"
      class="container"
    >
      <div class="row">
        <div class="col-lg-12 mb-20">
          <!-- debut vignette -->
          <div class="row">
            <div class="col-sm-6">
              <div
                v-if="!processedVehicleData.administratif.isAnnulationCI"
                class="alert alert-icon alert-info"
                role="alert"
              >
                <i :class="'fa fa-' + processedVehicleData.logoVehicule"></i>
                Numéro - Plaque d'immatriculation : {{ processedVehicleData.plaque }}
              </div>
              <div
                v-if="processedVehicleData.administratif.isAnnulationCI"
                class="alert alert-icon alert-danger"
                role="alert"
              >
                <i class="fa fa-warning"></i>
                Le certificat demandé a été annulé : {{ processedVehicleData.plaque }}
              </div>
            </div>
            <div class="col-sm-6">
              <div
                v-if="processedVehicleData.dateUpdate && processedVehicleData.dateUpdate != DEFAULT_DATE_UPDATE"
                class="alert alert-icon alert-warning"
                role="alert"
              >
                <i class="fa fa-calendar-check-o"></i>
                <span v-if="$store.state.config.dataDate">
                  Informations du ministère de l'Intérieur datant du
                  <strong>{{ processedVehicleData.dateUpdate }}</strong>
                </span>
                <span v-else>
                  Informations connues d'HistoVec à ce jour
                </span>
              </div>
              <div
                v-if="!$store.state.config.dataDate && processedVehicleData.dateUpdate && processedVehicleData.dateUpdate === DEFAULT_DATE_UPDATE"
                class="alert alert-icon alert-warning"
                role="alert"
              >
                <i class="fa fa-calendar-check-o"></i>
                <span v-if="!$store.state.config.dataDate">
                  Informations connues d'HistoVec à ce jour
                </span>
              </div>
            </div>
          </div>
          <!-- fin vignette -->
          <!-- debut trait séparation -->
          <div class="separator-2"></div>
          <!-- fin trait séparation -->
          <!-- debut nouvelle info -->
          <!-- Tabs start -->
          <div class="vertical">
            <!-- Nav tabs -->
            <ul
              class="nav nav-tabs"
              role="tablist"
            >
              <li
                v-if="!processedVehicleData.administratif.isAnnulationCI"
                :class="[{'active' : tab === 'abstract'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'abstract'"
                >
                  <i class="fa fa-refresh pr-10"></i>
                  Synthèse
                </a>
              </li>
              <li
                v-if="!processedVehicleData.administratif.isAnnulationCI"
                :class="[{'active' : tab === 'vehicle'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'vehicle'"
                >
                  <i :class="'fa fa-' + processedVehicleData.logoVehicule + ' pr-10'"></i>
                  Véhicule
                </a>
              </li>
              <li
                v-if="!processedVehicleData.administratif.isAnnulationCI"
                :class="[{'active' : tab === 'holder'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'holder'"
                >
                  <i class="fa fa-address-card pr-10"></i>
                  Titulaire &amp; Titre
                </a>
              </li>
              <li
                v-if="!processedVehicleData.administratif.isAnnulationCI"
                :class="[{'active' : tab === 'situation'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'situation'"
                >
                  <i class="fa fa-clipboard pr-10"></i>
                  Situation administrative
                </a>
              </li>
              <li
                v-if="!processedVehicleData.administratif.isAnnulationCI"
                :class="[{'active' : tab === 'history'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'history'"
                >
                  <i class="fa fa-calculator pr-10"></i>
                  Historique des opérations
                </a>
              </li>
              <li
                v-if="!processedVehicleData.administratif.isAnnulationCI && $store.state.config.utac && (ct || ctError)"
                :class="[{'active' : tab === 'utac'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'utac'"
                >
                  <i class="fa fa-cogs pr-10"></i>
                  Contrôles techniques
                </a>
              </li>
              <li
                v-if="!processedVehicleData.administratif.isAnnulationCI && $store.state.config.utac && (ct || ctError)"
                :class="[{'active' : tab === 'utacGraph'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'utacGraph'"
                >
                  <i class="fa fa-line-chart pr-10"></i>
                  Kilométrage
                </a>
              </li>
              <li
                v-if="holder"
                :class="[{'active' : tab === 'csa'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'csa'"
                >
                  <i class="fa fa-file-pdf-o pr-10"></i>
                  Certificat de situation administrative
                </a>
              </li>
              <li
                v-if="!processedVehicleData.administratif.isAnnulationCI && holder"
                :class="[{'active' : tab === 'send'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'send'"
                >
                  <i class="fa fa-send pr-10"></i>
                  Transmettre le rapport
                </a>
              </li>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
              <!-- /* ----------------- synthese ----------------- */ -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : $store.state.config.allTabs || tab === 'abstract'}]"
              >
                <abstract
                  v-if="tab === 'abstract'"
                  :processed-vehicle-data="processedVehicleData"
                  :holder="holder"
                  :change-tab="changeTab"
                >
                </abstract>
              </div>
              <!-- /* ----------------- vehicule ----------------- */ -->
              <div
                class="tab-pane fade pr-20"
                :class="[{'in active' : $store.state.config.allTabs || tab === 'vehicle'}]"
              >
                <tech-chars
                  v-if="tab === 'vehicle'"
                  :ctec="processedVehicleData.ctec"
                >
                </tech-chars>
              </div>
              <!-- /* ----------------- titre ----------------- */ -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : $store.state.config.allTabs || tab === 'holder'}]"
              >
                <license
                  v-if="tab === 'holder'"
                  :certificat="processedVehicleData.certificat"
                  :titulaire="processedVehicleData.titulaire"
                >
                </license>
              </div>
              <!-- situation administrative -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : $store.state.config.allTabs || tab === 'situation'}]"
              >
                <administrative
                  v-if="tab === 'situation'"
                  :holder="holder"
                  :opposition-section="processedVehicleData.administratif.opposition"
                  :report-labels="processedVehicleData.administratif.reportLabels"
                >
                </administrative>
              </div>
              <!-- historique des opérations -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : $store.state.config.allTabs || tab === 'history'}]"
              >
                <history
                  v-if="tab === 'history'"
                  :processed-vehicle-data="processedVehicleData"
                >
                </history>
              </div>
              <div
                class="tab-pane fade"
                :class="[{'in active' : $store.state.config.allTabs || tab === 'utac'}]"
              >
                <tech-control
                  v-if="tab === 'utac'"
                  :ct="ct"
                  :ct-error="ctError"
                >
                </tech-control>
              </div>
              <div
                v-if="tab === 'utacGraph'"
                class="tab-pane fade"
                :class="[{'in active' : $store.state.config.allTabs || tab === 'utacGraph'}]"
              >
                <tech-control-graph
                  v-if="tab === 'utacGraph' && ct && !ctError"
                  :ct="ct"
                >
                </tech-control-graph>
                <tech-control-graph-error
                  v-if="tab === 'utacGraph' && ctError"
                  :ct-error="ctError"
                >
                </tech-control-graph-error>
              </div>
              <div
                v-if="holder"
                class="tab-pane fade"
                :class="[{'in active' : $store.state.config.allTabs || tab === 'send'}]"
              >
                <share
                  v-if="tab === 'send'"
                  :url="url"
                  :holder="holder"
                >
                </share>
              </div>
              <div
                v-if="holder"
                class="tab-pane fade"
                :class="[{'in active' : tab === 'csa'}]"
              >
                <div v-if="!$store.state.config.newPdfLib">
                  <administrative-certificate-old
                    v-if="tab === 'csa'"
                    :processed-vehicle-data="processedVehicleData"
                    :url="url"
                    :base-url="baseUrl"
                  >
                  </administrative-certificate-old>
                </div>

                <div v-if="$store.state.config.newPdfLib">
                  <administrative-certificate
                    v-if="tab === 'csa'"
                    :processed-vehicle-data="processedVehicleData"
                    :url="url"
                    :base-url="baseUrl"
                  >
                  </administrative-certificate>
                </div>
              </div>
            </div>
          </div>
          <!-- tabs end -->
          <!-- debut trait de séparation -->
          <hr class="style1">
          <!-- fin trait de séparation -->
        </div>
      </div>
      <!-- row -->
    </div>
    <status
      :status="status"
      :type-immatriculation="typeImmatriculation"
    ></status>
  </section>
</template>

<script>
function loadView(view) {
  return () => import(/* webpackChunkName: "report-part-[request]" */ `@/components/reportParts/${view}.vue`)
}

import Abstract from './reportParts/Abstract.vue'
import TechChars from './reportParts/TechChars.vue'
import License from './reportParts/License.vue'
import Administrative from './reportParts/Administrative.vue'
import History from './reportParts/History.vue'
import TechControl from './reportParts/TechControl.vue'
const TechControlGraph = loadView('TechControlGraph')
const TechControlGraphError = loadView('TechControlGraphError')
const AdministrativeCertificate = loadView('AdministrativeCertificate')
const AdministrativeCertificateOld = loadView('AdministrativeCertificateOld')

const Share = loadView('Share')
import Status from './reportParts/Status.vue'
import siv from '../assets/js/siv'
import { DEFAULT_DATE_UPDATE } from '../constants/v'

import imagePoigneeDeMain from '@/assets/img/poignee_de_main.jpg'



const statusFromCode = {
  'holder': {
    400: 'invalid',
    403: 'forbidden',
    404: 'notFound',
    429: 'tooManyRequests',
    502: 'unavailable',
    503: 'unavailable',
    504: 'unavailable',
  },
  'buyer': {
    400: 'invalidBuyer',
    403: 'forbidden',
    404: 'notFoundBuyer',
    429: 'tooManyRequests',
    502: 'unavailable',
    503: 'unavailable',
    504: 'unavailable'
  }
}

export default {
  components: {
    Abstract,
    TechChars,
    License,
    Administrative,
    History,
    TechControl,
    TechControlGraph,
    TechControlGraphError,
    AdministrativeCertificate,
    AdministrativeCertificateOld,
    Share,
    Status
  },
  data () {
    return {
      tab: 'abstract',
      default: 'non disponible',
      plaque: '',
      vin: '',
      conf: [],
      timeout: 10000,
      ratingModalTimer: 120000,
      DEFAULT_DATE_UPDATE,

      // images
      imagePoigneeDeMain,
    }
  },
  computed: {
    id () {
      return this.holder ? this.$route.params.id : this.$route.query.id
    },
    key () {
      const key = ((this.$route.params.key !== undefined) ? this.$route.params.key : this.$route.query.key)
      if (!key) {
        return
      }
      return key.replace(/-/g, '+').replace(/_/g, '/')
    },
    status () {
      if (this.$store.state.siv.vehicleData) {
        this.showRatingModal()
        return 'ok'
      } else if (!this.holder && this.$route.query.key === undefined && this.$route.query.id !== undefined) {
        return 'invalidBuyer'
      } else if ((this.holder ? this.$route.params.id : this.$route.query.id) === undefined) {
        return 'invalid'
      } else if (this.$store.state.api.fetching.siv ||
                this.$store.state.api.http.siv === undefined ||
                this.$store.state.api.decrypted.siv === undefined) {
          return 'wait'
      } else if (this.$store.state.api.http.siv !== 200) {
        return this.holder ? statusFromCode.holder[this.$store.state.api.http.siv] :
                             statusFromCode.buyer[this.$store.state.api.http.siv]
      } else if (!this.$store.state.api.decrypted.siv) {
        return this.holder ? 'decryptError' : 'decryptErrorBuyer'
      } else if (!this.$store.state.api.hit.siv) {
        return this.holder ? 'notFound' : 'notFoundBuyer'
      }
      return 'error'
    },
    typeImmatriculation () {
      return this.$route.params.typeImmatriculation
    },
    processedVehicleData () {
      return siv.processVehicleData(this.$store.state.siv.vehicleData)
    },
    holder () {
      return (this.$route.query.id === undefined) && ((this.$route.params.id !== undefined) || (this.$store.state.siv.id !== undefined))
    },
    ct () {
      return this.$store.state.utac.ctData.ct
    },
    ctError () {
      return this.$store.state.utac.ctData.error
    },
    ctUpdateDate () {
      return this.$store.state.utac.ctData.updateDate
    },
    baseUrl () {
      // return 'https://histovec.interieur.gouv.fr'
      return window.location.protocol + '//' + window.location.host
    },
    url () {
      const urlKey = (this.$store.state.siv.key || this.key).replace(/\+/g, '-').replace(/\//g, '_')
      return this.baseUrl + '/histovec/report?id=' + encodeURIComponent(this.$store.state.siv.id || this.$route.params.id) + '&key=' + encodeURIComponent(urlKey)
    }
  },
  async created () {
    if (this.id) {
      this.$store.commit('updateId', this.id)
    }
    if (this.key !== undefined) {
      this.$store.commit('updateKey', this.key)
    }

    await this.getVehicleData()

    if (this.processedVehicleData.administratif.isAnnulationCI) {
      this.tab = 'csa'
    }

    const isUtacActivated = this.$store.state.config.utac
    const isGetSIVSucceeded = this.status === 'ok' && this.processedVehicleData
    if (isUtacActivated && isGetSIVSucceeded && !this.processedVehicleData.administratif.isAnnulationCI) {
      await this.$store.dispatch('getUTAC')
    }
  },
  methods: {
    async getVehicleData () {
      const isVehicleDataCached = this.$store.getters.vehicleDataWithExpiry
      if (isVehicleDataCached) {
        await this.$store.dispatch('log',
          this.$route.path + '/' + (this.holder ? 'holder' : 'buyer') + '/cached')
        return
      }

      const canGetVehicleData = this.$store.state.siv.id && this.$store.state.siv.key
      if (
        !canGetVehicleData && (
          // rapport vendeur via formulaire de recherche, avec un paramètre manquant
          (this.holder && (!this.$route.params.key || !this.$route.params.id)) ||
          // rapport acheteur avec un paramètre manquant
          (!this.holder && (!this.$route.query.key || !this.$route.query.id))
        )
      ) {
        await this.$store.dispatch('log',
          this.$route.path + '/' + (this.holder ? 'holder' : 'buyer') + '/invalid')
        return
      }

      await this.$store.dispatch('getVehicleData')
      await this.$store.dispatch('log',
        this.$route.path + '/' + (this.holder ? 'holder' : 'buyer') + '/' + this.status.replace(/Buyer$/, ''))
      return
    },
    showRatingModal () {
      const notShow = localStorage.getItem('notShow') === 'true'
      const evaluation = localStorage.getItem('evaluation') === 'true'

      if (!notShow && !evaluation) {
        setTimeout(() => {
          if (!this.$store.state.isRatingModalVisible && this.$route.path.match(/report/)) {
            this.$store.dispatch('toggleRatingModal')
          }
        }, this.ratingModalTimer)
      }
    },
    changeTab (tab) {
      if (['abstract', 'vehicle', 'holder', 'situation', 'history', 'utac', 'utacGraph', 'send', 'csa'].includes(tab)) {
        this.tab = tab
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
