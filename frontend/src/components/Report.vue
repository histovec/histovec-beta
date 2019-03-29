<template>
<section id="result">
  <!-- breadcrumb start -->
  <div class="breadcrumb-container">
    <div class="container">
      <ol class="breadcrumb">
        <li><i class="fa fa-home pr-10"></i><a href="home">Accueil</a></li>
        <li class="active">Résultats</li>
      </ol>
    </div>
  </div>
  <!-- breadcrumb end -->
  <!-- section -->
<section class="main-container">
  <div class="container">
    <div class="row">
      <!-- section start -->
      <section class="dark-translucent-bg" style="background-image:url(assets/images/poignee_de_main.jpg); background-position: 50% 50%">
        <div class="container">
          <div class="row justify-content-lg-center">
            <div class="col-lg-12">
              <h2 class="text-center mt-4">
                <div v-if="holder"><span class="bold_6">Rassurez</span> vos acheteurs potentiels</div>
                <div v-else><span class="bold_6">Achetez</span> en confiance un <span class="bold_6">véhicule d'occasion</span></div>
              </h2>
              <div class="separator with-icon"><i class="fa fa-car bordered"></i></div>
            </div>
          </div>
        </div>
      </section>
      <!-- section end -->
    </div>
  </div>
</section>
<!-- section -->

  <!-- main-container start -->
  <div class="container" v-if="(this.result === 'ok') || (this.result === 'cached')">
    <div class="row">
      <div class="col-lg-12 mb-20">
        <!-- debut vignette -->
        <div class="row">
          <div class="col-sm-5">
            <div class="alert alert-icon alert-info" role="alert"> <i v-bind:class="'fa fa-' + v.logo_vehicule " ></i> Numéro - Plaque d'immatriculation : {{ v.plaque }}</div>
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
          <ul class="nav nav-tabs" role="tablist">
            <li :class="[{'active' : tab === 'abstract'}]"><a class="clickable" @click="tab = 'abstract'"><i class="fa fa-refresh pr-10"></i> Synthèse</a></li>
            <li :class="[{'active' : tab === 'vehicle'}]"><a class="clickable" @click="tab = 'vehicle'"><i v-bind:class="'fa fa-' + v.logo_vehicule + ' pr-10'" ></i>Véhicule</a></li>
            <li :class="[{'active' : tab === 'holder'}]"><a class="clickable" @click="tab = 'holder'"><i class="fa fa-address-card pr-10"></i>Titulaire & Titre</a></li>
            <li :class="[{'active' : tab === 'situation'}]"><a class="clickable" @click="tab = 'situation'"><i class="fa fa-clipboard pr-10"></i> Situation administrative</a></li>
            <li :class="[{'active' : tab === 'history'}]"><a class="clickable" @click="tab = 'history'"><i class="fa fa-calculator pr-10"></i> Historique des opérations </a></li>
            <li :class="[{'active' : tab === 'send'}]" v-if="holder"><a class="clickable" @click="tab = 'send'"><i class="fa fa-send pr-10"></i> Transmettre le rapport</a></li>
          </ul>
          <!-- Tab panes -->
          <div class="tab-content">
            <!-- /* ----------------- synthese ----------------- */ -->
            <div class="tab-pane fade" :class="[{'in active' : display['all_tabs'] || tab === 'abstract'}]">
              <abstract :v="v" :holder="holder" :display="display"></abstract>
            </div>
            <!-- /* ----------------- vehicule ----------------- */ -->
            <div class="tab-pane fade pr-20" :class="[{'in active' : display['all_tabs'] || tab === 'vehicle'}]">
              <tech-chars :v="v"></tech-chars>
            </div>
            <!-- /* ----------------- titre ----------------- */ -->
            <div class="tab-pane fade" :class="[{'in active' : display['all_tabs'] || tab === 'holder'}]">
              <license :v="v"></license>
            </div>
            <!-- situation administrative -->
            <div class="tab-pane fade" :class="[{'in active' : display['all_tabs'] || tab === 'situation'}]">
              <administrative :v="v" :holder="holder" :display="display"></administrative>
            </div>
            <!-- historique des opérations -->
            <div class="tab-pane fade" :class="[{'in active' : display['all_tabs'] || tab === 'history'}]">
              <history :v="v"></history>
            </div>
            <div class="tab-pane fade" :class="[{'in active' : display['all_tabs'] || tab === 'send'}]" v-if="holder">
              <share :url="url" :baseurl="baseurl"></share>
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
  <!-- container -->

  <div class="container" v-if="this.result === 'wait'">
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-info text-center" role="alert">  Recherche en cours <i class="fa fa-spinner fa-spin"></i> </div>
      </div>
    </div>
  </div>

  <div class="container" v-if="this.result === 'notFound'">
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-icon alert-danger" role="alert"> <i class="fa fa-warning"></i> Désolé, nous n'avons pas trouvé de résultat pour cette recherche. <router-link class="clickable alert-danger" :to="{ name: 'faq',hash:'#i'}"><em>Besoin d'aide</em> <b class="fa fa-question-circle fa-lg"></b></router-link></div>
      </div>
    </div>
  </div>

  <div class="container" v-if="this.result === 'invalid'">
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-icon alert-danger" role="alert"> <i class="fa fa-warning"></i> Les données entrées sont invalides. Veuillez essayer à nouveau. <router-link class="clickable alert-danger" :to="{ name: 'faq',hash:'#i'}"><em>Besoin d'aide</em> <b class="fa fa-question-circle fa-lg"></b></router-link></div>
      </div>
    </div>
  </div>

  <div class="container" v-if="this.result === 'unavailable'">
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-icon alert-danger" role="alert"> <i class="fa fa-warning"></i> Le service Histovec n'est pas disponible pour le moment. Veuillez réessayer ultérieurement. <router-link class="clickable alert-danger" :to="{ name: 'faq'}"><em>Besoin d'aide</em> <b class="fa fa-question-circle fa-lg"></b></router-link> </div>
      </div>
    </div>
  </div>

  <div class="container" v-if="this.result === 'tooManyRequests'">
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-icon alert-danger" role="alert"> <i class="fa fa-warning"></i> Trop de requêtes pour le moment. Veuillez attendre quelques instants puis réessayez. <router-link class="clickable alert-danger" :to="{ name: 'faq'}"><em>Besoin d'aide</em> <b class="fa fa-question-circle fa-lg"></b></router-link></div>
      </div>
    </div>
  </div>

  <div class="container" v-if="this.result === 'error'">
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-icon alert-danger" role="alert"> <i class="fa fa-warning"></i> Erreur inconnue. Si l'erreur persiste, merci de remplir le formulaire. <router-link class="clickable alert-danger" :to="{ name: 'feedback'}"><em>Signaler une erreur</em> <b class="fa fa-exclamation-circle fa-lg"></b></router-link></div>
      </div>
    </div>
  </div>

  <div class="container" v-if="this.result === 'cancelled'">
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-icon alert-danger" role="alert"> <i class="fa fa-warning"></i> Le certificat demandé a été annulé. <router-link class="clickable alert-danger" :to="{ name: 'faq'}"><em>Besoin d'aide</em> <b class="fa fa-question-circle fa-lg"></b></router-link></div>
      </div>
    </div>
  </div>

  <div class="container" v-if="this.result === 'invalidKey'">
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-icon alert-danger" role="alert"> <i class="fa fa-warning"></i> Le lien transmis est incomplet : veuillez redemander le lien complet à votre vendeur. <router-link class="clickable alert-danger" :to="{ name: 'faq'}"><em>Besoin d'aide</em> <b class="fa fa-question-circle fa-lg"></b></router-link></div>
      </div>
    </div>
  </div>

  <!-- debut modal -->
  <div v-if="modalEval">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" @click="modalEval = false">
                  <span aria-hidden="true">&times;</span>
                  <span class="sr-only">Fermer</span>
                </button>
                <h6 class="modal-title">Votre évaluation</h6>
              </div>
              <form @submit="send" id="evaluation-form-with-recaptcha"  role="form">
                <div class="modal-body">
                  <span class="info_red txt-small-11" v-if="status == 'failed' && errors.length == 0">* Veuillez renseigner les champs obligatoires<br/></span>
                  <label>Comment évaluez-vous HistoVec :  <span class="info_red" title="Ce champ est requis.">*</span></label>
                  <div class="rating position_left p-g-10">
                    <template v-for="n in ratings" >
                      <a v-on:click="setNote((ratings.length+1)-n)"
                         v-on:mouseover="starOver((ratings.length+1)-n)"
                         v-on:mouseout="starOut"
                         v-bind:class="{'is-selected': ((note >= (ratings.length+1)-n) && note != null)}"
                         title="Give star"
                         v-model="note">★</a>
                    </template>
                  </div>
                  <p class="m-h-10">
                    <label>Vos commentaires ou suggestions :</label>
                    <textarea class="form-control" id="message" name="message" rows="2" v-model="message"></textarea>
                  </p>
                  <br />
                  <div class="form-group has-feedback" :class="[{'has-error' : (errors.length > 0 && status !== 'init')}]">
                    <p>
                    <label>Acceptez-vous d'être recontacté pour nous donner votre retour d'expérience ? <i>(L'adresse email ne servira que dans le cadre de cette étude)</i></label>
                    <span class="info_red txt-small-11" v-if="errors.length > 0">{{ errors[0] }}</span>
                    <input class="form-control" id="email" name="email" placeholder="name@example.com" v-model="email">
                    </p>
                  </div>
                </div>
                <div class="modal-footer">
                  <div class="row">
                    <div class="col-md-6 m-h-15 position_left">
                      <label>
                      <input type="checkbox" id="showModal" name="showModal" v-model="notShow">Ne plus afficher</label>
                    </div>
                    <div class="col-md-6">
                      <button class="btn btn-animated btn-default m-h-05">Envoyer
                        <i class="fa" :class="[{'fa-send-o' : (status === 'init')},
                                           {'fa-spin fa-spinner' : (status === 'posting')},
                                           {'fa-check' : (status === 'posted')},
                                           {'fa-exclamation-triangle' : (status === 'failed')}]"></i>
                      </button>
                      <button class="btn btn-animated btn-default" @click="modalEval = false">Fermer <i class="fa fa-close"></i></button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <!-- fin modal -->
