<script>
import { defineComponent } from 'vue'
import ErrorPage from '@/views/error/ErrorPage.vue'


export default defineComponent({
  name: 'NotFoundPage',

  components: { ErrorPage },

  props: {
    title: {
      type: String,
      default: 'Page non trouvée',
    },
    errorTitle: {
      type: String,
      default: 'La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.',
    },
    errorMessages: {
      type: Array,
      default: () => [
        'Si vous avez tapé l\'adresse web dans le navigateur, vérifiez qu\'elle est correcte. La page n\'est peut-être plus disponible.',
        'Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d\'accueil.',
        'Sinon contactez-nous pour que l\'on puisse vous rediriger vers la bonne information.',
      ],
    },
    primaryAction: {
      type: Object,
      default: () => ({
        label:'Accueil',
        to:'/accueil',
      }),
    },
    secondaryAction: {
      type: Object,
      default: () => ({
        label:'Contactez-nous',
        icon:'ri-mail-line',
        to:'/contact',
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
