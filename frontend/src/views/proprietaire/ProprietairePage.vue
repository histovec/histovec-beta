<script>
import { defineComponent } from 'vue'
import HistoVecButtonLink from '@Components/HistoVecButtonLink.vue'
import TitrePresentationPage from '@Components/TitrePresentationPage.vue'

import { DATE_FR_REGEX, NUMERO_FORMULE_REGEX, NUMERO_IMMATRICULATION_FNI_REGEX, NUMERO_IMMATRICULATION_SIV_REGEX, NUMERO_SIREN_REGEX } from '@Constants/regex.js'
import { OLD_IMMATRICULATION_TYPE, TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@Constants/type.js'

import '@Assets/stylesheets/globale.css'
import proprietaireSVG from '@Assets/img/proprietaire.svg?url'

import api from '@Api/index.js'
import { useRapportStore } from '@Stores/rapport'
import gestionAppelApi from '@Services/api/gestionAppelApi'
import SelectionnerFormatImmatriculation from '@/views/proprietaire/component/SelectionnerFormatImmatriculation.vue'
import FormulaireSIV from '@Views/proprietaire/component/FormulaireSIV.vue'
import FormulaireFNI from '@Views/proprietaire/component/FormulaireFNI.vue'
import { modalesTemplates } from '@Views/proprietaire/component/contenuModales'

export default defineComponent({
  name: 'ProprietairePage',

  components: {
    FormulaireSIV,
    FormulaireFNI,
    SelectionnerFormatImmatriculation,
    HistoVecButtonLink,
    TitrePresentationPage,
  },

  data () {
    const focusSIV = false
    const focusFNI = false
    const cachedFormData = JSON.parse(sessionStorage.getItem('formData'))
    const formData = (
      cachedFormData ||
      {
        typeImmatriculation: null,
        typePersonne: TYPE_PERSONNE.PARTICULIER,
        siv: {
          titulaire: {
            particulier: {
              nom: '',
              prenoms: '',
            },
            personneMorale : {
              raisonSociale: '',
              numeroSiren: '',
            },
          },
          numeroImmatriculation: '',
          numeroFormule: '',
        },
        fni: {
          titulaire: {
            particulier: {
              nomEtPrenoms: '',
            },
            personneMorale: {
              raisonSociale: '',
              numeroSiren: '',
            },
          },
          numeroImmatriculation: '',
          dateEmissionCertificatImmatriculation: '',
        },
      }
    )

    return {
      formData,
      focusSIV,
      focusFNI,

      // types
      TYPE_IMMATRICULATION,
      OLD_IMMATRICULATION_TYPE,
      imagePresentation: {
        id: 'image-proprietaire',
        proprietaireSVG,
      },
      enTete:{
        titre: 'Rassurez vos acheteurs potentiels',
        sousTitre: 'Partagez l\'historique de votre véhicule',
        description: 'Vous souhaitez vendre votre véhicule et rassurer le futur acheteur ? Un acheteur potentiel vous demande le rapport ? Partagez-leur l\'historique de votre véhicule.',
      },
      store: useRapportStore(),
      modale: {
        open: false,
        template: null,
      },
    }
  },

  computed: {

    // ----- Validation -----

    isNomSivValid () {
      return this.formData.siv.titulaire.particulier.nom.length > 0
    },
    isPrenomsSivValid () {
      return this.formData.siv.titulaire.particulier.prenoms.length > 0
    },
    isRaisonSocialeSivValid () {
      return this.formData.siv.titulaire.personneMorale.raisonSociale.length > 0
    },
    isNumeroSirenSivValid () {
      return (
        !this.formData.siv.titulaire.personneMorale.numeroSiren ||
        this.formData.siv.titulaire.personneMorale.numeroSiren.match(NUMERO_SIREN_REGEX)
      )
    },
    isNumeroImmatriculationSivValid () {
      return this.formData.siv.numeroImmatriculation.match(NUMERO_IMMATRICULATION_SIV_REGEX)
    },
    isNumeroFormuleSivValid () {
      return this.formData.siv.numeroFormule.match(NUMERO_FORMULE_REGEX)
    },

    isNomEtPrenomsFniValid () {
      return this.formData.fni.titulaire.particulier.nomEtPrenoms.length > 0
    },
    isRaisonSocialeFniValid () {
      return this.formData.fni.titulaire.personneMorale.raisonSociale.length > 0
    },
    isNumeroSirenFniValid () {
      return (
        !this.formData.fni.titulaire.personneMorale.numeroSiren ||
        this.formData.fni.titulaire.personneMorale.numeroSiren.match(NUMERO_SIREN_REGEX)
      )
    },
    isNumeroImmatriculationFniValid () {
      return this.formData.fni.numeroImmatriculation.match(NUMERO_IMMATRICULATION_FNI_REGEX)
    },
    isDateEmissionCertificatImmatriculationFniValid() {
      return this.formData.fni.dateEmissionCertificatImmatriculation.match(DATE_FR_REGEX)
    },

    isFormSivParticulierValid () {
      return (
        this.isNomSivValid &&
        this.isPrenomsSivValid &&
        this.isNumeroImmatriculationSivValid &&
        this.isNumeroFormuleSivValid
      )
    },
    isFormSivPersonneMoraleValid () {
      return (
        this.isRaisonSocialeSivValid &&
        this.isNumeroSirenSivValid &&
        this.isNumeroImmatriculationSivValid &&
        this.isNumeroFormuleSivValid
      )
    },
    isFormFniParticulierValid () {
      return (
        this.isNomEtPrenomsFniValid &&
        this.isNumeroImmatriculationFniValid &&
        this.isDateEmissionCertificatImmatriculationFniValid
      )
    },
    isFormFniPersonneMoraleValid () {
      return (
        this.isRaisonSocialeFniValid &&
        this.isNumeroSirenFniValid &&
        this.isNumeroImmatriculationFniValid &&
        this.isDateEmissionCertificatImmatriculationFniValid
      )
    },

    isFormValid () {
      if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
        if (this.formData.typePersonne === TYPE_PERSONNE.PARTICULIER) {
          return this.isFormSivParticulierValid
        }
        if (this.formData.typePersonne === TYPE_PERSONNE.PRO) {
          return this.isFormSivPersonneMoraleValid
        }
      }

      if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
        if (this.formData.typePersonne === TYPE_PERSONNE.PARTICULIER) {
          return this.isFormFniParticulierValid
        }
        if (this.formData.typePersonne === TYPE_PERSONNE.PRO) {
          return this.isFormFniPersonneMoraleValid
        }
      }

      return false
    },
  },

  created () {
    if (this.formData.typeImmatriculation) {
      this.formData.typeImmatriculation = TYPE_IMMATRICULATION.SIV
      this.formData.typePersonne = TYPE_PERSONNE.PARTICULIER
    }
    api.log('/search')
  },

  methods: {
    actionModale (libelleModale) {
      if (this.modale.open) {
        this.modale.open = false
        this.modale.template = null
        return
      }

      this.modale.open = true
      this.modale.template = modalesTemplates[libelleModale]
    },

    // Form
    persistFormData () {
      // Mise en cache pour :
      // - pouvoir rafraîchir la page du rapport vendeur sans repasser par le formulaire
      // - pré-remplir les entrées utilisateur sur le formulaire avec la précédente recherche validée
      // - pouvoir envoyer les entrées utilisateur lors de l'envoi d'un message via la rubrique "Contact"
      sessionStorage.setItem('formData', JSON.stringify(this.formData))
    },

    async onSubmit () {
      this.persistFormData()

      await gestionAppelApi.fetchRapportProprietaire(this.formData)

      if (this.store.getStatus === 200) {
        this.$router.push({
          name: 'rapportVendeur',
          params: {
            formData: JSON.stringify(this.formData),
          },
        })
      }
    },

    onClear () {
      this.formData = {
        typeImmatriculation: this.formData.typeImmatriculation,
        typePersonne: this.formData.typePersonne,
        siv: {
          titulaire: {
            particulier: {
              nom: '',
              prenoms: '',
            },
            personneMorale : {
              raisonSociale: '',
              numeroSiren: '',
            },
          },
          numeroImmatriculation: '',
          numeroFormule: '',
        },
        fni: {
          titulaire: {
            particulier: {
              nomEtPrenoms: '',
            },
            personneMorale: {
              raisonSociale: '',
              numeroSiren: '',
            },
          },
          numeroImmatriculation: '',
          dateEmissionCertificatImmatriculation: '',
        },
      }
      if(this.formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
        this.focusSIV = !this.focusSIV;
      }
      if(this.formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
        this.focusFNI = !this.focusFNI;
      }
    },
  },
})
</script>