</section>
</template>

<script>

import Abstract from './reportParts/Abstract.vue'
import TechChars from './reportParts/TechChars.vue'
import License from './reportParts/License.vue'
import Administrative from './reportParts/Administrative.vue'
import History from './reportParts/History.vue'
import Share from './reportParts/Share.vue'
import moment from 'moment'
import histovec from '../assets/js/histovec'

export default {
  components: {
    Abstract,
    TechChars,
    License,
    Administrative,
    History,
    Share
  },
  data () {
    return {
      tab: 'abstract',
      display: {
        all_tabs: false,
        pdf: true,
        date_update: true
      },
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
      modalEval: false,
      errors: [],
      message: '',
      email: '',
      notShow: false,
      status: 'init',
      tempValue: null,
      ratings: [1, 2, 3, 4, 5],
      disabled: false,
      note: null,
      timeout: 10000,
      timerModalEval: 120000
    }
  },
  computed: {
    validityDate () {
      return moment().add(-7, 'days').add(2, 'months').date(0).format('DD/MM/YYYY')
    },
    holder () {
      return (this.$route.params.code !== undefined) || (this.$store.state.code !== undefined)
    },
    mailBody () {
      var text = encodeURI('Un titulaire de véhicule vous transmet un rapport HistoVec\n\nRendez-vous sur le lien suivant pour le consulter: \n')
      return text + this.url.replace('&', '%26')
    },
    smsBody () {
      var text = encodeURI('Un titulaire de véhicule vous transmet un rapport HistoVec.\n\nRendez-vous sur le lien suivant pour le consulter: \n')
      return text + this.url.replace('&', '%26')
    },
    baseurl () {
      // return 'https://histovec.interieur.gouv.fr'
      return window.location.protocol + '//' + window.location.host
    },
    url () {
      return this.baseurl + '/histovec/report?id=' + (this.$store.state.code || this.$route.params.code) + '&key=' + (this.$store.state.key || this.$route.params.key)
    }
  },
  methods: {
    send (e) {
      this.status = 'posting'
      if (this.note || this.notShow) {
        let data = {'message': this.message, 'email': this.email, 'uid': this.$cookie.get('userId'), 'note': this.note, 'date': new Date().toUTCString()}
        if (!this.note && this.notShow) {
          this.$cookie.set('evaluation', true, 1)
          this.status = 'posted'
          this.modalEval = false
        } else {
          if (this.email && !this.isEmailValid()) {
            this.errors.push('L\'adresse email n\'est pas valide')
            this.status = 'failed'
          } else {
            this.$http.post(this.apiUrl + 'feedback/', data)
            .then(response => {
              this.status = 'posted'
              this.modalEval = false
              this.$cookie.set('evaluation', true, 1)
            }, () => {
              this.status = 'failed'
            }
            )
          }
        }
      } else {
        this.status = 'failed'
      }
      e.preventDefault()
    },
    isEmailValid () {
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return reg.test(this.email)
    },
    setNote (value) {
      if (!this.disabled) {
        this.tempValue = value
        this.note = value
      }
    },
    starOver (value) {
      if (!this.disabled) {
        this.tempValue = this.note
        this.note = value
      }
    },
    starOut () {
      if (!this.disabled) {
        this.note = this.tempValue
      }
    },
    showModalEval () {
      if (this.$cookie.get('evaluation') === 'false' || this.$cookie.get('evaluation') === null) {
        setTimeout(() => {
          this.modalEval = true
          this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + 'feedback').then(response => {}, () => {})
        }, this.timerModalEval)
      }
    }
  },
  created () {
    setTimeout(() => {
      if (this.result === 'wait') {
        this.result = 'error'
      }
      this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(response => {}, () => {})
    }, this.timeout)

    this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + (this.holder ? 'holder' : 'buyer')).then(response => {}, () => {})
    if (this.$store.state.v) {
      this.v = this.$store.state.v
      this.showModalEval()
      this.result = 'cached'
      this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(response => {}, () => {})
    } else {
      if (!this.holder && this.$route.query.key === undefined && this.$route.query.id !== undefined) {
        // Cas des liens acheteur sans KEY
        this.result = 'invalidKey'
        this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(response => {}, () => {})
        return
      }
      if ((this.holder ? this.$route.params.id : this.$route.query.id) === undefined) {
        this.result = 'invalid'
        this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(response => {}, () => {})
      } else {
        this.$http.get(this.apiUrl + 'id/' + this.$cookie.get('userId') + '/' + (this.holder ? this.$route.params.id : this.$route.query.id))
          .then(response => {
            console.log(response)
            if (response.body.hits.hits.length === 0) {
              this.result = 'notFound'
              this.$store.commit('updateFail', this.$store.state.fail + 1)
              this.$http.put(this.apiUrl + 'log/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(response => {}, () => {})
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
                  'message': this.message,
                  'uid': this.$cookie.get('userId'),
                  'date': new Date().toUTCString()
                }
                this.$http.post(this.apiUrl + 'feedback/', data)
                .then(response => {
                  console.log('failure report send')
                }, () => {
                  console.log('couldn\'t send fail report')
                }
                )
              }
              return
            }
            this.showModalEval()
            var encrypted = response.body.hits.hits[0]._source.v.replace(/-/g, '+').replace(/_/g, '/')
            var key = ((this.$route.params.key !== undefined) ? this.$route.params.key : this.$route.query.key).replace(/-/g, '+').replace(/_/g, '/')
            try {
              var veh = histovec.decrypt(key, encrypted)
            } catch (err) {
              console.log(err)
              this.result = 'error'
              this.$http.put(this.apiUrl + 'log/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(response => {}, () => {})
              return
            }
            console.log(veh)

            if (veh.annulation_ci !== 'NON') {
              this.result = 'cancelled'
              this.$http.put(this.apiUrl + 'log/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(response => {}, () => {})
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
            this.$http.put(this.apiUrl + 'log/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(response => {}, () => {})
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
            this.$http.put(this.apiUrl + 'log/' + this.$route.path.replace(/^\/\w+\//, '') + '/' + this.result).then(response => {}, () => {})
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
