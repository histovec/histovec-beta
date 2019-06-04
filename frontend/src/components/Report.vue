<template>
  <section id="result">
    <div class="breadcrumb-container">
      <div class="container">
        <ol class="breadcrumb">
          <li>
            <i class="fa fa-home pr-10"></i>
            <router-link
              :to="{ name: $routesNames.HOME }"
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
              <li :class="[{'active' : $route.name === $routesNames.SYNTHESIS}]">
                <router-link
                  :to="{ name: $routesNames.SYNTHESIS }"
                  exact
                  class="nav-link"
                  active-class="active"
                >
                  <i class="fa fa-refresh pr-10"></i>
                  Synthèse
                </router-link>
              </li>
              <li :class="[{'active' : $route.name === $routesNames.VEHICLE}]">
                <router-link
                  :to="{ name: $routesNames.VEHICLE }"
                  exact
                  class="nav-link"
                  active-class="active"
                >
                  <i :class="'fa fa-' + v.logo_vehicule + ' pr-10'"></i>
                  Véhicule
                </router-link>
              </li>
              <li :class="[{'active' : $route.name === $routesNames.HOLDER}]">
                <router-link
                  :to="{ name: $routesNames.HOLDER }"
                  exact
                  class="nav-link"
                  active-class="active"
                >
                  <i class="fa fa-address-card pr-10"></i>
                  Titulaire &amp; Titre
                </router-link>
              </li>
              <li :class="[{'active' : $route.name === $routesNames.ADMINISTRATIVE_STATUS}]">
                <router-link
                  :to="{ name: $routesNames.ADMINISTRATIVE_STATUS }"
                  exact
                  class="nav-link"
                  active-class="active"
                >
                  <i class="fa fa-clipboard pr-10"></i>
                  Situation administrative
                </router-link>
              </li>
              <li :class="[{'active' : $route.name === $routesNames.HISTORY}]">
                <router-link
                  :to="{ name: $routesNames.HISTORY }"
                  exact
                  class="nav-link"
                  active-class="active"
                >
                  <i class="fa fa-calculator pr-10"></i>
                  Historique des opérations
                </router-link>
              </li>
              <li
                v-if="$store.state.config.utac && (ct.length > 0)"
                :class="[{'active' : $route.name === $routesNames.TECHNICAL_CONTROL}]"
                >
                <router-link
                  :to="{ name: $routesNames.TECHNICAL_CONTROL }"
                  exact
                  class="nav-link"
                  active-class="active"
                >
                  <i class="fa fa-cogs pr-10"></i>
                  Contrôles techniques
                </router-link>
              </li>
              <li
                v-if="$store.state.config.utac && $store.state.config.utacGraph && (ct.length > 1)"
                :class="[{'active' : $route.name === $routesNames.KILOMETERS}]"
              >
                <router-link
                  :to="{ name: $routesNames.KILOMETERS }"
                  exact
                  class="nav-link"
                  active-class="active"
                >
                  <i class="fa fa-line-chart pr-10"></i>
                  Kilomètres
                </router-link>
              </li>
              <li
                v-if="holder&&$store.state.config.pdf"
                :class="[{'active' : $route.name === $routesNames.CSA}]"
              >
                <router-link
                  :to="{ name: $routesNames.CSA }"
                  exact
                  class="nav-link"
                  active-class="active"
                >
                  <i class="fa fa-print pr-10"></i>
                  Certificat de situation administrative
                </router-link>
              </li>
              <li
                v-if="holder"
                :class="[{'active' : $route.name === $routesNames.SHARE}]"
              >
                <router-link
                  :to="{ name: $routesNames.SHARE }"
                  exact
                  class="nav-link"
                  active-class="active"
                >
                  <i class="fa fa-send pr-10"></i>
                  Transmettre le rapport
                </router-link>
              </li>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
              <router-view
                class="tab-pane fadein active"
                :baseurl="baseurl"
                :ct="ct"
                :holder="holder"
                :url="url"
                :v="v"
              >
              </router-view>
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
  </section>
</template>

<script>


import Status from './reportParts/Status.vue'
import siv from '../assets/js/siv'

const statusFromCode = {
  holder: {
    400: 'invalid',
    404: 'notFound',
    429: 'tooManyRequests',
    502: 'unavailable',
    503: 'unavailable',
    504: 'unavailable',
  },
  buyer: {
    400: 'invalidBuyer',
    404: 'notFoundBuyer',
    429: 'tooManyRequests',
    502: 'unavailable',
    503: 'unavailable',
    504: 'unavailable',
  },
}

