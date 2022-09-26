<script>
import {defineComponent} from 'vue'
import confidentielSvg from '@/assets/img/confidentiel.svg?url'
import gratuitSvg from '@/assets/img/gratuit.svg?url'
import officielSvg from '@/assets/img/officiel.svg?url'
import simpleSvg from '@/assets/img/simple.svg?url'

export default defineComponent({
  name: 'CarteDsfrNonCliquable',

  data() {
    return {
      carteItems: [
        {
          titre: 'Simple',
          description: 'En 3 étapes seulement : Identifiez-vous, générez le rapport et partagez-le!',
          image: simpleSvg,
        },
        {
          titre: 'Officiel',
          description: 'Données issues du Système d\'immatriculation des véhicules.',
          image: officielSvg,
        },
        {
          titre: 'Confidentiel',
          description: 'Seul le propriétaire peut partager ses informations.',
          image: confidentielSvg,
        },
        {
          titre: 'Gratuit',
          description: 'Un service gratuit pour les propriétaires et les acheteurs.',
          image: gratuitSvg,
        },
      ],
    }
  },
})
</script>

<template>

  <div class="fr-grid-row fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div v-for="(carteItem, index) in carteItems" :key="index"
         class="fr-col-10  fr-col-md-3  fr-col-lg-3  fr-col-xl-3 fr-col">
      <div class="fr-card fr-card--no-arrow">
        <div class="fr-card__body">
          <h4 class="fr-card__title">
            <span>{{ carteItem.titre }}</span>
          </h4>
          <p class="fr-card__desc">{{ carteItem.description }}</p>
        </div>
        <div class="fr-card__img">
          <img class="fr-responsive-img" :src="carteItem.image" alt=""/>
          <!-- L’alternative de l’image (attribut alt) doit rester vide car l’image est illustrative et ne doit pas être restituée aux technologies d’assistance -->
        </div>
      </div>
    </div>
  </div>
</template>
