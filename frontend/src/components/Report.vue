<template>
  <section id="result">
    <div class="breadcrumb-container">
      <div class="container">
        <ol class="breadcrumb">
          <li>
            <i class="fa fa-home pr-10"></i><a href="home">Accueil</a>
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
            style="background-image:url(assets/images/poignee_de_main.jpg); background-position: 50% 50%"
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
            <div class="col-sm-5">
              <div
                class="alert alert-icon alert-info"
                role="alert"
              >
                <i :class="'fa fa-' + v.logo_vehicule"></i>
                Numéro - Plaque d'immatriculation : {{ v.plaque }}
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
              <li :class="[{'active' : tab === 'abstract'}]">
                <a
                  class="clickable"
                  @click="tab = 'abstract'"
                >
                  <i class="fa fa-refresh pr-10"></i>
                  Synthèse
                </a>
              </li>
              <li :class="[{'active' : tab === 'vehicle'}]">
                <a
                  class="clickable"
                  @click="tab = 'vehicle'"
                >
                  <i :class="'fa fa-' + v.logo_vehicule + ' pr-10'"></i>
                  Véhicule
                </a>
              </li>
              <li :class="[{'active' : tab === 'holder'}]">
                <a
                  class="clickable"
                  @click="tab = 'holder'"
                >
                  <i class="fa fa-address-card pr-10"></i>
                  Titulaire &amp; Titre
                </a>
              </li>
              <li :class="[{'active' : tab === 'situation'}]">
                <a
                  class="clickable"
                  @click="tab = 'situation'"
                >
                  <i class="fa fa-clipboard pr-10"></i>
                  Situation administrative
                </a>
              </li>
              <li :class="[{'active' : tab === 'history'}]">
                <a
                  class="clickable"
                  @click="tab = 'history'"
                >
                  <i class="fa fa-calculator pr-10"></i>
                  Historique des opérations
                </a>
              </li>
              <li
                v-if="display.otc && (ct.length > 0)"
                :class="[{'active' : tab === 'otc'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'otc'"
                >
                  <i class="fa fa-cogs pr-10"></i>
                  Contrôles techniques
                </a>
              </li>
              <li
                v-if="display.otc && display.otc_graph && (ct.length > 1)"
                :class="[{'active' : tab === 'otc_graph'}]"
              >
                <a
                  class="clickable"
                  @click="tab = 'otc_graph'"
                >
                  <i class="fa fa-line-chart pr-10"></i>
                  Kilomètres
                </a>
              </li>
              <li
                v-if="holder"
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
                :class="[{'in active' : display['all_tabs'] || tab === 'abstract'}]"
              >
                <abstract
                  :v="v"
                  :holder="holder"
                >
                </abstract>
              </div>
              <!-- /* ----------------- vehicule ----------------- */ -->
              <div
                class="tab-pane fade pr-20"
                :class="[{'in active' : display['all_tabs'] || tab === 'vehicle'}]"
              >
                <tech-chars :v="v"></tech-chars>
              </div>
              <!-- /* ----------------- titre ----------------- */ -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : display['all_tabs'] || tab === 'holder'}]"
              >
                <license :v="v"></license>
              </div>
              <!-- situation administrative -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : display['all_tabs'] || tab === 'situation'}]"
              >
                <administrative
                  :v="v"
                  :holder="holder"
                >
                </administrative>
              </div>
              <!-- historique des opérations -->
              <div
                class="tab-pane fade"
                :class="[{'in active' : display['all_tabs'] || tab === 'history'}]"
              >
                <history :v="v"></history>
              </div>
              <div
                class="tab-pane fade"
                :class="[{'in active' : display['all_tabs'] || tab === 'otc'}]"
              >
                <tech-control
                  v-if="ct.length > 0"
                  :ct="ct"
                >
                </tech-control>
              </div>
              <div
                v-if="tab === 'otc_graph'"
                class="tab-pane fade"
                :class="[{'in active' : display['all_tabs'] || tab === 'otc_graph'}]"
              >
                <tech-control-graph
                  :ct="ct"
                >
                </tech-control-graph>
              </div>
              <div
                v-if="holder"
                class="tab-pane fade"
                :class="[{'in active' : display['all_tabs'] || tab === 'send'}]"
              >
                <share
                  :v="v"
                  :url="url"
                  :baseurl="baseurl"
                  :holder="holder"
                >
                </share>
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
    <status :status="status"></status>
    <modal-rating
      :activate="status === 'ok'"
      :holder="holder"
    >
    </modal-rating>
  </section>
