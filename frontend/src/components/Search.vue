<template>
  <div>
    <!-- breadcrumb start -->
    <div class="breadcrumb-container">
      <div class="container">
        <ol class="breadcrumb">
          <li><i class="fa fa-home pr-10"></i><a href="home">Accueil</a></li>
          <li class="active">
            Recherche
          </li>
        </ol>
      </div>
    </div>
    <!-- breadcrumb end -->
    <!-- section -->
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
                    <span class="bold_6">Rassurez</span>
                    vos acheteurs potentiels
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
    <!-- section -->
    <section class="main-container">
      <div class="container">
        <div class="row">
          <div
            v-if="typeImmatriculation === ''"
            class="col-md-12"
          >
            <div class="col-md-1"></div>
            <div class="col-md-10">
              <div
                class="alert alert-warning alert-icon text-center"
                role="alert"
              >
                <i class="fa fa-exclamation-triangle"></i>
                Histovec établit l'historique des véhicules à partir des données enregistrées dans le système d'immatriculation des véhicules (SIV).
              </div>
            </div>
          </div>
          <div
            v-if="fniMode"
            class="col-md-12"
          >
            <div
              class="text-center"
              role="alert"
            >
              <h4 class="title p-b-25">
                Veuillez sélectionner le format d'immatriculation de votre véhicule
              </h4>
            </div>
          </div>
          <div
            v-if="fniMode"
            class="col-xs-6 col-sm-6"
          >
            <a
              class="clickable"
              title="Immatriculation après 2009"
              @click="typeImmatriculation = 'siv'"
            >
              <img
                class="img-responsive pull-right"
                :class="{'opacity-plaque': typeImmatriculation === 'fni' }"
                src="assets/images/nouvelle_plaque_immatriculation_fd_transp_txt.png"
                width="200"
                height="44"
              >
            </a>
          </div>
          <div
            v-if="fniMode"
            class="col-xs-6 col-sm-6"
          >
            <a
              class="clickable"
              title="Immatriculation avant 2009"
              @click="typeImmatriculation = 'fni'"
            >
              <img
                class="img-responsive pull-left"
                :class="{'opacity-plaque': typeImmatriculation === 'siv' }"
                src="assets/images/ancienne_plaque_immatriculation_fd_transp_txt.png"
                width="200"
                height="44"
              >
            </a>
          </div>
          <div
            v-if="typeImmatriculation === 'siv' || typeImmatriculation === 'fni' || !fniMode"
            class="col-md-12 col-xs-12 p-h-25"
          >
            <!-- tabs start -->
            <!-- ================ -->
            <!-- Nav tabs -->
            <ul
              class="nav nav-tabs style-2"
              role="tablist"
            >
              <li :class="[{'in active' : typePersonne === 'particulier'}]">
                <a
                  class="clickable"
                  @click="typePersonne = 'particulier'"
                >
                  <i class="fa fa-user pr-10"></i>
                  Particulier
                </a>
              </li>
              <li :class="[{'in active' : typePersonne === 'pro'}]">
                <a
                  class="clickable"
                  @click="typePersonne = 'pro'"
                >
                  <i class="fa fa-building-o pr-10"></i>
                  Entreprise
                </a>
              </li>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
              <div
                id="h2tab1"
                class="tab-pane in active"
              >
                <div class="row">
                  <div class="col-md-12">
                    <span
                      v-if="(status == 'failed') && (!checkFields)"
                      class="info_red txt-small-11"
                    >
                      * Veuillez renseignez les champs obligatoires
                    </span>
                    <fieldset>
                      <legend>
                        <span class="color-default">Titulaire</span>
                      </legend>
                      <form role="form">
                        <div
                          v-if="typePersonne === 'particulier'"
                          class="row"
                        >
                          <div :class="{'col-md-4': typeImmatriculation === 'siv' || !fniMode, 'col-md-8' : typeImmatriculation === 'fni'}">
                            <div
                              class="form-group has-feedback"
                              :class="[{'has-error' : (nom === '' && status !== 'init')}]"
                            >
                              <label
                                v-if="typeImmatriculation === 'siv' || !fniMode"
                                class="control-label"
                              >
                                Nom de naissance
                                <span
                                  class="info_red"
                                  title="Ce champ est requis."
                                >
                                  *
                                </span>
                              </label>
                              <label
                                v-if="typeImmatriculation === 'fni'"
                                class="control-label"
                              >
                                Nom(s) et Prénom(s)
                                <span
                                  class="info_red"
                                  title="Ce champ est requis."
                                >
                                  *
                                </span>
                              </label>
                              <input
                                id="lastname"
                                ref="nom"
                                v-model="nom"
                                v-focus
                                name="nom"
                                required="required"
                                type="text"
                                class="form-control"
                                tabindex="1"
                                @input="nom = $event.target.value.replace(/\t.*/,'')"
                                @paste="onPaste"
                              >
                              <i class="fa fa-user form-control-feedback"></i>
                            </div>
                          </div>
                          <div
                            v-if="typeImmatriculation === 'siv' || !fniMode"
                            class="col-md-4"
                          >
                            <div
                              class="form-group has-feedback"
                              :class="[{'has-error' : (prenom === '' && status !== 'init')}]"
                            >
                              <label class="control-label">
                                Prénom(s)
                                <span
                                  class="info_red"
                                  title="Ce champ est requis."
                                >
                                  *
                                </span>
                              </label>
                              <input
                                id="firstname"
                                v-model="prenom"
                                type="text"
                                required="required"
                                class="form-control"
                                tabindex="2"
                              >
                              <i class="fa fa-user form-control-feedback"></i>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div
                              class="form-group has-feedback"
                              :class="[{'has-error' : ((!checkDateNaissance) && status !== 'init')}]"
                            >
                              <label class="control-label">
                                Date de naissance
                                <span
                                  class="info_red"
                                  title="Ce champ est requis."
                                >
                                  *
                                </span>
                              </label>
                              <input
                                v-if="typeImmatriculation === 'fni'"
                                v-model="dateNaissance"
                                v-mask="'##/##/####'"
                                type="text"
                                required="required"
                                class="form-control"
                                placeholder="xx/xx/xxxx"
                                tabindex="2"
                              >
                              <input
                                v-if="typeImmatriculation === 'siv' || !fniMode"
                                v-model="dateNaissance"
                                v-mask="'##/##/####'"
                                type="text"
                                required="required"
                                class="form-control"
                                placeholder="xx/xx/xxxx"
                                tabindex="3"
                              >
                              <i class="fa fa-calendar form-control-feedback"></i>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="typePersonne === 'pro'"
                          class="row"
                        >
                          <div class="col-md-8">
                            <div
                              class="form-group has-feedback"
                              :class="[{'has-error' : (raisonSociale === '' && status !== 'init')}]"
                            >
                              <label class="control-label">
                                Raison sociale
                                <span
                                  class="info_red"
                                  title="Ce champ est requis."
                                >
                                  *
                                </span>
                              </label>
                              <input
                                id="organization"
                                v-model="raisonSociale"
                                name="raisonSociale"
                                type="text"
                                required="required"
                                class="form-control"
                                tabindex="1"
                                @input="raisonSociale = $event.target.value.replace(/\t.*/,'')"
                                @paste="onPaste"
                              >
                              <i class="fa fa-user form-control-feedback"></i>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div
                              class="form-group has-feedback"
                              :class="[{'has-error' : (siren === '' && status !== 'init')}]"
                            >
                              <label class="control-label">
                                N° SIREN
                                <span
                                  class="info_red"
                                  title="Ce champ est requis."
                                >
                                  *
                                </span>
                              </label>
                              <input
                                id="siren"
                                v-model="siren"
                                v-mask="'##############'"
                                type="text"
                                required="required"
                                class="form-control"
                                tabindex="2"
                              >
                              <i class="fa fa-building-o form-control-feedback"></i>
                            </div>
                          </div>
                        </div>
                      </form>
                    </fieldset>
                    <fieldset>
                      <legend><span class="color-default">Carte grise</span></legend>
                      <form role="form">
                        <div class="row">
                          <div class="col-md-6">
                            <div
                              class="form-group has-feedback"
                              :class="[{'has-error' : ((!checkPlaque) && status !== 'init')}]"
                            >
                              <label
                                for="input"
                                class="control-label"
                              >
                                Plaque d'immatriculation
                                <span
                                  class="info_red"
                                  title="Ce champ est requis."
                                >
                                  *
                                </span>
                              </label>
                              <input
                                v-if="typeImmatriculation === 'siv' || !fniMode"
                                id="plaque"
                                v-model="plaque"
                                v-mask="'AA-###-AA'"
                                type="text"
                                required="required"
                                class="form-control"
                                placeholder="AA-555-AA"
                                tabindex="4"
                              >
                              <input
                                v-if="typeImmatriculation === 'fni'"
                                id="plaque"
                                v-model="plaque"
                                type="text"
                                required="required"
                                class="form-control"
                                placeholder="123 ABC 45"
                                tabindex="4"
                              >
                              <i class="fa fa-drivers-license-o form-control-feedback"></i>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div
                              v-shortkey="['ctrl', 'alt', 'f']"
                              @shortkey="fniMode = !fniMode"
                            >
                            </div>
                            <div
                              class="form-group has-feedback plan position_left"
                              :class="[{'has-error' : ((!checkFormule && !checkDateCertificat) && status !== 'init')}]"
                            >
                              <div v-if="typeImmatriculation === 'siv' || !fniMode">
                                <label
                                  for="input"
                                  class="control-label"
                                >
                                  N° de formule
                                  <span
                                    class="info_red"
                                    title="Ce champ est requis."
                                  >
                                    *
                                  </span>
                                </label>
                                <a
                                  class="clickable text-info btn-sm-link"
                                  @click="modal = true"
                                >
                                  Où le trouver
                                  <i class="fa fa-info-circle fa-lg"></i>
                                </a>
                                <input
                                  id="formule"
                                  v-model="formule"
                                  v-mask="'####AA#####'"
                                  type="text"
                                  required="required"
                                  class="form-control"
                                  placeholder="2013BZ80335"
                                  tabindex="5"
                                >
                                <i class="fa fa-pencil-square-o form-control-feedback"></i>
                              </div>
                              <div v-if="typeImmatriculation === 'fni'">
                                <label
                                  for="input"
                                  class="control-label"
                                >
                                  Date du certificat d'immatriculation
                                  <span
                                    class="info_red"
                                    title="Ce champ est requis."
                                  >
                                    *
                                  </span>
                                </label>
                                <a
                                  class="clickable text-info btn-sm-link"
                                  @click="modal = true"
                                >
                                  Où la trouver
                                  <i class="fa fa-info-circle fa-lg"></i>
                                </a>
                                <input
                                  id="dateCertificat"
                                  v-model="dateCertificat"
                                  v-mask="'##/##/####'"
                                  type="text"
                                  required="required"
                                  class="form-control"
                                  placeholder="xx/xx/xxxx"
                                  tabindex="5"
                                >
                                <i class="fa fa-calendar form-control-feedback"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </fieldset>
                    <div class="form-group">
                      <div class="col-xs-offset-5 col-sm-7">
                        <button
                          class="btn btn-animated btn-default btn-sm"
                          tabindex="6"
                          @click="onSubmit"
                        >
                          <i
                            class="fa"
                            :class="[{'fa-search' : (status === 'init')},
                                     {'fa-spin fa-spinner' : (status === 'posting')},
                                     {'fa-exclamation-triangle' : (status === 'failed')}]"
                          >
                          </i>
                          Rechercher
                        </button>
                        <router-link
                          class="btn btn-animated btn-default btn-sm"
                          :to="{ name: 'faq',hash:'#i' }"
                        >
                          <i class="fa fa-question"></i>
                          Besoin d'aide
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- tabs end -->
        </div>
      </div>
    </section>
    <!-- section end -->
    <div class="container">
      <div class="row">
      </div>
    </div>
    <!-- debut modal -->
    <modal-helper
      v-if="modal"
      :fni-mode="fniMode"
      :type-immatriculation="typeImmatriculation"
      @close="modal = false"
    >
    </modal-helper>
    <!-- fin modal -->
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import Shake from 'shake.js'
import moment from 'moment'
import ModalHelper from './infos/ModalHelper.vue'

