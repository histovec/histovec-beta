<script>
import { defineComponent } from 'vue'

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
      v-if="titulaires?.particulier?.nomNaissance || titulaires?.particulier?.prenom"
      id="valeur-identite"
      class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu"
    >
      {{ titulaires?.particulier?.nomNaissance }} {{ titulaires?.particulier?.prenom }}
    </div>
    <div
      v-else
      id="valeur-identite"
      class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu"
    >
      {{ titulaires?.personneMorale?.raisonSociale }}
    </div>

    <div
      v-if="titulaires?.codePostal"
      id="titre-code-postal"
      class="fr-col-6  fr-pt-0  fr-pb-0"
    >
      Code postal
    </div>
    <div
      v-if="titulaires?.codePostal"
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
      {{ infosImport?.datePremiereImmatEtranger }}
    </div>
    <div
      v-if="!infosImport.isImported"
      id="valeur-date-immatriculation"
      class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu"
    >
      {{ infos?.datePremiereImmatriculation }}
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
        {{ infosImport?.dateImportFrance }}
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
      {{ certificatImmatriculation?.dateEmission }}
    </div>
  </div>
</template>
