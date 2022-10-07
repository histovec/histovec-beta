<script>
import { defineComponent } from 'vue'
import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'
import ImagePresentation from '@/components/ImagePresentation.vue'

import api from '@/api/index.js'
import { mailTo } from '@/utils/email.js'
import { ASK_REPORT_EMAIL } from '@/constants/email.js'

import acheteurSvg from '@/assets/img/acheteur.svg?url'

export default defineComponent({
  name: 'AcheteurPage',

  components: { HistoVecButtonLink, ImagePresentation },

  created () {
    this.askReportEmail = mailTo(ASK_REPORT_EMAIL)
  },
  data () {
    return {
      image:{
        acheteurSvg,
      },
    }
  },
  methods: {
    async onClickMailDemandeRapport () {
      window.location = this.askReportEmail

      await api.log(`${this.$route.path}`)
    },
  },
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
      <ImagePresentation :src="image.acheteurSvg" alt="Illustration de la page de l'acheteur" />
    </div>
    <div class="fr-col-12  fr-col-lg-8  fr-col-xl-8  fr-mt-10v">
      <h1>Achetez en confiance un véhicule d'occasion</h1>
      <h2>Demandez l'historique du véhicule</h2>
      <p class="fr-text--xl">
        Vous souhaitez acquérir un véhicule d'occasion ?
        Vous avez fait une sélection de véhicules parmi des annonces ?
        Demandez au vendeur de partager l'historique de son véhicule.
      </p>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <p class="fr-text--md">
        HistoVec permet au vendeur de partager avec un acheteur intéressé l'historique administratif du véhicule enregistré dans le Système d'Immatriculation des Véhicules (SIV), notamment :
      </p>
      <ul class="fr-ml-4w  fr-pl-0">
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

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div class="fr-col-12  fr-col-md-5  fr-col-lg-4  fr-col-xl-4  text-center">
      <DsfrButton
        label="Demander le rapport au vendeur"
        icon="ri-send-plane-fill"
        @click="onClickMailDemandeRapport"
      />
    </div>
    <div class="fr-col-12  fr-col-md-4  fr-col-lg-2  fr-col-xl-2  text-center">
      <HistoVecButtonLink
        label="Besoin d'aide"
        icon="ri-question-line"
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
