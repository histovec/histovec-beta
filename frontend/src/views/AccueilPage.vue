<script>
import {defineComponent} from 'vue'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'
import CarteDsfrNonCliquable from '@/components/CarteDsfrNonCliquable.vue';
import ImagePresentation from '@/components/ImagePresentation.vue';

import confidentielSvg from '@/assets/img/confidentiel.svg?url'
import gratuitSvg from '@/assets/img/gratuit.svg?url'
import officielSvg from '@/assets/img/officiel.svg?url'
import simpleSvg from '@/assets/img/simple.svg?url'
import accueilSVG from '@/assets/img/accueil.svg?url'

export default defineComponent({
  name: 'AccueilPage',

  components: {CarteDsfrNonCliquable, HistoVecButtonLink, ImagePresentation},

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
      carteItems: [
        {
          id: 'carte-simple',
          titre: 'Simple',
          description: 'En 3 étapes seulement : Identifiez-vous, générez le rapport et partagez-le!',
          image: simpleSvg,
        },
        {
          id: 'carte-officiel',
          titre: 'Officiel',
          description: 'Données issues du Système d\'immatriculation des véhicules.',
          image: officielSvg,
        },
        {
          id: 'carte-confidentiel',
          titre: 'Confidentiel',
          description: 'Seul le propriétaire peut partager ses informations.',
          image: confidentielSvg,
        },
        {
          id: 'carte-gratuit',
          titre: 'Gratuit',
          description: 'Un service gratuit pour les propriétaires et les acheteurs.',
          image: gratuitSvg,
        },
      ],
      image: {
        id: 'image-accueil',
        alt: "Illustration de la page d'accueil",
        accueilSVG,
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
      <ImagePresentation :id="image.id" :src="image.accueilSVG" :alt="image.alt"/>
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
  <div class="fr-grid-row fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div v-for="(carteItem, index) in carteItems" :key="index"
         class="fr-col-10  fr-col-md-3  fr-col-lg-3  fr-col-xl-3 fr-col">
      <CarteDsfrNonCliquable :id="carteItem.id" :titre="carteItem.titre" :description="carteItem.description" :image=carteItem.image />
    </div>
  </div>


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

</style>
