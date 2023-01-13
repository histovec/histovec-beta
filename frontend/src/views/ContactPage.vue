<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import { detect } from 'detect-browser'
import dayjs from 'dayjs'

import api from '@/api/index.js'

import { FR_DATE_FORMAT, ISO_DATE_FORMAT } from '@/assets/js/format.js'
import {
  CONTACT_TAG_TYPES,
  CONTACT_THEME,
  READONLY_CONTACT_THEME_VALUES,
  ALL_CONTACT_THEMES_OPTIONS, DEFAULT_CONTACT_THEMES_OPTIONS, CONTACT_THEMES_OPTIONS,
} from '@/constants/contact.js'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@/constants/type.js'
import { EMAIL_REGEX } from '@/constants/regex.js'
import '@/assets/stylesheets/globale.css'

export default defineComponent({
  name: 'ContactPage',

  components: { RouterLink },

  data () {
    const tags = [
      { label: 'Certificat d\'immatriculation / Carte grise', tagName: 'button', id: CONTACT_TAG_TYPES.CERTIFICAT_IMMATRICULATION },  // Anciennement appelé "carte grise"
      { label: 'Titulaire / Propriétaire', tagName: 'button', id: CONTACT_TAG_TYPES.PROPRIETAIRE_OU_TITULAIRE },
      { label: 'Rapport HistoVec', tagName: 'button', id: CONTACT_TAG_TYPES.RAPPORT_HISTOVEC },
      { label: 'Véhicule', tagName: 'button', id: CONTACT_TAG_TYPES.VEHICULE },
      // { label: 'CSA (Certificat de Situation Administrative)', tagName: 'button', id: CONTACT_TAG_TYPES.CSA },  // Anciennement appelé "Certificat de non gage"
      { label: 'Autre', tagName: 'button', id: CONTACT_TAG_TYPES.AUTRE },
    ]

    return {
      // Constants
      CONTACT_THEME,
      READONLY_CONTACT_THEME_VALUES,
      TYPE_PERSONNE,
      TYPE_IMMATRICULATION,

      // Components model values
      selectedTheme: undefined,
      messageTheme: null,
      messageEmail: null,
      message: null,

      identity: {},

      tags: tags.map((tag, idx) => ({
        ...tag,
        onClick: () => {
          const clickedTag = this.tags.find((_, i) => i === idx)
          clickedTag.selected = !clickedTag.selected
        },
      })),

      // Contact email alerts
      isSuccessAlertVisible: false,
      isErrorAlertVisible: false,
    }
  },
  computed: {
    // Contact form
    isFormMasked () {
      return !this.selectedTheme || this.isReadonlyTheme
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
    isFormValid () {
      return this.isMessageEmailValid && this.isMessageValid
    },
    isAlertVisible () {
      return this.isSuccessAlertVisible || this.isErrorAlertVisible
    },
    isReadonlyTheme () {
      return this.READONLY_CONTACT_THEME_VALUES.includes(this.selectedTheme)
    },
    selectedThemeText () {
      return (
        this.selectedTheme && ALL_CONTACT_THEMES_OPTIONS.find(({value}) => value === this.selectedTheme).text
      ) || ''
    },
    selectedTags () {
      return this.tags.filter((tag) => tag.selected)
    },
    selectedTagsIds () {
      return this.selectedTags.map(({ id }) => id)
    },
    filteredThemesOptions () {
      if (this.selectedTags.length === 0) {
        return ALL_CONTACT_THEMES_OPTIONS
      }

      const filteredThemes = CONTACT_THEMES_OPTIONS.filter(({ types }) => {
        const intersection = this.selectedTagsIds.filter(id => types.includes(id))
        return intersection.length !== 0
      })
      return filteredThemes.concat(DEFAULT_CONTACT_THEMES_OPTIONS)
    },
    normalizedMessage () {
      if (!this.message) {
        return ''
      }

      const { message } = this
      try {
        message.normalize('NFD')
      } catch (e) {
        message.replace(/[\u0300-\u036f]*/g, '')
      }

      // eslint-disable-next-line no-misleading-character-class
      return message.replace(/[^a-z0-9\n\u0300-\u036f,.?\-:;%()]/gi,' ')
    },
    themeLabel () {
      const themeCount = this.filteredThemesOptions.length
      return `Thèmes (${themeCount} choix possibles)`
    },
  },
  watch: {
    filteredThemesOptions(newOptions) {  // A chaque changement de tag (filtre de thème)
      // Réinitialiser le thème lorsque qu'il ne fait plus partie des choix possibles
      if (this.selectedTheme &&!newOptions.includes(this.selectedTheme)) {
        this.selectedTheme = undefined
      }
    },
    selectedTheme() {  // A chaque changement de thème
      // Pré-remplir automatiquement le thème avec le text qui sert d'affichage
      this.messageTheme = this.selectedThemeText

      // Supprimer la notification d'erreur ou de succès de l'envoi du message
      this.resetAlertStates()
    },
    messageEmail() {  // A chaque édition de l'email
      // Supprimer la notification d'erreur ou de succès de l'envoi du message
      this.resetAlertStates()
    },
    message() {  // A chaque édition du message
      // Supprimer la notification d'erreur ou de succès de l'envoi du message
      this.resetAlertStates()
    },
  },

  beforeMount() {
    this.identity = this.buildIdentity()
  },

  methods: {
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

      const isoDateCertificat = (
        dateEmissionCertificatImmatriculation ?
          dayjs(dateEmissionCertificatImmatriculation, FR_DATE_FORMAT).format(ISO_DATE_FORMAT) :
          ''
      )

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
          await api.log(`${this.$route.path}/mail/ok`)
        } else {
          this.isErrorAlertVisible = true
          await api.log(`${this.$route.path}/mail/ko`)
        }
      } catch(error) {
        this.isErrorAlertVisible = true
        await api.log(`${this.$route.path}/mail/ko`)
      }
    },
  },
})
</script>