</template>

<script>

import Abstract from './reportParts/Abstract.vue'
import TechChars from './reportParts/TechChars.vue'
import License from './reportParts/License.vue'
import Administrative from './reportParts/Administrative.vue'
import History from './reportParts/History.vue'
import TechControl from './reportParts/TechControl.vue'
import TechControlGraph from './reportParts/TechControlGraph.vue'
import Share from './reportParts/Share.vue'
import Status from './reportParts/Status.vue'
import ModalRating from './forms/ModalRating.vue'
import histovec from '../assets/js/histovec'

const statusFromCode = {
  404: 'invalid',
  429: 'tooManyRequests',
  502: 'unavailable',
  503: 'unavailable',
  504: 'unavailable',
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
    Share,
    Status,
    ModalRating
  },
  data () {
    return {
      tab: 'abstract',
      default: 'non disponible',
      plaque: '',
      vin: '',
      conf: [],
      timeout: 10000
    }
  },
  computed: {
    id () {
      return this.holder ? this.$route.params.id : this.$route.query.id
    },
    key () {
      let k = ((this.$route.params.key !== undefined) ? this.$route.params.key : this.$route.query.key)
      return (k !== undefined) ? k.replace(/-/g, '+').replace(/_/g, '/') : undefined
    },
    status () {
      if (this.$store.state.histovec.v) {
        if (this.$store.state.histovec.v.annulation_ci === 'OUI') {
          return 'cancelled'
        }
        return 'ok'
      } else if (!this.holder && this.$route.query.key === undefined && this.$route.query.id !== undefined) {
        return 'invalidKey'
      } else if ((this.holder ? this.$route.params.id : this.$route.query.id) === undefined) {
        return 'invalid'
      } else if (this.$store.state.api.fetching.histovec) {
          return 'wait'
      } else if (this.$store.state.api.http.histovec !== 200) {
        return statusFromCode[this.$store.state.api.http.histovec]
      } else if (!this.$store.state.api.hit.histovec) {
        return 'notFound'
      } else if (!this.$store.state.api.decrypted.histovec) {
        return this.holder ? 'decryptError' : 'decryptErrorBuyer'
      }
      return 'error'
    },
    v () {
      return histovec.histovec(this.$store.state.histovec.v)
    },
    holder () {
      return (this.$route.query.id === undefined) && ((this.$route.params.code !== undefined) || (this.$store.state.histovec.code !== undefined))
    },
    ct () {
      return this.$store.state.techControl.ct || []
    },
    baseurl () {
      // return 'https://histovec.interieur.gouv.fr'
      return window.location.protocol + '//' + window.location.host
    },
    url () {
      let urlKey = (this.$store.state.histovec.key || this.key).replace(/\+/g, '-').replace(/\//g, '_')
      return this.baseurl + '/histovec/report?id=' + encodeURIComponent(this.$store.state.histovec.code || this.$route.params.code) + '&key=' + encodeURIComponent(urlKey)
    }
  },
  created () {
    if (this.id !== undefined) {
      this.$store.commit('updateId', this.id)
    }
    if (this.key !== undefined) {
      this.$store.commit('updateKey', this.key)
    }
    if (this.$route.params.code !== undefined) {
      this.$store.commit('updateCode', this.$route.params.code)
    }
    this.getHistoVec()
  },  
  methods: {
    async getHistoVec () {
      if (this.$store.state.histovec.v) {
        // déjà en cache
        await this.$store.dispatch('log', 
          this.$route.path + '/' + (this.holder ? 'holder' : 'buyer') + '/cached')
        return
      } else {
        if (!this.holder && this.$route.query.key === undefined && this.$route.query.id !== undefined) {
          await this.$store.dispatch('log', 
            this.$route.path + '/' + (this.holder ? 'holder' : 'buyer') + '/invalidKey')
          return
        }
        await this.$store.dispatch('getHistoVec', this.display.otc)
        if (this.display.otc) {
          await this.$store.dispatch('getTechControl')
        }
        await this.$store.dispatch('log', 
          this.$route.path + '/' + (this.holder ? 'holder' : 'buyer') + '/' + this.status)
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
