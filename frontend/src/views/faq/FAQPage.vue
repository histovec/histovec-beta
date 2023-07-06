<script>
import { defineComponent } from 'vue'

import HistoVecButtonLink from '@Components/HistoVecButtonLink.vue'
import TuileDsfrNonCliquable from '@Components/TuileDsfrNonCliquable.vue'

import TitrePresentationPage from '@Components/TitrePresentationPage.vue'

import {
  FAQ_THEMES,
  FAQ_THEMES_OPTIONS,
} from '@Constants/faq.js'

import faqSvg from '@Assets/img/faq.svg?url'
import { mailTo } from '@Utils/email.js'
import { CAS_TOULOUSE_EMAIL, ABOUT_UNPAID_PV_EMAIL } from '@Constants/email.js'

import api from '@Api/index.js'
import '@/assets/stylesheets/globale.css'
import AccordeonGroupePourquoiHistovec from './component/AccordeonGroupePourquoiHistovec.vue';
import AccordeonGroupeCommentHistovec from './component/AccordeonGroupeCommentHistovec.vue';
import AccordeonGroupeVehiculeNonTrouve from './component/AccordeonGroupeVehiculeNonTrouve.vue';
import AccordeonGroupeInformationDisponible from './component/AccordeonGroupeInformationDisponible.vue';
import AccordeonGroupeErreurInformation from './component/AccordeonGroupeErreurInformation.vue';
import AccordeonGroupeErreurControleTechnique from './component/AccordeonGroupeErreurControleTechnique.vue';

export default defineComponent({
  name: 'FAQPage',

  components: {
    AccordeonGroupeErreurControleTechnique,
    AccordeonGroupeErreurInformation,
    AccordeonGroupeInformationDisponible,
    AccordeonGroupeVehiculeNonTrouve,
    AccordeonGroupeCommentHistovec,
    AccordeonGroupePourquoiHistovec,
    HistoVecButtonLink, TuileDsfrNonCliquable, TitrePresentationPage },

  data () {
    return {
      expandedId: undefined,

      image:{
        faqSvg,
        id:'image-faq',
      },
      enTete:{
        titre: 'Besoin d\'aide ?',
        sousTitre: 'Consultez la FAQ et les liens utiles',
        description: 'Si vous ne trouvez pas de réponse à votre question, n\'hésitez pas à nous contacter.',
      },
      selectedTheme: undefined,

      // email
      CAS_TOULOUSE_EMAIL,

      // constants
      FAQ_THEMES,
      FAQ_THEMES_OPTIONS,
    }
  },

  created () {
    api.log('/faq')
    this.aboutUnpaidPvEmail = mailTo(ABOUT_UNPAID_PV_EMAIL)
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
            text: 'FAQ et Liens utiles',
          },
        ]"
      />
    </div>
    <TitrePresentationPage
      :id="image.id"
      :src="image.faqSvg"
      :titre="enTete.titre"
      :sous-titre="enTete.sousTitre"
      :description="enTete.description"
    />
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <h2>Liens utiles</h2>
    </div>

    <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
      <div class="fr-col-12  fr-col-md-6  fr-col-lg-5  fr-col-xl-5">
        <TuileDsfrNonCliquable
          titre="Pour les vendeurs"
        >
          <ul>
            <li>
              Prendre connaissance des démarches
              <a
                class="fr-link"
                href="https://service-public.fr"
                title="Service Public - www.service-public.fr - Nouvelle fenêtre"
              > (Service Public)
              </a>
            </li>
            <li>
              Télécharger le certificat de situation administrative
              <router-link
                class="fr-link"
                to="/proprietaire"
                title="Proprietaire - HISTOVEC - Nouvelle fenêtre"
              >
                (HistoVec)
              </router-link>
            </li>
            <li>
              Déclarer la cession d'un véhicule
              <a
                class="fr-link"
                href="https://immatriculation.ants.gouv.fr"
                title="ANTS - www.immatriculation.ants.gouv.fr - Nouvelle fenêtre"
              >
                (A&#8203;N&#8203;T&#8203;S)
              </a>
            </li>
          </ul>
        </TuileDsfrNonCliquable>
      </div>
      <div class="fr-col-12  fr-col-md-6  fr-col-lg-5  fr-col-xl-5">
        <TuileDsfrNonCliquable
          titre="Pour les acheteurs"
        >
          <ul>
            <li>
              Prendre connaissance des démarches
              <a
                class="fr-link"
                href="https://service-public.fr"
                title="Service Public - www.service-public.fr - Nouvelle fenêtre"
              > (Service Public)
              </a>
            </li>
            <li>
              Faire une demande de changement de titulaire du certificat d'immatriculation
              <a
                class="fr-link"
                href="https://immatriculation.ants.gouv.fr"
                title="ANTS - www.immatriculation.ants.gouv.fr - Nouvelle fenêtre"
              >
                (A&#8203;N&#8203;T&#8203;S)
              </a>
            </li>
          </ul>
        </TuileDsfrNonCliquable>
      </div>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div class="fr-col-12  fr-pb-0">
      <h2>
        Foire aux Questions
      </h2>
    </div>

    <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pt-0">
      <DsfrSelect
        v-model="selectedTheme"
        required
        label="Thème"
        :options="FAQ_THEMES_OPTIONS"
        description="Sélectionnez un thème parmi les suivants."
      />
    </div>
    <div
      class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10"
      aria-live="polite"
    >
      <div
        v-if="selectedTheme === FAQ_THEMES.WHY_HISTOVEC"
      >
        <AccordeonGroupePourquoiHistovec />
      </div>

      <div
        v-if="selectedTheme === FAQ_THEMES.HOW_HISTOVEC"
      >
        <AccordeonGroupeCommentHistovec />
      </div>

      <div
        v-if="selectedTheme === FAQ_THEMES.VEHICLE_NOT_FOUND"
      >
        <AccordeonGroupeVehiculeNonTrouve />
      </div>

      <div
        v-if="selectedTheme === FAQ_THEMES.AVAILABLE_INFORMATIONS"
      >
        <AccordeonGroupeInformationDisponible />
      </div>

      <div
        v-if="selectedTheme === FAQ_THEMES.ERROR_IN_DISPLAYED_INFORMATIONS"
      >
        <AccordeonGroupeErreurInformation />
      </div>

      <div
        v-if="selectedTheme === FAQ_THEMES.KILOMETERS_AND_TECHNICAL_CONTROLS"
      >
        <AccordeonGroupeErreurControleTechnique />
      </div>
    </div>
  </div>

  <div
    v-if="selectedTheme"
    class="fr-grid-row  fr-grid-row--gutters  fr-mb12w"
  >
    <div class="fr-col-12  text-center">
      <HistoVecButtonLink
        icon="ri-mail-line"
        label="Contactez-nous"
        to="/contact"
      />
    </div>
  </div>
</template>

<style scoped>

.text-center {
  text-align: center;
}

</style>

