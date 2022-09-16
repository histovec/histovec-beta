<script>
import {defineComponent} from 'vue'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'

import confidentielSvg from '@/assets/img/confidentiel.svg?url'
import gratuitSvg from '@/assets/img/gratuit.svg?url'
import officielSvg from '@/assets/img/officiel.svg?url'
import simpleSvg from '@/assets/img/simple.svg?url'


export default defineComponent({
  name: 'AccueilPage',

  components: {HistoVecButtonLink},

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
          titre: 'Simple',
          description: 'En 3 étapes seulement : Identifiez-vous, générez le rapport et partagez-le!',
          image: simpleSvg,
        },
        {
          titre: 'Officiel',
          description:'Données issues du Système d\'immatriculation des véhicules.',
          image:officielSvg,
        },
        {
          titre: 'Confidentiel',
          description: 'Seul le propriétaire peut partager ses informations.',
          image:confidentielSvg,
        },
        {
          titre: 'Gratuit',
          description: 'Un service gratuit pour les propriétaires et les acheteurs.',
          image:gratuitSvg,
        },
      ],
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
          class="fr-img-responsive fr-pl-2v"
          alt="Illustration de la page de la page d'accueil"
          src="../../src/assets/img/accueil.svg"
          style="width:100%"
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

  <div class="fr-grid-row fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div v-for="(carteItem, index) in carteItems" :key="index" class="fr-col-10  fr-col-md-3  fr-col-lg-3  fr-col-xl-3 fr-col">
      <div class="bordure fr-m-3 fr-p-2" >
        <div class="fr-card__header">
          <div class="fr-card__img">
            <img class="fr-responsive-img" :src="carteItem.image" alt="">
          </div>
        </div>
        <div class="fr-card__body">
          <div class="fr-card__content">
            <h4 class="fr-card__title">
              <span>{{ carteItem.titre }}</span>
            </h4>
            <p class="fr-card__desc">{{carteItem.description}}</p>
          </div>
        </div>
      </div>
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

.bordure {
  border: 0.1rem solid #e5e5e5;
  height:100%
}
</style>