export default {
  components: {
    Status,
  },
  data() {
    return {
      default: 'non disponible',
      plaque: '',
      vin: '',
      conf: [],
      timeout: 10000,
    }
  },
  computed: {
    id() {
      return this.holder ? this.$route.params.id : this.$route.query.id
    },
    key() {
      let k =
        this.$route.params.key !== undefined
          ? this.$route.params.key
          : this.$route.query.key
      return k !== undefined
        ? k.replace(/-/g, '+').replace(/_/g, '/')
        : undefined
    },
    status () {
      if (this.$store.state.siv.v) {
        if (this.$store.state.siv.v.annulation_ci === 'OUI') {
          return 'cancelled'
        }
        return 'ok'
      } else if (
        !this.holder &&
        this.$route.query.key === undefined &&
        this.$route.query.id !== undefined
      ) {
        return 'invalidBuyer'
      } else if (
        (this.holder ? this.$route.params.id : this.$route.query.id) ===
        undefined
      ) {
        return 'invalid'
      } else if (this.$store.state.api.fetching.siv ||
                (this.$store.state.api.http.siv === undefined) ||
                ((this.$store.state.api.hit.siv === undefined) && (!this.$store.state.config.v1)) ||
                (this.$store.state.api.decrypted.siv === undefined)) {
          return 'wait'
      } else if (this.$store.state.api.http.siv !== 200) {
        return this.holder ? statusFromCode.holder[this.$store.state.api.http.siv] :
                             statusFromCode.buyer[this.$store.state.api.http.siv]
      } else if (!this.$store.state.api.hit.siv) {
        return this.holder ? 'notFound' : 'notFoundBuyer'
      } else if (!this.$store.state.api.decrypted.siv) {
        return this.holder ? 'decryptError' : 'decryptErrorBuyer'
      }
      return 'error'
    },
    v () {
      return siv.siv(this.$store.state.siv.v)
    },
    holder () {
      return (this.$route.query.id === undefined) && ((this.$route.params.code !== undefined) || (this.$store.state.siv.code !== undefined))
    },
    ct () {
      return this.$store.state.utac.ct || []
    },
    baseurl() {
      // return 'https://histovec.interieur.gouv.fr'
      return window.location.protocol + '//' + window.location.host
    },
    url () {
      let urlKey = (this.$store.state.siv.key || this.key).replace(/\+/g, '-').replace(/\//g, '_')
      return this.baseurl + '/histovec/report?id=' + encodeURIComponent(this.$store.state.siv.code || this.$route.params.code) + '&key=' + encodeURIComponent(urlKey)
    }
  },
  created() {
    if (this.id !== undefined) {
      this.$store.commit('updateId', this.id)
    }
    if (this.key !== undefined) {
      this.$store.commit('updateKey', this.key)
    }
    if (this.$route.params.code !== undefined) {
      this.$store.commit('updateCode', this.$route.params.code)
    }
    this.getSIV()
  },
  methods: {
    async getSIV () {
      if (this.$store.state.siv.v) {
        // déjà en cache
        await this.$store.dispatch(
          'log',
          this.$route.path +
            '/' +
            (this.holder ? 'holder' : 'buyer') +
            '/cached',
        )
        return
      } else {
        if (
          !this.holder &&
          this.$route.query.key === undefined &&
          this.$route.query.id !== undefined
        ) {
          await this.$store.dispatch(
            'log',
            this.$route.path +
              '/' +
              (this.holder ? 'holder' : 'buyer') +
              '/invalid',
          )
          return
        }
        await this.$store.dispatch('getSIV', this.$store.state.config.v1)
        if (this.status === 'ok' && this.$store.state.config.v1 && this.$store.state.config.utac) {
          await this.$store.dispatch('getUTAC')
        }
        await this.$store.dispatch(
          'log',
          this.$route.path +
            '/' +
            (this.holder ? 'holder' : 'buyer') +
            '/' +
            this.status.replace(/Buyer$/, ''),
        )
        return
      }
    },
    showModalForm () {
      if (localStorage.getItem('evaluation') === 'false' || localStorage.getItem('evaluation') === null) {
        setTimeout(() => {
          if (!this.$store.state.modalForm && this.$route.path.match(/report/)) {
            this.$store.dispatch('toggleModalForm', { mode: this.contact.mode.rating } )
          }
        }, this.modalFormTimer)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
