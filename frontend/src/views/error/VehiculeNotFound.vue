<script>
import { defineComponent } from 'vue'
import ErrorPage from '@Views/error/ErrorPage.vue'


export default defineComponent({
  name: 'VehiculeNotFoundPage',

  components: { ErrorPage },

  props: {
    title: {
      type: String,
      default: 'Ce véhicule est inconnu d\'HistoVec',
    },
    errorTitle: {
      type: String,
      default: '',
    },
    errorMessages: {
      type: Array,
      default: () => ([
        'Vos noms et prénoms sont susceptibles d\'avoir fait l\'objet d\'erreurs lors de la saisie de votre dossier.',
        'Recopiez exactement les données de votre certificat d\'immatriculation. Le certificat d\'immatriculation que vous utilisez n\'est peut-être pas le dernier en cours de validité (perte, vol, ...).',
      ]),
    },
    primaryAction: {
      type: Object,
      default: () => ({
        label: 'Revenir au formulaire de recherche',
        icon: 'ri-arrow-right-fill',
        to: '/proprietaire',
      }),
    },
  },
})
</script>

<template>
  <ErrorPage
    sub-title="Erreur 404"
    v-bind="$props"
  />
</template>
