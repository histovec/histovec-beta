<script>
import { defineComponent } from 'vue'
import ErrorPage from '@/views/error/ErrorPage.vue'
import api from '@/api/index.js'

export default defineComponent({
  name: 'UnavailableServicePage',

  components: { ErrorPage },

  props: {
    title: {
      type: String,
      default: 'Service indisponible',
    },
    errorTitle: {
      type: String,
      default: 'Le service HistoVec est indisponible et l\'historique des véhicules n\'est actuellement pas consultable',
    },
    errorMessages: {
      type: Array,
      default: () => [
        'Merci de réessayer plus tard, vous serez bientôt en mesure de réutiliser le service.',
        'Si vous souhaitez vendre votre véhicule, nous vous invitons à télécharger le certificat de situation administrative auprès de l\'Agence Nationale des Titres Sécurisés.',
      ],
    },
    primaryAction: {
      type: Object,
      default: () => ({
        label: 'Obtenir le CSA à jour via l\'ANTS',
        to: 'https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat',
      }),
    },
    secondaryAction: {
      type: Object,
      default: () => null,
    },
  },
  created () {
    api.log('/unavailable')
  },
})
</script>

<template>
  <ErrorPage
    sub-title="Erreur 503"
    v-bind="$props"
  />
</template>
