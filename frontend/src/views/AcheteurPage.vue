<script>
import { defineComponent } from 'vue'
import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'

import AcheteurSvg from '@/assets/img/acheteur.svg'


export default defineComponent({
  name: 'AcheteurPage',

  components: { AcheteurSvg, HistoVecButtonLink },
})
</script>

<template>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="[
          {
            to: '/accueil',
            text: 'Accueil',
          },
          {
            text: 'Acheteur',
          },
        ]"
      />
    </div>

    <div class="fr-col-lg-4 fr-col-xl-4">
      <DsfrPicture src="">
        <AcheteurSvg
          title="Illustration de la page de l'acheteur"
        />
      </DsfrPicture>
    </div>
    <div class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v">
      <h1>Achetez en confiance un véhicule d'occasion</h1>
      <h2>Demandez l'historique du véhicule</h2>
      <p class="fr-text--xl">
        Vous souhaitez acquérir un véhicule d'occasion ?
        Vous avez fait une sélection de véhicules parmi des annonces ?
        Demandez au vendeur de partager l'historique de son véhicule.
      </p>
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <p class="fr-text--md">
        HistoVec permet au vendeur de partager avec un acheteur intéressé l'historique administratif du véhicule enregistré dans le Système d'Immatriculation des Véhicules (SIV), notamment :
      </p>
      <ul class="fr-ml-4w fr-pl-0">
        <li>date de mise en circulation ;</li>
        <li>changements de propriétaire ;</li>
        <li>sinistres à réparation contrôlée ;</li>
        <li>situation administrative (gage, opposition, vol, &hellip;) etc</li>
      </ul>
      <p class="fr-text--md">
        En acheteur éclairé, vous pourrez prendre votre décision en toute quiétude.
      </p>
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
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
