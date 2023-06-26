<script>
import { defineComponent } from 'vue'
import '@Assets/stylesheets/image.css'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@Constants/type.js'
import { EMAIL_REGEX } from '@Constants/regex.js'
import {detect} from 'detect-browser'
import api from '@Api/index.js'

export default defineComponent({
  name: 'FormulaireEnvoiMail',
  props: {
    selectedThemeText: {
      type: String,
      default: null,
    },
  },
  data () {

    return {
      // Constants
      TYPE_PERSONNE,
      TYPE_IMMATRICULATION,

      // Components model values
      selectedTheme: undefined,
      messageEmail: null,
      message: null,
      identity: {},

      // Contact email alerts
      isSuccessAlertVisible: false,
      isErrorAlertVisible: false,
    }
  },
  computed: {
    isFormValid () {
      return this.isMessageEmailValid && this.isMessageValid
    },
    isAlertVisible () {
      return this.isSuccessAlertVisible || this.isErrorAlertVisible
    },
    isMessageEmailValid () {
      return this.messageEmail && this.messageEmail.match(EMAIL_REGEX)
    },
    messageEmailErrorMessage () {
      return (
        this.messageEmail !== null && !this.isMessageEmailValid ?
          'Saisissez une adresse avec un format valide, exemple : nom@exemple.fr' :
          ''
      )
    },
    isMessageValid () {
      return this.message && this.message.length > 0
    },
    messageErrorMessage () {
      return (
        this.message !== null && !this.isMessageValid ?
          'Le message est obligatoire. Veuillez le renseigner.' :
          ''
      )
    },
    normalizedMessage () {
      if (!this.message) {
        return ''
      }

      const { message } = this
      let messageNormalized

      try {
        messageNormalized = message.normalize('NFD')
      } catch (e) {
        messageNormalized = message.replace(/[\u0300-\u036f]*/g, '')
      }

      // eslint-disable-next-line no-misleading-character-class
      return messageNormalized.replace(/[^a-z0-9\n\u0300-\u036f,.?\-:;%()]/gi,' ')
    },
  },
  watch: {
    messageEmail() {  // A chaque édition de l'email
      // Supprimer la notification d'erreur ou de succès de l'envoi du message
      this.resetAlertStates()
    },
    message() {  // A chaque édition du message
      // Supprimer la notification d'erreur ou de succès de l'envoi du message
      this.resetAlertStates()
    },
    selectedThemeText() {  // A chaque changement de thème
      // Supprimer la notification d'erreur ou de succès de l'envoi du message
      this.resetAlertStates()
    },
  },
  beforeMount() {
    this.identity = this.buildIdentity()
  },
  methods:{
    resetAlertStates () {
      this.isSuccessAlertVisible = false
      this.isErrorAlertVisible = false
    },
    buildIdentity () {
      const cachedFormData = JSON.parse(sessionStorage.getItem('formData'))
      const formData = (
        cachedFormData ||
        {
          typeImmatriculation: null,
          typePersonne: null,
          siv: {
            titulaire: {
              particulier: {
                nom: '',
                prenoms: '',
              },
              personneMorale : {
                raisonSociale: '',
                numeroSiren: '',
              },
            },
            numeroImmatriculation: '',
            numeroFormule: '',
          },
          fni: {
            titulaire: {
              particulier: {
                nomEtPrenoms: '',
              },
              personneMorale: {
                raisonSociale: '',
                numeroSiren: '',
              },
            },
            numeroImmatriculation: '',
            dateEmissionCertificatImmatriculation: '',
          },
        }
      )

      const { siv: sivData, fni: fniData, typeImmatriculation, typePersonne } = formData
      if (typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
        return this.buildSivIdentity(typePersonne, sivData)
      } else if (formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
        return this.buildFniIdentity(typePersonne, fniData)
      }

      return {
        dateCertificat: null,
        formule: null,
        nom: null,
        plaque: null,
        prenoms: null,
        raisonSociale: null,
        siren: null,
        typeImmatriculation: null,
        typePersonne: null,
      }
    },
    buildSivIdentity (typePersonne, sivData) {
      const {
        titulaire: {
          particulier: {
            nom = '',
            prenoms = '',
          },
          personneMorale : {
            raisonSociale = '',
            numeroSiren = '',
          },
        },
        numeroImmatriculation = '',
        numeroFormule = '',
      } = sivData

      return {
        formule: numeroFormule,
        nom,
        plaque: numeroImmatriculation,
        prenoms,
        raisonSociale,
        siren: numeroSiren,
        typeImmatriculation: TYPE_IMMATRICULATION.SIV,
        typePersonne,
      }
    },
    buildFniIdentity (typePersonne, fniData) {
      const {
        titulaire: {
          particulier: {
            nomEtPrenoms = '',
          },
          personneMorale: {
            raisonSociale = '',
            numeroSiren = '',
          },
        },
        numeroImmatriculation = '',
        dateEmissionCertificatImmatriculation = '',
      } = fniData

      const isoDateCertificat = dateEmissionCertificatImmatriculation ? dateEmissionCertificatImmatriculation.split('/').reverse().join('-') : ''

      return {
        dateCertificat: isoDateCertificat,
        nom: nomEtPrenoms,
        plaque: numeroImmatriculation,
        raisonSociale,
        siren: numeroSiren,
        typeImmatriculation: TYPE_IMMATRICULATION.FNI,
        typePersonne,
      }
    },
    async sendContactEmail (event) {
      event.preventDefault()

      this.resetAlertStates()

      const data = {
        browser: detect(),
        date: new Date().toISOString(),
        email: this.messageEmail || undefined,
        holder: !!this.identity.plaque,
        identity: this.identity,
        message: this.normalizedMessage,
        subject: this.selectedThemeText,
        uuid: localStorage.getItem('userId'),
      }
      try {
        const { status } = await api.sendContactEmail(data)

        if (status === 201) {
          this.isSuccessAlertVisible = true
          await api.log('/mail/ok')
        } else {
          this.isErrorAlertVisible = true
          await api.log('/mail/ko')
        }
      } catch(error) {
        this.isErrorAlertVisible = true
        await api.log('/mail/ko')
      }
    },
  },

})
</script>

