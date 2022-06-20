<script>
import { defineComponent } from 'vue'
import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'

import RapportAcheteurSvg from '@/assets/img/acheteur.svg'


export default defineComponent({
  name: 'RapportAcheteurPage',

  components: { RapportAcheteurSvg, HistoVecButtonLink },
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
            text: 'Rapport acheteur',
          },
        ]"
      />
    </div>

    <div class="fr-col-lg-4 fr-col-xl-4">
      <DsfrPicture src="">
        <RapportAcheteurSvg
          title="Illustration de la page du rapport acheteur HistoVec"
        />
      </DsfrPicture>
    </div>
    <div class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v">
      <h1>Rapport du véhicule</h1>
      <h2>Consultez l'historique du véhicule</h2>

      query: {{ $route.query }}
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
    </div>
  </div>
</template>
