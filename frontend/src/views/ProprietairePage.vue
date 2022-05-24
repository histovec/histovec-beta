<script>
import { defineComponent } from 'vue'
import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'

import { mailTo } from '@/utils/email.js'
import { ANTS_PERSONAL_DATA_EMAIL, READ_OR_UPDATE_ANTS_PERSONAL_DATA_EMAIL } from '@/constants/email.js'

import ProprietaireSvg from '@/assets/img/proprietaire.svg'

import plaqueNonSupporteeSvg from '@/assets/img/plaque_non_supportee.svg?url'
import plaqueFniSvg from '@/assets/img/plaque_fni.svg?url'
import plaqueSivSvg from '@/assets/img/plaque_siv.svg?url'


export default defineComponent({
  name: 'ProprietairePage',

  components: { ProprietaireSvg, HistoVecButtonLink },

  data () {
    return {
      // email
      ANTS_PERSONAL_DATA_EMAIL,

      images: {
        plaqueNonSupporteeSvg,
        plaqueFniSvg,
        plaqueSivSvg,
      },
    }
  },

  created () {
    this.readOrUpdateAntsPersonalDataEmail = mailTo(READ_OR_UPDATE_ANTS_PERSONAL_DATA_EMAIL)
  },
})
</script>

<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="[
          {
            to: '/accueil',
            text: 'Accueil',
          },
          {
            text: 'Propriétaire',
          },
        ]"
      />
    </div>

    <div class="fr-col-lg-4 fr-col-xl-4">
      <DsfrPicture src="">
        <ProprietaireSvg
          title="Illustration de la page du propriétaire"
        />
      </DsfrPicture>
    </div>
    <div class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v">
      <h1>Rassurez vos acheteurs potentiels</h1>
      <h2>Partagez l'historique de votre véhicule</h2>
      <p class="fr-text--xl">
        Vous souhaitez vendre votre véhicule et rassurer le futur acheteur ?
        Un acheteur potentiel vous demande le rapport ?
        Partagez-leur l'historique de votre véhicule.
      </p>
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <p class="fr-text--md">
        HistoVec permet de consulter l'historique administratif de votre véhicule enregistré dans le Système d'Immatriculation des Véhicules (SIV).
      </p>
      <p class="fr-text--md">
        Pour toute demande de renseignements sur votre dossier ou de correction des informations,
        adressez-vous à l'Agence Nationale Des Titres Sécurisés (ANTS) par voie électronique (
        <a
          class="fr-link"
          :href="readOrUpdateAntsPersonalDataEmail"
        >
          {{ ANTS_PERSONAL_DATA_EMAIL }}
        </a>).
      </p>
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
    <div class="fr-col-8">
      <h6>Veuillez sélectionner le format d'immatriculation de votre véhicule</h6>
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mb-4w">
    <div class="fr-col-3">
      <img
        :src="images.plaqueSivSvg"
        style="height: 2.5rem"
      />
    </div>

    <div class="fr-col-3">
      <img
        :src="images.plaqueFniSvg"
        style="height: 2.5rem"
      />
    </div>

    <div class="fr-col-3">
      <img
        :src="images.plaqueNonSupporteeSvg"
        style="height: 2.5rem"
      />
    </div>
  </div>


  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mb-4w">
    <div
      class="fr-col-2"
      style="text-align: right"
    >
      <!-- <DsfrButton
        label="Rechercher"
        on-click="@todo"
      /> -->
      <HistoVecButtonLink
        label="Rechercher"
        icon="ri-search-line"
        to="/rapport-vendeur"
      />
    </div>
    <div
      class="fr-col-3"
      style="text-align: left"
    >
      <DsfrButton
        label="Effacer"
        on-click="@todo"
        secondary
      />
    </div>
  </div>
</template>