<template>
  <div class="fr-grid-row  fr-grid-row--gutters  fr-mb-2w">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        :links="[
          {
            to: '/accueil',
            text: 'Accueil',
          },
          {
            text: 'Contact',
          },
        ]"
      />
    </div>

    <div class="fr-col-12">
      <h1>Nous contacter</h1>
      <p class="fr-text--xl">
        Vous n'avez pas trouvé la réponse à votre question dans la page
        <router-link
          class="fr-link"
          to="/faq"
        >
          FAQ et Liens utiles
        </router-link> ?
      </p>
      <p class="fr-text--xl">
        Remplissez le formulaire ci-dessous et expliquez-nous votre problème.
      </p>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-0" aria-live="polite">
    <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10">
      <h6>Veuillez choisir un ou plusieurs thèmes :</h6>
      <DsfrTags
        :tags="tags"
      />
    </div>

    <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10">
      <DsfrSelect
        v-model="selectedTheme"
        required
        :label="themeLabel"
        :options="filteredThemesOptions"
        description="Sélectionnez un thème parmi les suivants."
      />
    </div>
  </div>
  <div aria-live="polite">
    <template v-if="isReadonlyTheme">
      <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mt-4w">
        <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pb-0">
          <h5>Marche à suivre</h5>
        </div>
      </div>
      <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w  fr-mt-0">
        <div class="fr-col-12  fr-col-offset-md-1  fr-col-md-11  fr-col-offset-lg-1  fr-col-lg-11  fr-col-offset-xl-1  fr-col-xl-11">
          <p v-if="selectedTheme === CONTACT_THEME.TRANSFER">
            Il convient d'effectuer les
            <a
              class="fr-link"
              href="https://immatriculation.ants.gouv.fr/Questions-frequentes/Vendre-ou-donner-mon-vehicule/Commencer-une-declaration-de-cession"
              rel="noopener noreferrer"
              target="_blank"
            >
              démarches de déclaration de cession du véhicule
            </a>
            auprès de l'ANTS (Agence Nationale des Titres Sécurisés).
          </p>

          <p v-if="selectedTheme === CONTACT_THEME.REGISTRATION_CARD_CHANGE">
            Il convient d'effectuer les
            <a
              class="fr-link"
              href="https://immatriculation.ants.gouv.fr/Questions-frequentes/Acheter-ou-recevoir-un-vehicule-d-occasion/Realiser-la-teleprocedure-J-achete-ou-je-recois-un-vehicule-d-occasion"
              rel="noopener noreferrer"
              target="_blank"
            >
              démarches de changement de titulaire du certificat d'immatriculation
            </a>
            auprès de l'ANTS (Agence Nationale des Titres Sécurisés)
          </p>

          <p v-if="selectedTheme === CONTACT_THEME.REGISTRATION_CARD_LOSS">
            Il convient d'effectuer les
            <a
              class="fr-link"
              href="https://immatriculation.ants.gouv.fr/Vos-demarches/Obtenir-un-duplicata-en-cas-de-perte-vol-deterioration"
              rel="noopener noreferrer"
              target="_blank"
            >
              démarches de déclaration de perte ou de vol du certificat d'immatriculation
            </a>
            auprès de l'ANTS (Agence Nationale des Titres Sécurisés)
          </p>

          <p v-if="selectedTheme === CONTACT_THEME.RESOLVE_PV">
            Il convient de contacter le Centre Amendes Service au 08 21 08 00 31 (appel surtaxé) ou
            <a
              class="fr-link"
              href="https://www.antai.gouv.fr"
              rel="noopener noreferrer"
              target="_blank"
            >
              l'Agence nationale de traitement automatisé des infractions (ANTAI)
            </a>.
          </p>

          <p v-if="selectedTheme === CONTACT_THEME.PERSONAL_DATA || selectedTheme === CONTACT_THEME.REPORT_DATA">
            HistoVec vous permet de consulter les données enregistrées dans le SIV (Système d'Immatriculation des Véhicules).
            <br />
            <br />
            Pour toute modification de vos données, rendez-vous sur
            <a
              class="fr-link"
              href="https://immatriculation.ants.gouv.fr/Questions-frequentes/Demarche-Je-souhaite-faire-une-autre-demande"
              rel="noopener noreferrer"
              target="_blank"
            >
              les démarches
            </a>
            proposées par l'ANTS (Agence Nationale des Titres Sécurisés)
          </p>
        </div>
      </div>
    </template>

    <div
      v-if="!isFormMasked"
      class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mt-0"
    >
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
        <h6 class="fr-mb-1w">
          Données transmises pour l'assistance
        </h6>
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

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div
      v-if="!isFormMasked"
      class="fr-col-12  text-center"
    >
      <DsfrButton
        :disabled="!isFormValid || isAlertVisible"
        label="Envoyer"
        @click="sendContactEmail"
      />
    </div>
  </div>
</template>

<style scoped>
  .text-center {
    text-align: center;
  }
</style>
