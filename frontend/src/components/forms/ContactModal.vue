<template>
  <div v-if="$store.state.isContactModalVisible">
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
                  Contact
                </h6>
              </div>
              <div class="modal-body">
                <div
                  v-if="!isMessageSent"
                  class="content"
                >
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

                  <div
                    v-if="isReadOnlySubject && !isDefaultSubject"
                    class="form-group has-feedback"
                  >
                    <p>
                      <label>
                        Marche à suivre
                      </label>
                      <br>
                      <span v-if="subject === contact.subject.transfer">
                        Il convient d'effectuer les
                        <a
                          href="https://immatriculation.ants.gouv.fr/Questions-frequentes/Vendre-ou-donner-mon-vehicule/Commencer-une-declaration-de-cession"
                          target="_blank"
                        >
                          démarches de déclaration de cession du véhicule
                          <i class="fa fa-external-link"></i>
                        </a>
                        auprès de l'ANTS (Agence Nationale des Titres Sécurisés)
                      </span>
                      <span v-if="subject === contact.subject.registrationCardChange">
                        Il convient d'effectuer les
                        <a
                          href="https://immatriculation.ants.gouv.fr/Questions-frequentes/Acheter-ou-recevoir-un-vehicule-d-occasion/Realiser-la-teleprocedure-J-achete-ou-je-recois-un-vehicule-d-occasion"
                          target="_blank"
                        >
                          démarches de changement de titulaire du certificat d'immatriculation
                          <i class="fa fa-external-link"></i>
                        </a>
                        auprès de l'ANTS (Agence Nationale des Titres Sécurisés)
                      </span>
                      <span v-if="subject === contact.subject.registrationCardLoss">
                        Il convient d'effectuer les
                        <a
                          href="https://immatriculation.ants.gouv.fr/Vos-demarches/Obtenir-un-duplicata-en-cas-de-perte-vol-deterioration"
                          target="_blank"
                        >
                          démarches de déclaration de perte ou de vol du certificat d'immatriculation
                          <i class="fa fa-external-link"></i>
                        </a>
                        auprès de l'ANTS (Agence Nationale des Titres Sécurisés)
                      </span>
                      <span v-if="subject === contact.subject.resolvePV">
                        Il convient de contacter le Centre Amendes Service au 08 21 08 00 31 (appel surtaxé) ou
                        <a
                          href="https://www.antai.gouv.fr"
                          target="_blank"
                        >
                          l'Agence nationale de traitement automatisé des infractions (ANTAI)
                        </a>.
                      </span>
                      <span v-if="subject === contact.subject.personalData || subject === contact.subject.vehicleData">
                        HistoVec vous permet de consulter les données enregistrées dans le SIV (Système d'Immatriculation des Véhicules).
                        <br>
                        <br>
                        Pour toute modification de vos données, rendez-vous sur
                        <a
                          href="https://immatriculation.ants.gouv.fr/Questions-frequentes/Demarche-Je-souhaite-faire-une-autre-demande"
                          target="_blank"
                        >
                          les démarches
                          <i class="fa fa-external-link"></i>
                        </a>
                        proposées par l'ANTS (Agence Nationale des Titres Sécurisés)
                      </span>
                    </p>
                  </div>

                  <div
                    v-if="!isReadOnlySubject && !isDefaultSubject"
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

                  <div v-if="!isReadOnlySubject && !isDefaultSubject">
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
                      v-if="$store.state.siv.id"
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
                  </div>
                  <div class="col-md-6">
                    <span
                      v-if="!isReadOnlySubject && !isMessageSent && errors.includes(contact.error.api)"
                      class="info_red txt-small-11"
                    >
                      {{ contact.error.api }}
                      <br />
                    </span>
                    <button
                      v-if="!isReadOnlySubject && !isMessageSent"
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
import contact from '@/assets/json/contact.json'
import imageLogoRepubliqueFrancaisePng from '@/assets/img/logo_de_la_Republique_francaise.png'

export default {
  data () {
    return {
      message: '',
      email: '',
      clicked: false,
      isMessageSent: false,
      readOnlySubjects: [
        contact.subject.transfer,
        contact.subject.registrationCardChange,
        contact.subject.registrationCardLoss,
        contact.subject.resolvePV,
        contact.subject.personalData,
        contact.subject.vehicleData
      ],
      contact,

      // images
      imageLogoRepubliqueFrancaisePng,
    }
  },
  computed: {
    who () {
      return this.$store.state.siv.id ? (this.$store.state.siv.code ? 'holder' : 'buyer') : undefined
    },
    subject: {
      get () {
        return this.$store.state.contactModalSubject
      },
      set (value) {
        this.$store.commit('updateContactModalSubject', value)
      }
    },
    apiName () {
      return 'contact'
    },
    dispatchName () {
      return 'sendContact'
    },
    filteredMessage () {
      return (this.message.length > 0) ? this.normalize(this.message).replace(/[^a-z0-9\n\u0300-\u036f,.?\-:;%()]/gi,' ') : undefined
    },
    errors () {
      let errorList = []
      if (this.clicked && (this.subject === contact.subject.default)) {
        errorList.push(contact.error.subject)
      }
      if (this.clicked && this.email && !this.isEmailValid()) {
        errorList.push(contact.error.mail)
      }
      if (this.clicked && this.$store.state.api && this.$store.state.api.http[this.apiName] && (this.$store.state.api.http[this.apiName] !== 201)) {
        errorList.push(contact.error.api)
      }
      return errorList
    },
    status () {
      if (this.clicked) {
        if (this.errors.length > 0) {
          return 'failed'
        } else if (this.$store.state.api && this.$store.state.api.fetching.contact) {
          return 'posting'
        } else {
          return 'posted'
        }
      } else {
        return 'init'
      }
    },
    isReadOnlySubject () {
      return this.readOnlySubjects.includes(this.subject)
    },
    isDefaultSubject () {
      return this.subject === contact.subject.default
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
      this.$store.dispatch('toggleContactModal')
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
          'date': new Date().toUTCString(),
          'holder': (this.who === 'holder'),
          'browser': detect(),
          'identity':{
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

        await this.$store.dispatch(this.dispatchName, data)
        if (this.$store.state.api.http[this.apiName] === 201) {
          this.isMessageSent = true
        } else {
          this.clicked = true
        }
      }
    },
    isEmailValid () {
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return reg.test(this.email)
    }
  }
}

</script>

