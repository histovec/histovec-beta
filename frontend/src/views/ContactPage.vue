<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import {
  CONTACT_SUBJECT, REGISTRATION_CARD_CHANGE, REGISTRATION_CARD_LOSS,
  RESOLVE_PV, PERSONAL_DATA, VEHICLE_DATA,
  HOLDER_NOT_FOUND, BUYER_NOT_FOUND, TRANSFER_SUBJECT,
  RESPONSE_NOT_FOUND_SUBJECT,
  DEFAULT_SUBJECTS, SUBJECTS,
} from '@/constants/faq.js'

const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export default defineComponent({
  name: 'ContactPage',

  components: { RouterLink },

  data () {
    const tags = [
      { label: 'Certificat d\'immatriculation / carte grise', tagName: 'button' },
      { label: 'Titulaire / Propriétaire', tagName: 'button' },
      { label: 'Rapport HistoVec', tagName: 'button' },
      { label: 'Véhicule', tagName: 'button' },
      { label: 'Certificat de Situation Administrative / Certificat de non gage', tagName: 'button' },
      { label: 'Autre', tagName: 'button' },
    ]

    return {
      // themesOptions: THEMES,
      defaultSubjectsOptions: DEFAULT_SUBJECTS,
      subjectsOptions: SUBJECTS,

      // Subjects
      TRANSFER_SUBJECT,
      REGISTRATION_CARD_CHANGE,
      REGISTRATION_CARD_LOSS,
      RESOLVE_PV,
      PERSONAL_DATA,
      VEHICLE_DATA,
      HOLDER_NOT_FOUND,
      BUYER_NOT_FOUND,

      // components model values
      rawKeyWords: undefined,
      selectedTheme: undefined,
      selectedSubject: undefined,
      messageSubject: undefined,
      messageEmail: undefined,
      message: undefined,

      tags: tags.map((tag, idx) => ({
        ...tag,
        onClick: () => {
          const clickedTag = this.tags.find((tag, i) => i === idx)
          clickedTag.selected = !clickedTag.selected
        },
      })),
    }
  },

  computed: {
    isFormMasked () {
      return ![CONTACT_SUBJECT, RESPONSE_NOT_FOUND_SUBJECT].includes(this.selectedSubject)
    },
    isFormFilled () {
      return this.messageSubject && this.messageEmail && this.message
    },
    keyWords () {
      if (!this.rawKeyWords) {
        return []
      }
      return normalize(this.rawKeyWords).split(' ')
    },
  },

  methods: {
    filteredSubjectsOptions: function () {
      if (this.keyWords.length === 0) {
        return this.subjectsOptions.concat(this.defaultSubjectsOptions)
      }

      const filteredSubjects = this.subjectsOptions.filter(({ text }) => {
        const normalizedTexts = normalize(text).split(' ')
        const filteredTexts = normalizedTexts.filter(x => this.keyWords.includes(x))
        return filteredTexts.length !== 0
      })

      const subjects = filteredSubjects.concat(this.defaultSubjectsOptions)

      // if (!subjects.includes(this.selectedSubject)) {
      //   // this.selectedSubject = undefined
      // }

      return subjects
    },
  },

})
</script>

<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
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

  <div
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center"
    style="margin-bottom: 2rem"
  >
    <div class="fr-col-7">
      <h6>Veuillez choisir un ou plusieurs thèmes :</h6>
      <DsfrTags
        :tags="tags"
      />
    </div>
    <div class="fr-col-5 fr-mt-7w">
      <DsfrSearchBar
        v-model="rawKeyWords"
        label="Rechercher"
        placeholder="Tapez votre question ici..."
        label-visible
      />
    </div>
    <!-- <div class="fr-col-12">
      <DsfrSelect
        v-model="selectedTheme"
        required
        label="Thème"
        :options="themesOptions"
        description="Sélectionnez un thème parmi les suivants."
      />
    </div> -->
    <div class="fr-col-8">
      <DsfrSelect
        v-model="selectedSubject"
        required
        label="Sujet"
        :options="filteredSubjectsOptions()"
        description="Sélectionnez un sujet parmi les suivants ou renseignez le vôtre en choisissant 'Autre'."
      />
    </div>
    <div
      v-if="!isFormMasked"
      class="fr-col-8"
    >
      <DsfrInput
        v-model="messageSubject"
        required
        type="text"
        label="Objet"
        label-visible
      />
    </div>
    <div
      v-if="!isFormMasked"
      class="fr-col-8"
    >
      <DsfrInput
        v-model="messageEmail"
        required
        type="email"
        label="Email"
        label-visible
        :disabled="isFormDisabled"
      />
    </div>
    <div
      v-if="!isFormMasked"
      class="fr-col-8"
    >
      <DsfrInput
        v-model="message"
        required
        type="text"
        label="Message"
        label-visible
        :disabled="isFormDisabled"
        is-textarea
      />
    </div>
  </div>
  <div
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center"
    style="margin-bottom: 2rem"
  >
    <div
      v-if="selectedSubject === TRANSFER_SUBJECT"
      class="fr-col-10"
    >
      Il convient d'effectuer les
      <a
        class="fr-link"
        href="https://immatriculation.ants.gouv.fr/Questions-frequentes/Vendre-ou-donner-mon-vehicule/Commencer-une-declaration-de-cession"
        rel="noopener noreferrer"
        target="_blank"
      >
        démarches de déclaration de cession du véhicule
        <i class="fa fa-external-link"></i>
      </a>
      auprès de l'ANTS (Agence Nationale des Titres Sécurisés).
    </div>
  </div>

  <div
    class="fr-grid-row fr-grid-row--gutters"
    style="margin-bottom: 4rem"
  >
    <div
      v-if="!isFormMasked"
      class="fr-col-12  text-center"
    >
      <DsfrButton
        :disabled="!isFormFilled"
        label="Envoyer"
        on-click="@todo"
      />
    </div>
  </div>
</template><style scoped>

.text-center {
  text-align: center;
}
</style>
