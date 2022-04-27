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
                    <div v-if="isHolder">
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
      v-if="processedVehiculeData"
      class="container"
    >
      <div class="row">
        <div class="col-lg-12 mb-20">
          <!-- debut vignette -->
          <div class="row">
            <div
              class="col-sm-12"
            >
              <div
                v-if="outdatedData"
                class="alert alert-danger alert-icon text-center"
                role="alert"
              >
                <i class="fa fa-exclamation-triangle"></i>
                HistoVec rencontre actuellement des difficultés techniques dans la mise à jour des données relatives aux véhicules qu'il vous permet de consulter.
                <br>
                Seul le certificat de situation administrative disponible sur le site de l'ANTS fait foi.
                <br>
                Veuillez nous excuser pour la gêne occasionnée.
                <br>
                <br>
                <div class="col-xs-8 col-xs-offset-2 col-sm-4 col-sm-offset-4">
                  <a
                    class="btn btn-default btn-m center-block m-h-05"
                    href="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Obtenir le CSA à jour via l'ANTS
                  </a>
                </div>
                <br>
                <br>
              </div>
            </div>
            <div class="col-sm-6">
              <div
                v-if="!isCIAnnule"
                class="alert alert-icon alert-info"
                role="alert"
              >
                <i :class="'fa fa-' + processedVehiculeData.logoVehicule"></i>
                Numéro - Plaque d'immatriculation : {{ processedVehiculeData.plaque }}
              </div>
              <div
                v-if="isCIAnnule"
                class="alert alert-icon alert-danger"
                role="alert"
              >
                <i class="fa fa-warning"></i>
                Le certificat demandé a été annulé : {{ processedVehiculeData.plaque }}
              </div>
            </div>
            <div class="col-sm-6">
              <div
                v-if="showDataDate"
                :class="'alert-' + (isDefaultDataDate ? 'danger' : 'warning')"
                class="alert alert-icon"
                role="alert"
              >
                <i
                  :class="'fa-calendar-' + (isDefaultDataDate ? 'times-o' : 'check-o')"
                  class="fa"
                >
                </i>
                <span v-if="!isDefaultDataDate">
                  Informations du ministère de l'Intérieur datant du
                  <strong>{{ dateMiseAJourFR }}</strong>
                </span>
                <span v-if="isDefaultDataDate">
                  Informations connues d'HistoVec non à jour
                </span>
              </div>
              <div
                v-else
                class="alert alert-icon alert-warning"
                role="alert"
              >
                <i class="fa fa-calendar-check-o"></i>
                <span>
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
                v-if="!isCIAnnule"
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
                v-if="!isCIAnnule"
                :class="[{'active' : tab === 'vehicle'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'vehicle'"
                >
                  <i :class="'fa fa-' + processedVehiculeData.logoVehicule + ' pr-10'"></i>
                  Véhicule
                </a>
              </li>
              <li
                v-if="!isCIAnnule"
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
                v-if="!isCIAnnule"
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
                v-if="!isCIAnnule"
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
                v-if="!isCIAnnule && (controlesTechniques.length > 0 || erreurControlesTechniques)"
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
                v-if="!isCIAnnule && (controlesTechniques.length > 0 || erreurControlesTechniques)"
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
                v-if="isHolder"
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
                v-if="!isCIAnnule && isHolder"
                :class="[{'active' : tab === 'share-report'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'share-report'"
                >
                  <i class="fa fa-send pr-10"></i>
                  Transmettre le rapport
                </a>
              </li>
              <li
                v-if="!isCIAnnule && isHolder && $store.state.config.useCodePartageHistoVec"
                :class="[{'active' : tab === 'share-code-partage'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'share-code-partage'"
                >
                  <i class="fa fa-share pr-10"></i>
                  Transmettre le code partage
                </a>
              </li>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
              <!-- /* ----------------- synthese ----------------- */ -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : tab === 'abstract'}]"
              >
                <abstract-tab
                  v-if="tab === 'abstract' && !isCIAnnule"
                  :processed-vehicule-data="processedVehiculeData"
                  :is-holder="isHolder"
                  :change-tab="changeTab"
                >
                </abstract-tab>
              </div>
              <!-- /* ----------------- vehicule ----------------- */ -->
              <div
                class="tab-pane fade pr-20"
                :class="[{'in active' : tab === 'vehicle'}]"
              >
                <tech-chars-tab
                  v-if="tab === 'vehicle'"
                  :caracteristiques-techniques="processedVehiculeData.caracteristiquesTechniques"
                >
                </tech-chars-tab>
              </div>
              <!-- /* ----------------- titre ----------------- */ -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : tab === 'holder'}]"
              >
                <license-tab
                  v-if="tab === 'holder'"
                  :certificat="processedVehiculeData.certificat"
                  :titulaire="processedVehiculeData.titulaire"
                >
                </license-tab>
              </div>
              <!-- situation administrative -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : tab === 'situation'}]"
              >
                <administrative-tab
                  v-if="tab === 'situation'"
                  :is-holder="isHolder"
                  :opposition-section="processedVehiculeData.administratif.opposition"
                  :report-labels="processedVehiculeData.administratif.reportLabels"
                >
                </administrative-tab>
              </div>
              <!-- historique des opérations -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : tab === 'history'}]"
              >
                <history-tab
                  v-if="tab === 'history'"
                  :processed-vehicule-data="processedVehiculeData"
                >
                </history-tab>
              </div>
              <div
                class="tab-pane fade"
                :class="[{'in active' : tab === 'utac'}]"
              >
                <tech-control-tab
                  v-if="tab === 'utac' && !isCIAnnule && (controlesTechniques.length > 0 || erreurControlesTechniques)"
                  :controles-techniques="controlesTechniques"
                  :erreur-controles-techniques="erreurControlesTechniques"
                >
                </tech-control-tab>
              </div>
              <div
                v-if="tab === 'utacGraph' && !isCIAnnule"
                class="tab-pane fade"
                :class="[{'in active' : tab === 'utacGraph'}]"
              >
                <tech-control-graph-tab
                  v-if="tab === 'utacGraph' && !erreurControlesTechniques && controlesTechniques.length > 0"
                  :controles-techniques="controlesTechniques"
                >
                </tech-control-graph-tab>
                <tech-control-graph-error-tab
                  v-if="tab === 'utacGraph' && erreurControlesTechniques"
                  :erreur-controles-techniques="erreurControlesTechniques"
                >
                </tech-control-graph-error-tab>
              </div>
              <div
                v-if="isHolder"
                class="tab-pane fade"
                :class="[{'in active' : tab === 'csa'}]"
              >
                <administrative-certificate-tab
                  v-if="tab === 'csa'"
                  :processed-vehicule-data="processedVehiculeData"
                  :url="url"
                  :base-url="baseUrl"
                >
                </administrative-certificate-tab>
              </div>
              <div
                v-if="isHolder"
                class="tab-pane fade"
                :class="[{'in active' : tab === 'share-report'}]"
              >
                <share-report-tab
                  v-if="tab === 'share-report'"
                  :url="url"
                >
                </share-report-tab>
              </div>
              <div
                v-if="isHolder && $store.state.config.useCodePartageHistoVec"
                class="tab-pane fade"
                :class="[{'in active' : tab === 'share-code-partage'}]"
              >
                <share-code-partage-tab
                  v-if="tab === 'share-code-partage'"
                  :code-partage-histo-vec="codePartageHistoVec"
                >
                </share-code-partage-tab>
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
    <status-page
      :status="status"
      :type-immatriculation="typeImmatriculation"
    ></status-page>
  </section>
