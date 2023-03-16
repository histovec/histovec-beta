<script>
import {defineComponent} from 'vue'
import '@/assets/stylesheets/globale.css'


export default defineComponent({
  name: 'CarteDsfrNonCliquable',
  props: {
    id: {
      type: String,
      default: null,
    },
    titre: {
      type: String,
      default: 'Titre de la carte',
    },
    description: {
      type: String,
      default: 'Descirption de la carte',
    },
    alt: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: 'Image de la carte',
    },
  },
  methods: {
    getId() {
      if (this.id && this.id.length > 0) return this.id

      let newId = this.titre.toLowerCase()
      newId = newId.replaceAll(' ', '-')
      newId = newId.replaceAll('\'', '-')

      return 'carte-' + newId
    },
    getAlt() {
      if (this.alt && this.alt.length > 0) return this.alt
      return null
    },
  },
})
</script>

<template>
  <div :id="getId()" class="fr-card fr-card--no-arrow background-default-white">
    <div class="fr-card__body">
      <h4 class="fr-card__title">
        <span>{{ titre }}</span>
      </h4>
      <p class="fr-card__desc">{{ description }}</p>
    </div>
    <div class="fr-card__img">
      <img class="fr-responsive-img" :src="image" :alt="getAlt()"/>
      <!-- L’alternative de l’image (attribut alt) doit rester vide car l’image est illustrative et ne doit pas être restituée aux technologies d’assistance -->
    </div>
  </div>
</template>
