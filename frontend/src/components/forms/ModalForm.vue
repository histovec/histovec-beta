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
                <div
                  v-if="!isMessageSent"
                  class="content"
                >
                  <div v-if="mode === contact.mode.rating">
                    <div class="row">
                      <div class="col-sm-6 p-g-17">
                        <img
                          :src="imageLogoRepubliqueFrancaisePng"
                          class="img-responsive img-inline"
                          width="60px"
                          alt="Logo voxusagers.numerique.gouv.fr"
                        >
                        <span>
                          <b>voxusagers.</b><i>numerique.gouv.fr</i>
                        </span>
                      </div>
                    </div>
                    <br />
                    <div class="row">
                      <a
                        href="https://voxusagers.numerique.gouv.fr/Demarches/1867?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=8a933f17a9df32bb39598522e6d48688"
                        target="_blank"
                        @click="setEvaluation"
                      >
                        <img
                          width="140px"
                          src="https://voxusagers.numerique.gouv.fr/static/bouton-blanc.svg"
                          alt="Je donne mon avis"
                          title="Je donne mon avis sur cette démarche"
                          class="img-responsive img-center"
                        />
                      </a>
                    </div>
                  </div>
                  <div v-if="mode === contact.mode.contact">
                    <div
                      class="form-group has-feedback"
                      :class="[{'has-error' : (errors.includes(contact.error.subject))}]"
                    >
                      <label>
                        Sujet
                      </label>
                      <span
                        v-if="errors.includes(contact.error.subject)"
                        class="info_red txt-small-11"
                      >
                        {{ contact.error.subject }}
                      </span>
                      <select
                        v-model="subject"
                        class="col-sm-12 col-xs-12"
                      >
                        <option
                          v-for="(entry, index) in contact.subject"
                          :key="index"
                          :value="entry"
                          :disabled="entry === contact.subject.default"
                        >
                          {{ entry }}
                        </option>
                      </select>
                      <p><br /></p>
                    </div>
                  </div>
                  <div
                    v-if="mode === contact.mode.contact"
                    class="form-group has-feedback"
                    :class="[{'has-error' : (errors.includes(contact.error.email))}]"
                  >
                    <p>
                      <label>
                        Courriel
                      </label>
                      <span
                        v-if="errors.includes(contact.error.mail)"
                        class="info_red txt-small-11"
                      >
                        {{ contact.error.mail }}
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
                  <div v-if="mode === contact.mode.contact">
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
                      v-if="this.$store.state.siv.id"
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
                <div v-if="isMessageSent">
                  <div class="text-center">
                    <label>
                      <i class="fa fa-check info_green fa-2x"></i> Votre message a bien été envoyé.
                    </label>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <div class="row">
                  <div class="col-md-6 m-h-15 position_left">
                    <label v-if="!isMessageSent && mode === contact.mode.rating">
                      <input
                        id="showModal"
                        v-model="notShow"
                        name="showModal"
                        type="checkbox"
                        @change="persistNotShow"
                      >
                      Ne plus afficher
                    </label>
                  </div>
                  <div class="col-md-6">
                    <span
                      v-if="!isMessageSent && errors.includes(contact.error.api)"
                      class="info_red txt-small-11"
                    >
                      {{ contact.error.api }}
                      <br />
                    </span>
                    <button
                      v-if="!isMessageSent && mode === contact.mode.contact"
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
import imageLogoRepubliqueFrancaisePng from '@/assets/img/logo_de_la_Republique_francaise.png'

export default {
  data () {
    return {
      notShow: localStorage.getItem('notShow') === 'true',
      tempValue: undefined,
      disabled: false,
      message: '',
      email: '',
      note: undefined,
      clicked: false,
      isMessageSent: false,

      // images
      imageLogoRepubliqueFrancaisePng,
    }
  },
  computed: {
    who () {
      return this.$store.state.siv.id ? (this.$store.state.siv.code ? 'holder' : 'buyer') : undefined
    },
    mode () {
      return this.$store.state.modalFormMode
    },
    subject: {
      get () {
        return this.$store.state.modalFormSubject
      },
      set (value) {
        this.$store.commit('updateModalFormSubject', value)
      }
    },
    apiName () {
      return this.mode === this.contact.mode.contact ? 'contact' : ''
    },
    dispatchName () {
      return this.mode === this.contact.mode.contact ? 'sendContact' : ''
    },
    title () {
      return this.contact.title[this.mode]
    },
    filteredMessage () {
      return (this.message.length > 0) ? this.normalize(this.message).replace(/[^a-z0-9\n\u0300-\u036f,.?\-:;%()]/gi,' ') : undefined
    },
    errors () {
      let errorList = []
      if (this.clicked && (this.mode === this.contact.mode.contact) && (this.subject === this.contact.subject.default)) {
        errorList.push(this.contact.error.subject)
      }
      if (this.clicked && (this.email || this.mode === this.contact.mode.contact) && !this.isEmailValid()) {
        errorList.push(this.contact.error.mail)
      }
      if (this.clicked && this.$store.state.api && this.$store.state.api.http[this.apiName] && (this.$store.state.api.http[this.apiName] !== 201)) {
        errorList.push(this.contact.error.api)
      }
      return errorList
    },
    status () {
      if (this.clicked) {
        if (this.errors.length > 0) {
          return 'failed'
        } else if (this.$store.state.api && (this.$store.state.api.fetching.feedback || this.$store.state.api.fetching.contact)) {
          return 'posting'
        } else {
          return 'posted'
        }
      } else {
        return 'init'
      }
    }
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
      this.isMessageSent = false
      this.$store.dispatch('toggleModalForm')
      return
    },
    async send (e) {
      e.preventDefault()
      if (this.apiName) {
        this.$store.dispatch('initApiStatus', this.apiName)
      }
      this.clicked = true
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
          'identity': (this.mode === this.contact.mode.rating) ? undefined :
            {
              typeImmatriculation: this.$store.state.identity.typeImmatriculation,
              typePersonne: this.$store.state.identity.typePersonne,
              raisonSociale: this.$store.state.identity.raisonSociale,
              siren: this.$store.state.identity.siren,
              nom: this.$store.state.identity.nom,
              prenom: this.$store.state.identity.prenom,
              plaque: this.$store.state.identity.plaque,
              formule: this.$store.state.identity.formule,
              dateCertificat: this.$store.state.identity.dateCertificat
            },
          'subject': this.subject
        }

        if (this.mode === this.contact.mode.rating) {
          this.clicked = true
        } else if (this.mode === this.contact.mode.contact) {
          await this.$store.dispatch(this.dispatchName, data)
          if (this.$store.state.api.http[this.apiName] === 201) {
            this.isMessageSent = true
          } else {
            this.clicked = true
          }
        }
      }
    },
    isEmailValid () {
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return reg.test(this.email)
    },
    persistNotShow ({ target: { checked } }) {
      localStorage.setItem('notShow', checked)
    },
    setEvaluation () {
      localStorage.setItem('evaluation', true)
    }
  }
}

</script>