export default {
  components: {
    ModalHelper
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  data () {
    return {
      modal: false,
      status: 'init'
    }
  },
  computed: {
    fniMode: {
      get () {
        return this.$store.state.fniMode
      },
      set (value) {
        this.$store.commit('updateFniMode', value)
      }
    },
    nom: {
      get () {
        return this.$store.state.nom
      },
      set (value) {
        this.$store.commit('updateNom', value)
      }
    },
    prenom: {
      get () {
        return this.$store.state.prenom
      },
      set (value) {
        this.$store.commit('updatePrenom', value)
      }
    },
    dateNaissance: {
      get () {
        return this.$store.state.dateNaissance
      },
      set (value) {
        this.$store.commit('updateDateNaissance', value)
      }
    },
    raisonSociale: {
      get () {
        return this.$store.state.raisonSociale
      },
      set (value) {
        this.$store.commit('updateRaisonSociale', value)
      }
    },
    siren: {
      get () {
        return this.$store.state.siren
      },
      set (value) {
        this.$store.commit('updateSiren', value)
      }
    },
    plaque: {
      get () {
        return this.$store.state.plaque
      },
      set (value) {
        this.$store.commit('updatePlaque', value)
      }
    },
    formule: {
      get () {
        return this.$store.state.formule
      },
      set (value) {
        this.$store.commit('updateFormule', value)
      }
    },
    typePersonne: {
      get () {
        return this.$store.state.typePersonne
      },
      set (value) {
        this.$store.commit('updateTypePersonne', value)
      }
    },
    typeImmatriculation: {
      get () {
        return this.$store.state.typeImmatriculation
      },
      set (value) {
        this.$store.commit('updateTypeImmatriculation', value)
      }
    },
    dateCertificat: {
      get () {
        return this.$store.state.dateCertificat
      },
      set (value) {
        this.$store.commit('updateDateCertificat', value)
      }
    },
    checkDateNaissance () {
      return this.dateNaissance.match(/^[0-3][0-9](\/|-|\s+)?[0-1][0-9](\/|-|\s+)?[1-2][0-9]{3}$/)
    },
    checkDateCertificat () {
      return this.dateCertificat.match(/^[0-3][0-9](\/|-|\s+)?[0-1][0-9](\/|-|\s+)?[1-2][0-9]{3}$/)
    },
    checkPlaque () {
      return (this.typeImmatriculation === 'fni') ? this.plaque.match(/^\s*[0-9]{2,4}(-|\s+)?[a-zA-Z]{2,3}(-|\s+)?([0-9]{2,3}|2A|2B)\s*$/) : this.plaque.match(/^[a-zA-Z]{2}(-|\s+)?[0-9]{3}(-|\s+)?[a-zA-Z]{2}$/)
    },
    checkFormule () {
      return this.formule.match(/^\d{4}[a-zA-Z]{2}\d{5}$/)
    },
    checkFields () {
      return ((this.nom && (this.prenom || this.typeImmatriculation === 'fni') && this.checkDateNaissance) || (this.raisonSociale && this.siren)) && this.checkPlaque && (this.checkFormule || this.checkDateCertificat)
    },
    currentMonthNumber () {
      var date = new Date()
      date = moment().add(-7, 'days').format('YYYYMM')
      return date
    },
    pers_id () {
      if (this.typePersonne === 'particulier') {
        return this.nom + (this.typeImmatriculation === 'siv' ? this.prenom : '') + this.dateNaissance
      } else {
        return this.raisonSociale + this.siren
      }
    },
    veh_id () {
      if (this.typeImmatriculation === 'siv') {
        return this.plaque + this.formule
      } else {
        return this.plaque + this.dateCertificat
      }
    },
    id () {
      return this.hash(this.pers_id + this.veh_id)
    },
    code () {
      return this.hash(this.veh_id + this.currentMonthNumber)
    },
    key () {
      return this.hash(this.veh_id)
    }
  },
  created () {
    this.$http.put(this.apiUrl + 'log/' + this.$cookie.get('userId') + '/' + this.$route.path.replace(/^\/\w+\//, '')).then(() => {}, () => {})
    let myShakeEvent = new Shake({
      threshold: 15,
      timeout: 1000
    })
    myShakeEvent.start()
    window.addEventListener('shake', () => { this.active = true }, false)
    if (!window.location.host.match(/(histovec.fr|.gouv.fr$)/)) {
      this.active = true
    }
    this.typePersonne = this.$store.state.typePersonne || this.$route.params.t || 'particulier'
  },
  methods: {
    onPaste (evt) {
      let data = evt.clipboardData.getData('Text').replace(/\s*$/, '').split(/\t+/)
      if (data.length > 1) {
        if (evt.target.name === 'nom') {
          if (this.typeImmatriculation === 'siv' || !this.fniMode) {
            // this.nom = data[0]
            this.prenom = data[1]
            this.dateNaissance = data[2]
            this.plaque = data[3]
            this.formule = data[4]
          }
          if (this.typeImmatriculation === 'fni') {
            // this.nom = data[0]
            this.dateNaissance = data[1]
            this.plaque = data[2]
            this.dateCertificat = data[3]
          }
        }
        if (evt.target.name === 'raisonSociale') {
          // this.raisonSociale = data[0]
          this.siren = data[1]
          this.plaque = data[2]
          if (this.typeImmatriculation === 'siv' || !this.fniMode) {
            this.formule = data[3]
          }
          if (this.typeImmatriculation === 'fni') {
            this.dateCertificat = data[3]
          }
        }
      }
    },
    pad (n, width, z) {
      z = z || '0'
      n = n + ''
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    },
    hash (string) {
      var hash = string
      hash = hash.normalize('NFD').toLowerCase().replace(/[^0-9a-z]/g, '')
      hash = CryptoJS.SHA256(hash).toString(CryptoJS.enc.Base64)
      hash = hash.replace(/\+/g, '-').replace(/\//g, '_')
      return hash
    },
    onSubmit () {
      this.status = 'posting'
      if (this.checkFields) {
        if (this.id !== this.$store.state.id) {
          this.$store.commit('updateV', undefined)
          this.$store.commit('updateKey', undefined)
          this.$store.commit('updateCode', undefined)
          this.$store.commit('updateId', undefined)
        }
        this.$router.push({name: 'report', params: {id: this.id, key: this.key, code: this.code}})
      } else {
        this.status = 'failed'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
