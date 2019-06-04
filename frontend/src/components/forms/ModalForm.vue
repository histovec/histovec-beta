<template>
  <div v-if="$store.state.modalForm">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button
                  type="button"
                  class="close"
                  @click="close()"
                >
                  <span aria-hidden="true">&times;</span>
                  <span class="sr-only">Fermer</span>
                </button>
                <h6 class="modal-title">
                  {{ title }}
                </h6>
              </div>
              <div class="modal-body">
                <div v-if="mode === 'rating'">
                  <label>
                    Comment évaluez-vous HistoVec :
                    <span
                      class="info_red"
                      title="Ce champ est requis."
                    >
                      *
                    </span>
                  </label>
                  <div class="rating position_left p-g-10">
                    <span
                      v-if="errors.includes('note')"
                      class="info_red txt-small-11"
                    >
                      {{ errorMessage['note'] }}
                      <br />
                    </span>
                    <span
                      v-for="n in ratings"
                      :key="n"
                    >
                      <a
                        :class="{'is-selected': (note && (note >= (ratings.length+1)-n))}"
                        title="Give star"
                        @click="setNote((ratings.length+1)-n)"
                        @mouseover="starOver((ratings.length+1)-n)"
                        @mouseout="starOut"
                      >
                        ★
                      </a>
                    </span>
                  </div>
                  <p class="m-h-10">
                    <label>Vos commentaires ou suggestions :</label>
                    <textarea
                      id="message"
                      v-model="message"
                      name="message"
                      rows="2"
                      class="form-control"
                      maxlength="1000"
                    >
                    </textarea>
                  </p>
                  <br />
                </div>
                <div v-if="mode !== 'rating'">
                  <div
                    class="form-group has-feedback"
                    :class="[{'has-error' : (errors.includes('object'))}]"
                  >
                    <label>
                      Objet
                    </label>
                    <span
                      v-if="errors.includes('object')"
                      class="info_red txt-small-11"
                    >
                      {{ errorMessage['object'] }}
                    </span>
                    <select
                      v-model="object"
                      class="col-sm-12 col-xs-12"
                    >
                      <option
                        disabled
                        selected
                        value=""
                      >
                        Choisissez
                      </option>
                      <option
                        v-for="(entry, index) in objects"
                        :key="index"
                      >
                        {{ entry }}
                      </option>
                    </select>
                    <p><br /></p>
                  </div>
                </div>
                <div
                  class="form-group has-feedback"
                  :class="[{'has-error' : (errors.includes('email'))}]"
                >
                  <p>
                    <label v-if="mode === 'rating'">
                      Acceptez-vous d'être recontacté pour nous donner votre retour d'expérience ?
                      <i>(L'adresse email ne servira que dans le cadre de l'amélioration du service)</i>
                    </label>
                    <label v-else>
                      Courriel
                    </label>
                    <span
                      v-if="errors.includes('email')"
                      class="info_red txt-small-11"
                    >
                      {{ errorMessage['email'] }}
                    </span>
                    <input
                      id="email"
                      v-model="email"
                      name="email"
                      class="form-control"
                      placeholder="name@example.com"
                    >
                  </p>
                </div>
                <div v-if="mode !== 'rating'">
                  <div class="form-group">
                    <p class="m-h-10">
                      <label>Message (optionnel) :</label>
                      <textarea
                        id="message"
                        v-model="message"
                        name="message"
                        rows="2"
                        class="form-control"
                        maxlength="1000"
                      >
                      </textarea>
                    </p>
                  </div>
                  <div
                    v-if="this.$store.state.histovec.id"
                  >
                    <label> Données transmises pour l'assistance </label>
                    <div class="row txt-small-11">
                      <div class="col-sm-6 col-xs-6">
                        <ul v-if="$store.state.identity.typePersonne === 'pro'">
                          <li> Raison sociale: {{ $store.state.identity.raisonSociale }} </li>
                          <li> Numéro SIREN: {{ $store.state.identity.siren }} </li>
                        </ul>
                        <ul v-else>
                          <li v-if="$store.state.identity.typeImmatriculation === 'siv'">
                            Nom de naissance: {{ $store.state.identity.nom }}
                          </li>
                          <li v-if="$store.state.identity.typeImmatriculation === 'siv'">
                            Prénom(s): {{ $store.state.identity.prenom }}
                          </li>
                          <li v-if="$store.state.identity.typeImmatriculation === 'fni'">
                            Nom de naissance et prénom(s): {{ $store.state.identity.nom }}
                          </li>
                          <li v-if="$store.state.config.id.dateNaissance">
                            Date de naissance : {{ $store.state.identity.dateNaissance }}
                          </li>
                        </ul>
                      </div>
                      <div class="col-sm-6 col-xs-6">
                        <ul>
                          <li> Immatriculation: {{ $store.state.identity.plaque }} </li>
                          <li v-if="$store.state.identity.typeImmatriculation === 'siv'">
                            Numéro de formule: {{ $store.state.identity.formule }}
                          </li>
                          <li v-else>
                            Date du certificat : {{ $store.state.identity.dateCertificat }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <div class="row">
                  <div class="col-md-6 m-h-15 position_left">
                    <label v-if="mode === 'rating'">
                      <input
                        id="showModal"
                        v-model="notShow"
                        name="showModal"
                        type="checkbox"
                      >
                      Ne plus afficher
                    </label>
                  </div>
                  <div class="col-md-6">
                    <span
                      v-if="errors.includes('api')"
                      class="info_red txt-small-11"
                    >
                      {{ errorMessage['api'] }}
                      <br />
                    </span>
                    <button
                      class="btn btn-animated btn-default m-h-05"
                      @click="send"
                    >
                      Envoyer
                      <i
                        class="fa"
                        :class="[{'fa-send-o' : (status === 'init')},
                                 {'fa-spin fa-spinner' : (status === 'posting')},
                                 {'fa-check' : (status === 'posted')},
                                 {'fa-exclamation-triangle' : (status === 'failed')}]"
                      >
                      </i>
                    </button>
                    <button
                      class="btn btn-animated btn-default"
                      @click="close()"
                    >
                      Fermer
                      <i class="fa fa-close"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { detect } from 'detect-browser'

