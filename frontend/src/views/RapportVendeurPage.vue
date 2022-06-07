<script>
import { defineComponent } from 'vue'
import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'

import RapportSvg from '@/assets/img/rapport.svg'


export default defineComponent({
  name: 'AcheteurPage',

  components: { RapportSvg, HistoVecButtonLink },

  props: {
    reportId: {
      type: String,
      default: '',
    },
    reportKey: {
      type: String,
      default: '',
    },
    typeImmatriculation: {
      type: String,
      default: '',
    },
    typePersonne: {
      type: String,
      default: '',
    },
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
            text: 'Rapport vendeur',
          },
        ]"
      />
    </div>

    <div class="fr-col-lg-4 fr-col-xl-4">
      <DsfrPicture src="">
        <RapportSvg
          title="Illustration de la page du rapport HistoVec"
        />
      </DsfrPicture>
    </div>
    <div class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v">
      <h1>Rapport de votre véhicule</h1>
      <h2>Consultez et partagez l'historique du véhicule</h2>

      reportId: {{ reportId }}
      reportKey: {{ reportKey }}
      typeImmatriculation: {{ typeImmatriculation }}
      typePersonne {{ typePersonne }}
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
    </div>
  </div>

  <div
    class="fr-grid-row fr-grid-row--gutters"
    style="margin-bottom: 4rem"
  >
    <div
      class="fr-col-offset-1 fr-col-5"
      style="text-align: right"
    >
      <DsfrButton
        label="Demander le rapport au vendeur"
        on-click="@todo"
      />
    </div>
    <div
      class="fr-col-5"
      style="text-align: left"
    >
      <HistoVecButtonLink
        label="Besoin d'aide ?"
        to="/contact"
        secondary
      />
    </div>
  </div>
</template>

