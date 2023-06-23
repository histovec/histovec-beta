<script>
import {defineComponent} from 'vue'
import ImagePresentation from '@Components/ImagePresentation.vue';
import '@Assets/stylesheets/image.css'

export default defineComponent({
  name: 'TitrePresentationPage',

  components: { ImagePresentation },

  props: {
    id: {
      type: String,
      default: null,
    },
    titre: {
      type: String,
      default: '',
    },
    sousTitre: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
  },
})
</script>

<template>
  <div class="fr-col-lg-4 fr-col-xl-4">
    <ImagePresentation
      :id="id"
      :src="src"
    />
  </div>
  <div class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v">
    <h1>{{ titre }}</h1>
    <h2>{{ sousTitre }}</h2>
    <p class="fr-text--xl">
      {{ description }}
    </p>
  </div>
</template>
