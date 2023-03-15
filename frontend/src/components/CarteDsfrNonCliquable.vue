<script>
import {defineComponent} from 'vue'
import '@/assets/css/background.css'


export default defineComponent({
  name: 'CarteDsfrNonCliquable',
  props: {
    titre: {
      type: String,
      default: 'Titre de la carte',
    },
    description: {
      type: String,
      default: 'Descirption de la carte',
    },
    image: {
      type: String,
      default: 'Image de la carte',
    },
  },
})
</script>

<template>
  <div class="fr-card fr-card--no-arrow background-default-white">
    <div class="fr-card__body">
      <h4 class="fr-card__title">
        <span>{{ titre }}</span>
      </h4>
      <p class="fr-card__desc">{{ description }}</p>
    </div>
    <div class="fr-card__img">
      <img class="fr-responsive-img" :src="image" alt=""/>
      <!-- L’alternative de l’image (attribut alt) doit rester vide car l’image est illustrative et ne doit pas être restituée aux technologies d’assistance -->
    </div>
  </div>
</template>
