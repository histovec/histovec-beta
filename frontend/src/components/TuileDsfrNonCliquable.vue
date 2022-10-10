<script>
import { defineComponent } from 'vue'
import LoaderComponent from './LoaderComponent.vue';

export default defineComponent({
  name: 'TuileDsfrNonCliquable',
  components: {LoaderComponent},
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    titre: {
      type: String,
      default: 'Titre de la tuile',
    },
  },
})
</script>

<template>
  <div class="fr-tile fr-enlarge fr-tile--horizontal">
    <LoaderComponent
      v-if="isLoading"
      taille="md"
    />
    <div class="fr-tile__body">
      <h4 class="fr-tile__title">
        <span class="fr-tile__link">{{ titre }}</span>
      </h4>
      <p class="fr-tile__desc">
        <slot />
      </p>
    </div>
  </div>
</template>
