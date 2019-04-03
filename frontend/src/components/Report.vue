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
      v-if="(result === 'ok') || (result === 'cached')"
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
    <status :status="result"></status>
    <modal-rating
      :activate="modalActivate"
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
import Share from './reportParts/Share.vue'
import Status from './reportParts/Status.vue'
import ModalRating from './feedback/ModalRating.vue'
import histovec from '../assets/js/histovec'

export default {
  components: {
    Abstract,
    TechChars,
    License,
    Administrative,
    History,
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
      result: 'wait',
      conf: [],
      v: {
        date_update: '25/11/2018',
        ctec: {
          reception: {},
          puissance: {},
          places: {},
          carrosserie: {},
          PT: {}
        },
        titulaire: {},
        certificat: {},
        administratif: {
          synthese: [],
          titre: {}
        }
      },
      modalActivate: false,
      timeout: 10000
    }
  },
  computed: {
    holder () {
      return (this.$route.params.code !== undefined) || (this.$store.state.code !== undefined)
    },
    baseurl () {
      // return 'https://histovec.interieur.gouv.fr'
      return window.location.protocol + '//' + window.location.host
    },
    url () {
      return this.baseurl + '/histovec/report?id=' + (this.$store.state.code || this.$route.params.code) + '&key=' + (this.$store.state.key || this.$route.params.key)
    }
  },
  created () {
    setTimeout(() => {
      if (this.result === 'wait') {
        this.result = 'error'
      }
      this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(() => {}, () => {})
    }, this.timeout)

    this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + (this.holder ? 'holder' : 'buyer')).then(() => {}, () => {})
    if (this.$store.state.v) {
      this.v = this.$store.state.v
      this.modalActivate = true
      this.result = 'cached'
      this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(() => {}, () => {})
    } else {
      if (!this.holder && this.$route.query.key === undefined && this.$route.query.id !== undefined) {
        // Cas des liens acheteur sans KEY
        this.result = 'invalidKey'
        this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(() => {}, () => {})
        return
      }
      if ((this.holder ? this.$route.params.id : this.$route.query.id) === undefined) {
        this.result = 'invalid'
        this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(() => {}, () => {})
      } else {
        this.$http.get(this.apiUrl + 'id/' + this.$cookie.get('userId') + '/' + (this.holder ? this.$route.params.id : this.$route.query.id))
          .then(response => {
            /* eslint-disable no-console */
            console.log(response)
            if (response.body.hits.hits.length === 0) {
              this.result = 'notFound'
              this.$store.commit('updateFail', this.$store.state.fail + 1)
              this.$http.put(this.apiUrl + 'log/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(() => {}, () => {})
              if ((this.$store.state.fail > 1) && (this.$cookie.get('userId').substring(1, 3) === 'ab')) {
                let data = {
                  'nom': this.$store.state.nom,
                  'prenom': this.$store.state.prenom,
                  'dateNaissance': this.$store.state.dateNaissance,
                  'raisonSociale': this.$store.state.raisonSociale,
                  'siren': this.$store.state.siren,
                  'dateCertificat': this.$store.state.dateCertificat,
                  'plaque': this.$store.state.plaque,
                  'formule': this.$store.state.formule,
                  'fail': this.$store.state.fail,
                  'success': this.$store.state.success,
                  'uid': this.$cookie.get('userId'),
                  'date': new Date().toUTCString()
                }
                this.$http.post(this.apiUrl + 'feedback/', data)
                .then(() => {
                  console.log('failure report send')
                }, () => {
                  console.log('couldn\'t send fail report')
                }
                )
              }
              return
            }
            this.modalActivate = true
            var encrypted = response.body.hits.hits[0]._source.v.replace(/-/g, '+').replace(/_/g, '/')
            var key = ((this.$route.params.key !== undefined) ? this.$route.params.key : this.$route.query.key).replace(/-/g, '+').replace(/_/g, '/')
            try {
              var veh = histovec.decrypt(key, encrypted)
            } catch (err) {
              console.log(err)
              this.result = 'error'
              this.$http.put(this.apiUrl + 'log/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(() => {}, () => {})
              return
            }
            console.log(veh)

            if (veh.annulation_ci !== 'NON') {
              this.result = 'cancelled'
              this.$http.put(this.apiUrl + 'log/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(() => {}, () => {})
              return
            } else {
              this.result = 'error'
            }
            try {
              this.v = histovec.histovec(veh)
              this.result = 'ok'
              this.$store.commit('updateSuccess', this.$store.state.success + 1)
              this.$store.commit('updateV', this.v)
              this.$store.commit('updateCode', this.$route.params.code)
              this.$store.commit('updateKey', this.$route.params.key)
              this.$store.commit('updateId', this.$route.params.id)
            } catch (err) {
              console.log(err)
            }
            this.$http.put(this.apiUrl + 'log/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(() => {}, () => {})
          }, (error) => {
            this.result = 'error'
            if (error.status === 404) {
              this.result = 'invalid'
            }
            if (error.status === 429) {
              this.result = 'tooManyRequests'
            }
            if (error.status === 502) {
              this.result = 'unavailable'
            }
            this.$http.put(this.apiUrl + 'log/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(() => {}, () => {})
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