</template>

<script>
const AbstractTab = () => import('./reportParts/AbstractTab.vue')
const TechCharsTab = () => import('./reportParts/TechCharsTab.vue')
const LicenseTab = () => import('./reportParts/LicenseTab.vue')
const AdministrativeTab = () => import('./reportParts/AdministrativeTab.vue')
const HistoryTab = () => import('./reportParts/HistoryTab.vue')
const TechControlTab = () => import('./reportParts/TechControlTab.vue')
const TechControlGraphTab = () => import('./reportParts/TechControlGraphTab.vue')
const TechControlGraphErrorTab = () => import('./reportParts/TechControlGraphErrorTab.vue')
const AdministrativeCertificateTab = () => import('./reportParts/AdministrativeCertificateTab.vue')
const ShareReportTab = () => import('./reportParts/ShareReportTab.vue')
const ShareCodePartageTab = () => import('./reportParts/ShareCodePartageTab.vue')
const StatusPage = () => import('./reportParts/StatusPage.vue')

import siv from '@/assets/js/siv.js'
import { DEFAULT_DATE_UPDATE } from '@/constants/v.js'
import { STATUS_FROM_CODE } from '@/constants/error.js'
import { getDepartement } from '@/utils/codePostal.js'
import { hash } from '@/utils/crypto.js'
import { urlSafeBase64Encode, base64Encode, urlSafeBase64Decode } from '@/utils/encoding.js'
import { formatIsoToFrDate } from '@/assets/js/format.js'

