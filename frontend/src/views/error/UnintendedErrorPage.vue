<script>
import { defineComponent } from 'vue'
import ErrorPage from '@/views/error/ErrorPage.vue'


export default defineComponent({
  name: 'UnintendedErrorPage',

  components: { ErrorPage },

  props: {
    title: {
      type: String,
      default: 'Erreur inattendue',
    },
    errorTitle: {
      type: String,
      default: 'Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible.',
    },
    errorMessages: {
      type: Array,
      default: () => [
        'Essayez de rafraichir la page ou bien réessayez plus tard.',
        'Si vous avez besoin d\'une aide immédiate, merci de nous contacter.',
      ],
    },
    primaryAction: {
      type: Object,
      default: () => ({
        label:'Contactez-nous',
        icon:'ri-mail-line',
        to:'/contact',
      }),
    },
    secondaryAction: {
      type: Object,
      default: () => null,
    },
  },
})
</script>

<template>
  <ErrorPage
    sub-title="Erreur 500"
    v-bind="$props"
  />
</template>
