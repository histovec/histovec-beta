<script>
import {defineComponent} from 'vue'
import '@Assets/stylesheets/image.css'

export default defineComponent({
  name: 'ImagePresentation',
  props: {
    id: {
      type: String,
      default: null,
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
      class="fr-responsive-img"
      :alt="alt"
      :src="src"
    >
  </div>
</template>
