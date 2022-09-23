<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TuileDsfrNonCliquable',

  props: {
    titre: {
      type: String,
      default: 'Titre de la tuile',
    },
    description: {
      type: String,
      default: 'Description de la tuile',
    },
  },
})
</script>

<template>
  <div class="fr-tile fr-enlarge">
    <div class="fr-tile__body">
      <h4 class="fr-tile__title">
        <span class="fr-tile__link">{{ titre }}</span>
      </h4>
      <p class="fr-tile__desc">
        {{ description }}
      </p>
    </div>
  </div>
</template>