import imagePoigneeDeMain from '@/assets/img/poignee_de_main.jpg'



export default {
  components: {
    AbstractTab,
    TechCharsTab,
    LicenseTab,
    AdministrativeTab,
    HistoryTab,
    TechControlTab,
    TechControlGraphTab,
    TechControlGraphErrorTab,
    AdministrativeCertificateTab,
    ShareReportTab,
    ShareCodePartageTab,
    StatusPage,
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
    dateMiseAJourFR () {
      return formatIsoToFrDate(this.processedVehiculeData.dateMiseAJour)
    },
    isCIAnnule () {
      return Boolean(
        this.processedVehiculeData &&
        this.processedVehiculeData.administratif &&
        this.processedVehiculeData.administratif.isCIAnnule
      )
    },
    buyerId () {
      return this.$route.query.id
    },
    buyerKey () {
      return this.$route.query.key
    },
    holderId () {
      return this.idFromSearchForm || this.idFromLastReportCache
    },
    holderKey () {
      return this.keyFromSearchForm || this.keyFromLastReportCache
    },
    idFromSearchForm () {
      return this.$route.params.id
    },
    keyFromSearchForm () {
      return this.$route.params.key
    },
    idFromLastReportCache () {
      return this.$store.state.histovec.id
    },
    keyFromLastReportCache () {
      return this.$store.state.histovec.key
    },
    id () {
      return this.isHolder ? this.holderId : this.buyerId
    },
    key () {
      return this.isHolder ? this.holderKey : this.buyerKey
    },
    codePartageHistoVec () {
      return `${this.holderId}-${this.holderKey}`
    },
    report () {
      const { report } = this.$store.state.histovec
      return report.vehicule ? this.$store.state.histovec.report : null
    },
    status () {
      const { lastReportStatusCode } = this.$store.state.histovec

      if (lastReportStatusCode === 404) {
        return this.isHolder ? 'notFound' : 'notFoundBuyer'
      } else if (this.report) {
        this.showRatingModal()
        return 'ok'
      } else if (!this.isHolder && (!this.buyerId || !this.buyerKey)) {
        return 'invalidBuyer'
      } else if (!this.id) {
        return 'invalid'
      } else if (
        lastReportStatusCode &&
        lastReportStatusCode !== 200
      ) {
        return (
          this.isHolder ?
          STATUS_FROM_CODE.holder[lastReportStatusCode] :
          STATUS_FROM_CODE.buyer[lastReportStatusCode]
        )
      }

      return 'wait'
    },
    typeImmatriculation () {
      return this.$route.params.typeImmatriculation
    },
    processedVehiculeData () {
      const report = this.report || {}
      const { vehicule: vehiculeData } = report

      return siv.processVehiculeData(vehiculeData)
    },
    isDefaultDataDate () {
      return this.processedVehiculeData.dateMiseAJour === DEFAULT_DATE_UPDATE
    },
    isHolder () {
      return Boolean(!this.buyerId && this.holderId)
    },
    controlesTechniques () {
      const { controlesTechniques: controlesTechniquesData } = this.report

      return controlesTechniquesData.historique || []
    },
    erreurControlesTechniques () {
      const { controlesTechniques: controlesTechniquesData } = this.report

      return controlesTechniquesData.erreur
    },
    baseUrl () {
      // Equivalent to 'https://histovec.interieur.gouv.fr' for production
      return window.location.protocol + '//' + window.location.host
    },
    url () {
      const idParam = encodeURIComponent(this.holderId)
      const keyParam = encodeURIComponent(this.holderKey)
      const queryString = `?id=${idParam}&key=${keyParam}`

      // Add 'urlUnsafe' queryParameter to make new buyer urls (urlUnsafeBase64 encoded parameters) recognizable for frontend and backend
      // @todo remove 'urlUnsafe' queryParam while transition done (8th day of the next month after 'HistoVec code partage' feature deployement)
      return `${this.baseUrl}/histovec/report${queryString}&urlUnsafe=true`
    }
  },
  async created () {
    const { id: buyerId, key: buyerKey, urlUnsafe } = this.$route.query

    if (this.id) {
      // old buyer report link
      if (!urlUnsafe && buyerId) {
        const id = base64Encode(urlSafeBase64Decode(buyerId))
        this.$store.commit('updateId', id)
      } else {
        // new buyer report link or holder report link
        // @todo only keep this line while transition done (8th day of the next month after 'HistoVec code partage' feature deployement)
        this.$store.commit('updateId', this.id)
      }
    }

    if (this.key) {
      // new buyer report link or holder report link
      if (!urlUnsafe && buyerKey) {
        const key = base64Encode(urlSafeBase64Decode(buyerKey))

        this.$store.commit('updateKey', key)
      } else {
        // new buyer report link or holder report link
        // @todo only keep this line while transition done (8th day of the next month after 'HistoVec code partage' feature deployement)
        this.$store.commit('updateKey', this.key)
      }
    }

    // Counting api requests from HistoVec frontend
    this.$store.dispatch('log', `${this.$route.path}/count`)

    await this.getReport()

    const vehiculeData = this.$store.state.histovec.report && this.$store.state.histovec.report.vehicule
    if (vehiculeData) {
      await this.logVehicleData(vehiculeData)  // @todo: remove and move to backend while backend will access decrypted report
    }

    const isCIAnnule = (
      this.processedVehiculeData &&
      this.processedVehiculeData.administratif &&
      this.processedVehiculeData.administratif.isCIAnnule
    )

    if (isCIAnnule) {
      this.tab = 'csa'
    }
  },
  methods: {
    async getReport () {
      const isReportCached = this.$store.getters.reportWithExpiry !== null
      if (isReportCached) {
        await this.$store.dispatch('log',
          this.$route.path + '/' + (this.isHolder ? 'holder' : 'buyer') + '/cached')

        return
      }

      const canGetCachedReport = this.idFromLastReportCache && this.keyFromLastReportCache
      if (
        !canGetCachedReport && (
          // rapport vendeur via formulaire de recherche, avec un paramètre manquant
          (this.isHolder && (!this.holderId || !this.holderKey)) ||
          // rapport acheteur avec un paramètre manquant
          (!this.isHolder && (!this.buyerId|| !this.buyerKey))
        )
      ) {
        await this.$store.dispatch('log',
          this.$route.path + '/' + (this.isHolder ? 'holder' : 'buyer') + '/invalid')
        return
      }

      if (this.isHolder) {
        await this.$store.dispatch('getHolderReport')
      } else {
        await this.$store.dispatch('getBuyerReport')
      }

      await this.$store.dispatch('log',
        this.$route.path + '/' + (this.isHolder ? 'holder' : 'buyer') + '/' + this.status.replace(/Buyer$/, ''))
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
      if (['abstract', 'vehicle', 'holder', 'situation', 'history', 'utac', 'utacGraph', 'csa', 'share-report', 'share-code-partage'].includes(tab)) {
        this.tab = tab
      }
    },
    async logVehicleData ({
      certificatImmatriculation: {
        datePremiereImmatriculation,
        nombreDeMoisDepuisDateEmissionCertificatImmatriculation,
        titulaire: {
          particulier: {
            codePostalParticulier,
          } = {},
          personneMorale: {
            codePostalPersonneMorale,
          } = {},
        },
        caracteristiquesTechniques: {
          marque,
          tvv,
          nomCommercial,
          couleur,
          categorieUE,
          genreNational,
          energie,
        },
      },
      etat: {
        nombreDeTitulaires,
        proceduresVE: {
          isNumeroImmatriculationAuFormatFNI,
          isApteACirculer,
        },
      },
    }) {
      const codePostal = codePostalParticulier || codePostalPersonneMorale
      const departement = codePostal ? getDepartement(codePostal) : undefined
      const anonymizedReportId = urlSafeBase64Encode(await hash(this.id))

      // @todo: keep this name for now
      const vehicleData = {
        age_certificat: nombreDeMoisDepuisDateEmissionCertificatImmatriculation,
        couleur,
        CTEC_RLIB_ENERGIE: energie,
        CTEC_RLIB_CATEGORIE: categorieUE,
        CTEC_RLIB_GENRE: genreNational,
        date_premiere_immat: datePremiereImmatriculation,
        departement,
        is_apte_a_circuler: isApteACirculer,
        is_fni: isNumeroImmatriculationAuFormatFNI,
        marque,
        nom_commercial: nomCommercial,
        nb_titulaires: nombreDeTitulaires,
        tvv,
      }
      /* eslint-disable-next-line no-console */
      console.log('vehicleData', vehicleData)

      const bufferedStringifiedVehicleData = Buffer.from(JSON.stringify(vehicleData), 'utf8')
      const urlSafeBase64EncodedVehicleData = urlSafeBase64Encode(bufferedStringifiedVehicleData)

      await this.$store.dispatch('log', `${this.$route.path}/vehicle/${anonymizedReportId}/${urlSafeBase64EncodedVehicleData}`)
    }
  }
}
</script>
