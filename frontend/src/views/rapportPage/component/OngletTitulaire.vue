<script>
import { defineComponent } from 'vue'
import { formatIsoToFrDate } from '@Assets/js/format'

export default defineComponent({
  name: 'OngletTitulaire',
  props:{
    titulaires: {
      type: Object,
      default: null,
    },
    infosImport: {
      type: Object,
      default: null,
    },
    infos: {
      type: Object,
      default: null,
    },
    certificatImmatriculation: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      formatIsoToFrDate,
    }
  },
})
</script>


<template>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12  fr-pb-2w">
      <h3 class="fr-mb-0 fr-h5">
        Titulaire et Titre
      </h3>
    </div>

    <div
      id="titre-identite"
      class="fr-col-6  fr-pt-0  fr-pb-1w"
    >
      Identité
    </div>
    <div
      id="valeur-identite"
      class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu"
    >
      {{ titulaires?.particulier?.nomNaissance }} {{ titulaires?.particulier?.prenom }}
    </div>

    <div
      id="titre-code-postal"
      class="fr-col-6  fr-pt-0  fr-pb-0"
    >
      Code postal
    </div>
    <div
      id="valeur-code-postal"
      class="fr-col-6  fr-pt-0  fr-pb-0  fr-text--bleu"
    >
      {{ titulaires?.codePostal }}
    </div>

    <div class="fr-col-12  fr-pt-3w  fr-pb-2w">
      <h3 class="fr-mb-0 fr-h5">
        Certificat d'immatriculation
      </h3>
    </div>

    <div
      id="titre-date-immatriculation"
      class="fr-col-6  fr-pt-0  fr-pb-1w"
    >
      Date de première immatriculation
      <span v-if="infosImport.isImported">
        à l'étranger
      </span>
    </div>
    <div
      v-if="infosImport.isImported"
      id="valeur-date-immatriculation-etranger"
      class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu"
    >
      {{ formatIsoToFrDate(infosImport?.datePremiereImmatEtranger) }}
    </div>
    <div
      v-if="!infosImport.isImported"
      id="valeur-date-immatriculation"
      class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu"
    >
      {{ formatIsoToFrDate(infos?.datePremiereImmatriculation) }}
    </div>

    <template v-if="infosImport.isImported">
      <div
        id="titre-date-immatriculation-france"
        class="fr-col-6  fr-pt-0  fr-pb-1w"
      >
        Date de première immatriculation en France
      </div>
      <div
        id="valeur-date-immatriculation-france"
        class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu"
      >
        {{ formatIsoToFrDate(infosImport?.dateImportFrance) }}
      </div>
    </template>

    <div
      id="titre-date-certificat"
      class="fr-col-6  fr-pt-0  fr-pb-0"
    >
      Date du certificat d'immatriculation actuel
    </div>
    <div
      id="valeur-date-certificat"
      class="fr-col-6  fr-pt-0  fr-pb-0  fr-text--bleu"
    >
      {{ formatIsoToFrDate(certificatImmatriculation?.dateEmission) }}
    </div>
  </div>
</template>