<template>
  <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10">
    <p class="fr-text--xs">
      Tous les champs sont obligatoires.
    </p>
    <DsfrInputGroup
      :is-valid="isMessageEmailValid"
      :error-message="messageEmailErrorMessage"
      description-id="email-erreur-message"
    >
      <DsfrInput
        v-model="messageEmail"
        label="Email"
        label-visible
        hint="Votre email"
        autocomplete="email"
        type="email"
        required
        :aria-invalid="!isMessageEmailValid"
        aria-errormessage="email-erreur-message"
      />
    </DsfrInputGroup>
  </div>
  <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10">
    <DsfrInputGroup
      :is-valid="isMessageValid"
      :error-message="messageErrorMessage"
      description-id="message-erreur-message"
    >
      <DsfrInput
        v-model="message"
        label="Message"
        label-visible
        hint="Votre message"
        is-textarea
        required
        :aria-invalid="!isMessageValid"
        aria-errormessage="message-erreur-message"
      />
    </DsfrInputGroup>
  </div>
  <div
    v-if="identity.typeImmatriculation === TYPE_IMMATRICULATION.SIV || identity.typeImmatriculation === TYPE_IMMATRICULATION.FNI"
    class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-mt-3w"
  >
    <h2 class="fr-mb-1w fr-h6">
      Données transmises pour l'assistance
    </h2>
    <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center">
      <div class="fr-col-12  fr-col-md-6  fr-col-lg-6  fr-col-xl-6">
        <ul
          v-if="identity.typePersonne === TYPE_PERSONNE.PRO"
          class="fr-ml-4w  fr-pl-0"
        >
          <li> Raison sociale: <span class="fr-text--bleu">{{ identity.raisonSociale || 'non renseigné' }}</span> </li>
          <li> Numéro SIREN: <span class="fr-text--bleu">{{ identity.siren || 'non renseigné' }}</span> </li>
        </ul>
        <ul
          v-else
          class="fr-ml-4w  fr-pl-0"
        >
          <li v-if="identity.typeImmatriculation === TYPE_IMMATRICULATION.SIV">
            Nom de naissance: <span class="fr-text--bleu">{{ identity.nom || 'non renseigné' }}</span>
          </li>
          <li v-if="identity.typeImmatriculation === TYPE_IMMATRICULATION.SIV">
            Prénom(s): <span class="fr-text--bleu">{{ identity.prenoms || 'non renseigné' }}</span>
          </li>
          <li v-if="identity.typeImmatriculation === TYPE_IMMATRICULATION.FNI">
            Nom de naissance et prénom(s): <span class="fr-text--bleu">{{ identity.nom || 'non renseigné' }}</span>
          </li>
        </ul>
      </div>
      <div class="fr-col-12  fr-col-md-6  fr-col-lg-6  fr-col-xl-6">
        <ul class="fr-ml-4w  fr-pl-0">
          <li>
            Immatriculation: <span class="fr-text--bleu">{{ identity.plaque || 'non renseigné' }}</span>
          </li>
          <li v-if="identity.typeImmatriculation === TYPE_IMMATRICULATION.SIV">
            Numéro de formule: <span class="fr-text--bleu">{{ identity.formule || 'non renseigné' }}</span>
          </li>
          <li v-if="identity.typeImmatriculation === TYPE_IMMATRICULATION.FNI">
            Date du certificat : <span class="fr-text--bleu">{{ identity.dateCertificat || 'non renseigné' }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10">
      <DsfrAlert
        v-show="isSuccessAlertVisible"
        type="success"
        role="alert"
        title="Envoi du message effectué avec succès"
        description="
          Votre message a bien été transmis à nos équipes.
          Nous vous répondrons dès que possible.
        "
      />
      <DsfrAlert
        v-show="isErrorAlertVisible"
        type="error"
        role="alert"
        title="Échec de l'envoi du message"
        description="
          Une erreur est survenue lors de l'envoi de votre message.
          Veuillez réessayer plus tard.
        "
      />
    </div>
  </div>

  <div
    class="fr-col-12  text-center"
  >
    <DsfrButton
      id="bouton-envoyer"
      :disabled="!isFormValid || isAlertVisible"
      label="Envoyer"
      @click="sendContactEmail"
    />
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>
