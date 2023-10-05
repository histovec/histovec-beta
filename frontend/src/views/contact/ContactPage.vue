<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import api from '@Api/index.js'

import {
  CONTACT_TAG_TYPES,
  CONTACT_THEME,
  READONLY_CONTACT_THEME_VALUES,
  ALL_CONTACT_THEMES_OPTIONS, DEFAULT_CONTACT_THEMES_OPTIONS, CONTACT_THEMES_OPTIONS,
} from '@Constants/contact.js'
import '@Assets/stylesheets/globale.css'
import FormulaireEnvoiMail from './component/FormulaireEnvoiMail.vue'
import CessionVehiculeTheme from './component/CessionVehiculeTheme.vue'
import CessionCertificatImmatriculationTheme from './component/CessionCertificatImmatriculationTheme.vue'
import CertificatImmatriculationPerduTheme from './component/CertificatImmatriculationPerduTheme.vue'
import LeverOppositionTheme from './component/LeverOppositionTheme.vue'
import MauvaiseDonneesPersonnellesTheme from './component/MauvaiseDonneesPersonnellesTheme.vue'

export default defineComponent({
  name: 'ContactPage',

  components: {
    MauvaiseDonneesPersonnellesTheme,
    LeverOppositionTheme,
    CertificatImmatriculationPerduTheme,
    CessionCertificatImmatriculationTheme,
    CessionVehiculeTheme,
    FormulaireEnvoiMail,
    RouterLink,
  },

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

      // Components model values
      selectedTheme: undefined,

      tags: tags.map((tag, idx) => ({
        ...tag,
        onClick: () => {
          const clickedTag = this.tags.find((_, i) => i === idx)
          clickedTag.selected = !clickedTag.selected
        },
      })),

    }
  },
  computed: {
    // Contact form
    isFormMasked () {
      return !this.selectedTheme || this.isReadonlyTheme
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
  },
  created () {
    api.log('/contact')
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

  <div
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-0"
    aria-live="polite"
  >
    <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10">
      <label class="fr-h6 label-themes">Veuillez choisir un ou plusieurs thèmes :</label>
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
      <CessionVehiculeTheme v-if="selectedTheme === CONTACT_THEME.TRANSFER" />
      <CessionCertificatImmatriculationTheme v-if="selectedTheme === CONTACT_THEME.REGISTRATION_CARD_CHANGE" />
      <CertificatImmatriculationPerduTheme v-if="selectedTheme === CONTACT_THEME.REGISTRATION_CARD_LOSS" />
      <LeverOppositionTheme v-if="selectedTheme === CONTACT_THEME.RESOLVE_PV" />
      <MauvaiseDonneesPersonnellesTheme v-if="selectedTheme === CONTACT_THEME.PERSONAL_DATA" />
    </template>

    <div
      v-if="!isFormMasked"
      class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mt-0"
    >
      <FormulaireEnvoiMail
        :selected-theme-text="selectedThemeText"
      />
    </div>
  </div>
</template>

<style scoped>
  .label-themes {
    display: block;
  }
</style>
