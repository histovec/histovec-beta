<script>
import {defineComponent} from 'vue'
import '@/assets/stylesheets/image.css'

export default defineComponent({
  name: 'ImagePresentation',
  props: {
    id: {
      type: String,
      default: '',
    },
    alt: {
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
  <div class="fr-content-media">
    <img
      :id="id"
      class="fr-responsive-img image-presentation__format"
      :alt="alt"
      :src="src"
    >
  </div>
</template>
