<script>
import { defineComponent } from 'vue'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'

import AccueilSvg from '@/assets/img/accueil.svg'
import confidentielSvg from '@/assets/img/confidentiel.svg?url'
import gratuitSvg from '@/assets/img/gratuit.svg?url'
import officielSvg from '@/assets/img/officiel.svg?url'
import simpleSvg from '@/assets/img/simple.svg?url'


export default defineComponent({
  name: 'AccueilPage',

  components: { AccueilSvg, HistoVecButtonLink },

  data () {
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
      images: {
        confidentielSvg,
        gratuitSvg,
        officielSvg,
        simpleSvg,
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
      <DsfrPicture src="">
        <AccueilSvg
          title="Illustration de la page d'accueil"
        />
      </DsfrPicture>
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
    <div
      class="fr-col-12"
      style="text-align: center"
    >
      <h2>Nos garanties</h2>
    </div>
  </div>

  <div
    class="fr-grid-row fr-grid-row--gutters"
    style="margin-bottom: 2rem"
  >
    <div class="fr-col-offset-1 fr-col-10">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-3">
          <!-- @todo: image is broken -->
          <DsfrCard
            title="Simple"
            description="En 3 étapes seulement : Identifiez-vous, générez le rapport et partagez-le!"
            detail=""
            alt-img=""
            link=""
            :img-src="images.simpleSvg"
            no-arrow
          />
        </div>
        <div class="fr-col-3">
          <!-- @todo: image is broken -->
          <DsfrCard
            title="Officiel"
            description="Données issues du Système d'immatriculation des véhicules."
            detail=""
            alt-img=""
            link=""
            :img-src="images.officielSvg"
            no-arrow
          />
        </div>
        <div class="fr-col-3">
          <!-- @todo: image is broken -->
          <DsfrCard
            title="Confidentiel"
            description="Seul le propriétaire peut partager ses informations."
            detail=""
            alt-img=""
            link=""
            :img-src="images.confidentielSvg"
            no-arrow
          />
        </div>
        <div class="fr-col-3">
          <!-- @todo: image is broken -->
          <DsfrCard
            title="Gratuit"
            description="Un service gratuit pour les propriétaires et les acheteurs."
            detail=""
            alt-img=""
            link=""
            :img-src="images.gratuitSvg"
            no-arrow
          />
        </div>
      </div>
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      class="fr-col-12"
      style="text-align: center"
    >
      <h2>Propriétaire ou Acheteur ?</h2>
      <p class="fr-text--xl">
        Propriétaire, générez le rapport.
      </p>
      <p class="fr-text--xl">
        Acheteur, demandez-le au vendeur.
      </p>
    </div>
  </div>

  <div
    class="fr-grid-row fr-grid-row--gutters"
    style="margin-bottom: 2rem"
  >
    <div class="fr-col-offset-1 fr-col-5">
      <DsfrTile
        v-bind="tilesProprietaire"
        :horizontal="true"
      />
    </div>
    <div class="fr-col-5">
      <DsfrTile
        v-bind="tilesAcheteur"
        :horizontal="true"
      />
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      class="fr-col-offset-1 fr-col-5"
      style="text-align: right"
    >
      <HistoVecButtonLink
        label="Besoin d'aide ?"
        to="/faq"
      />
    </div>
    <div
      class="fr-col-5"
      style="text-align: left"
    >
      <HistoVecButtonLink
        label="Contactez-nous"
        to="/contact"
        secondary
      />
    </div>
  </div>
</template>