export default {
  data () {
    return {
      errorMessage: {
        'object': 'Veuillez choisir un objet',
        'email': 'L\'adresse email n\'est pas valide',
        'note': 'L\'évaluation est obligatoire',
        'api': 'Service indisponible, votre retour n\'a pas pu être pris en compte'
      },
      notShow: false,
      ratings: [1, 2, 3, 4, 5],
      tempValue: undefined,
      disabled: false,
      object: '',
      message: '',
      email: '',
      note: undefined,
      clicked: false,
    }
  },
  computed: {
    objects () {
      let o
      let choices = {
        'NotFound': {
          'holder': [
            'Je ne trouve pas mon véhicule'
          ],
          'buyer': [
            'Le lien transmis ne fonctionne pas'
          ],
          'anyOne': []
        },
        'Found': {
          'holder': [
            'Le certificat administratif détaillé est malformé'
          ],
          'buyer': [],
          'anyOne': [
            'Problème avec les données de mon véhicule'
          ],
        },
        'anyOne': [
          'Problème de téléprocédure d\'immatriculation',
          'Autre problème'
        ]
      }
      if (this.$store.state.histovec.v) {
        o = choices['Found'][this.who].concat(choices['Found']['anyOne'].concat(choices['anyOne']))
      } else {
        o = this.who ? choices['NotFound'][this.who].concat(choices['NotFound']['anyOne'].concat(choices['anyOne'])) : choices['anyOne']
      }
      return o.filter((e) => { return e })
    },
    who () {
      return this.$store.state.histovec.id ? (this.$store.state.histovec.code ? 'holder' : 'buyer') : undefined
    },
    mode () {
      return this.$store.state.modalFormMode
    },
    apiName () {
      return this.mode === 'rating' ? 'feedback' : 'contact'
    },
    dispatchName () {
      return this.mode === 'rating' ? 'sendFeedback' : 'sendContact'
    },
    title () {
      let titles = {
        rating: 'Votre évaluation',
        contact: 'Contact',
        error: 'Signaler une erreur'
      }
      return titles[this.mode]
    },
    filteredMessage () {
      return (this.message.length > 0) ? this.normalize(this.message).replace(/[^a-z0-9\n\u0300-\u036f,.?\-:;%()]/gi,' ') : undefined
    },
    errors () {
      let errorList = []
      if (this.clicked && (this.mode !== 'rating') && (this.object === '')) {
        errorList.push('object')
      }
      if (this.clicked && ((this.mode === 'rating') && !this.note)) {
        errorList.push('note')
      }
      if (this.clicked && (this.email || this.mode !== 'rating') && !this.isEmailValid()) {
        errorList.push('email')
      }
      if (this.clicked && this.$store.state.api && this.$store.state.api.http[this.apiName] && (this.$store.state.api.http[this.apiName] !== 201)) {
        errorList.push('api')
      }
      return errorList
    },
    status () {
      if (this.clicked) {
        if (this.errors.length > 0) {
          return 'failed'
        } else if (this.$store.state.api && this.$store.state.api.fetching.feedback) {
          return 'posting'
        } else {
          return 'posted'
        }
      } else {
        return 'init'
      }
    }
  },
  created () {
  },
  methods: {
    normalize (string) {
      try {
        return string.normalize('NFD')
      } catch (e) {
        return string.replace(/[\u0300-\u036f]*/g, '')
      }
    },
    close () {
      if (this.notShow) {
          localStorage.setItem('evaluation', true, 1)
      }
      this.$store.dispatch('toggleModalForm')
      return
    },
    async send (e) {
      e.preventDefault()
      this.$store.dispatch('initApiStatus', this.apiName)
      this.clicked = true
      if (this.notShow) {
        localStorage.setItem('evaluation', true, 1)
        this.$store.dispatch('toggleModalForm')
        return
      }
      if (this.errors.length > 0) {
          setTimeout(() => this.clicked = false, 3000)
          return
      } else {
        let data = {
          'message': this.filteredMessage,
          'email': (this.email === '') ? undefined : this.email,
          'uuid': localStorage.getItem('userId'),
          'note': this.note,
          'date': new Date().toUTCString(),
          'holder': (this.who === 'holder'),
          'browser': detect(),
          'identity': (this.mode === 'rating') ? undefined :
            {
              typeImmatriculation: this.$store.state.identity.typeImmatriculation,
              typePersonne: this.$store.state.identity.typePersonne,
              nom: this.$store.state.identity.nom,
              prenom: this.$store.state.identity.prenom,
              dateNaissance: this.$store.state.identity.dateNaissance,
              plaque: this.$store.state.identity.plaque,
              formule: this.$store.state.identity.formule,
              dateCertificat: this.$store.state.identity.dateCertificat
            }
        }
        await this.$store.dispatch(this.dispatchName, data)
        if (this.$store.state.api.http[this.apiName] === 201) {
          if (this.mode === 'rating') {
            localStorage.setItem('evaluation', true, 1)
          }
          this.$store.dispatch('toggleModalForm')
        } else {
          this.clicked = true
        }
      }
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
    }
  }
}

</script>

