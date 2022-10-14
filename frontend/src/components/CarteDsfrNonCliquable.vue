<script>
import {defineComponent} from 'vue'


export default defineComponent({
  name: 'CarteDsfrNonCliquable',
  props: {
    id: {
      type: String,
      default: '',
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
      default: '',
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
      return this.titre
    },
  }
})
</script>

<template>
  <div :id="getId()" class="fr-card fr-card--no-arrow">
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
