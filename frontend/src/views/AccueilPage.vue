<script>
import {defineComponent} from 'vue'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'


import CarteDsfrNonCliquable from '@/components/CarteDsfrNonCliquable.vue';


export default defineComponent({
  name: 'AccueilPage',

  components: {CarteDsfrNonCliquable, HistoVecButtonLink},

  data() {
    return {

      tilesProprietaire:
        {
          title: 'Propriétaire',
          description: 'Rassurez vos acheteurs potentiels avec le rapport et obtenez votre certificat de non gage.',
          to: '/proprietaire',
          imgSrc: '',
        },
      tilesAcheteur:
        {
          title: 'Acheteur',
          description: 'Achetez en confiance : demandez le rapport au vendeur.',
          to: '/acheteur',
          imgSrc: '',
        },

    }
  },
})
</script>

<template>
  <!--  fr-mt-10v -->
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="[
          {
            text: 'Accueil',
          },
        ]"
      />
    </div>

    <div class="fr-col-lg-4 fr-col-xl-4">
      <div class="fr-content-media">
        <img
          class="fr-img-responsive fr-pl-2v tailleImage"
          alt="Illustration de la page de la page d'accueil"
          src="../../src/assets/img/accueil.svg"
        >
      </div>
    </div>
    <div class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v">
      <h1>Partagez l'historique de votre véhicule</h1>
      <h2>Jouez la transparence</h2>
      <p class="fr-text--xl">
        Vous souhaitez vendre votre véhicule ?
        Vous avez fait une sélection de véhicules parmi des annonces ?
        Partagez ou consultez l'historique du véhicule.
      </p>
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12  text-center">
      <h2>Nos garanties</h2>
    </div>
  </div>

  <CarteDsfrNonCliquable/>



  <div class="fr-grid-row fr-grid-row--gutters  fr-grid-row--center">
    <div class="fr-col-12  text-center">
      <h2>Propriétaire ou Acheteur ?</h2>
      <p class="fr-text--xl">
        Propriétaire, générez le rapport.
      </p>
      <p class="fr-text--xl">
        Acheteur, demandez-le au vendeur.
      </p>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div class="fr-col-12  fr-col-md-5  fr-col-lg-5  fr-col-xl-5">
      <DsfrTile
        v-bind="tilesProprietaire"
        :horizontal="true"
      />
    </div>
    <div class="fr-col-12  fr-col-md-5  fr-col-lg-5  fr-col-xl-5">
      <DsfrTile
        v-bind="tilesAcheteur"
        :horizontal="true"
      />
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters  fr-grid-row--center  fr-grid-row--center">
    <div class="fr-col-12  fr-col-md-4  fr-col-lg-3  fr-col-xl-3  text-center">
      <HistoVecButtonLink
        label="Besoin d'aide"
        icon="ri-question-line"
        to="/faq"
      />
    </div>
    <div class="fr-col-12  fr-col-md-4  fr-col-lg-3  fr-col-xl-3  text-center">
      <HistoVecButtonLink
        label="Contactez-nous"
        icon="ri-mail-line"
        to="/contact"
        secondary
      />
    </div>
  </div>
</template>

<style scoped>

.text-center {
  text-align: center;
}

.tailleImage {
  width:80%
}
</style>