<template>
  <DsfrModal
    :ref="modale.template?.ref"
    :opened="modale.open"
    :title="modale.template?.titre"
    :origin="$refs[modale.template?.origine]"
    @close="actionModale(modale.template?.ref)"
  >
    <div v-html="modale.template?.contenue" />
  </DsfrModal>
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
            text: 'Propriétaire',
          },
        ]"
      />
    </div>
    <TitrePresentationPage
      :id="imagePresentation.id"
      :src="imagePresentation.proprietaireSVG"
      :titre="enTete.titre"
      :sous-titre="enTete.sousTitre"
      :description="enTete.description"
    />
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <p class="fr-text--md">
        HistoVec permet de consulter l'historique administratif de votre véhicule enregistré dans le Système
        d'Immatriculation des Véhicules (S&#8203;I&#8203;V&#8203;).
      </p>
      <p class="fr-text--md">
        Pour toute demande de renseignements sur votre dossier ou de correction des informations,
        adressez-vous à l'Agence Nationale Des Titres Sécurisés (A&#8203;N&#8203;T&#8203;S) en suivant la procédure indiquée sur cette page :
        <a
          class="fr-link"
          href="https://immatriculation.ants.gouv.fr/demarches-en-ligne"
          rel="noopener noreferrer"
          target="_blank"
        >https://immatriculation.ants.gouv.fr/demarches-en-ligne</a>.
      </p>
    </div>
  </div>

  <SelectionnerFormatImmatriculation
    :form-data="formData"
    :focus-s-i-v="focusSIV"
    :focus-f-n-i="focusFNI"
  />

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-2w">
    <div
      v-if="formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV"
      class="fr-col-12"
    >
      <FormulaireSIV
        :form-data="formData"
        :action-modale="actionModale"
      />
    </div>
    <div
      v-if="formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI"
      class="fr-col-12"
    >
      <FormulaireFNI
        :form-data="formData"
        :action-modale="actionModale"
      />
    </div>
  </div>
  <div
    v-if="formData.typeImmatriculation === OLD_IMMATRICULATION_TYPE"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w"
  >
    <div class="fr-col-12  fr-col-lg-8  fr-col-xl-8">
      <DsfrAlert
        type="info"
        role="alert"
        title="Historique indisponible à ce jour"
        description="
          L'historique de ce véhicule n'est pas disponible sur HistoVec à ce jour.
          Nous vous invitons à télécharger le Certificat de Situation Administrative détaille (C&#8203;S&#8203;A) sur le site de l'A&#8203;N&#8203;T&#8203;S.
        "
      />
    </div>
  </div>
  <div
    v-if="formData.typeImmatriculation === OLD_IMMATRICULATION_TYPE"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w"
  >
    <div class="fr-col-12  fr-col-lg-3  fr-col-xl-3  text-center">
      <HistoVecButtonLink
        label="Obtenir le C&#8203;S&#8203;A via l'A&#8203;N&#8203;T&#8203;S"
        to="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
      />
    </div>
  </div>

  <div
    v-if="formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI || formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w"
  >
    <div
      class="fr-col-6  fr-col-lg-3  fr-col-xl-3 bouton-recherche"
    >
      <DsfrButton
        id="bouton-recherche"
        label="Rechercher"
        icon="ri-search-line"
        :disabled="!isFormValid || store.getChargement"
        @click="onSubmit"
      />
    </div>
    <div
      class="fr-col-6  fr-col-lg-3  fr-col-xl-3"
    >
      <DsfrButton
        id="bouton-effacer"
        label="Effacer"
        icon="ri-close-line"
        secondary
        :disabled="store.getChargement"
        @click="onClear"
      />
    </div>
  </div>
</template>
<style scoped>

.text-center {
  text-align: center;
}
.bouton-recherche {
  text-align: right;
}
</style>
