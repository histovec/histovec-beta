<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'OngletTitulaire',

  props: {
    titulaire: {
      type: Object,
    },
    certificat: {
      type: Object,
    },
    datePremiereImmatriculationFR: {
      type: String,
      Default: '',
    },
    datePremiereImmatriculationEnFranceFR: {
      type: String,
      Default: '',
    },
    dateEmissionCIFR: {
      type: String,
      Default: '',
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

    <template v-if="titulaire.nature">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Nature
      </div>
      <div class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ titulaire.nature }}
      </div>
    </template>

    <div id="titre-identite" class="fr-col-6  fr-pt-0  fr-pb-1w">
      Identité
    </div>
    <div id="valeur-identite" class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ titulaire.identite }}
    </div>

    <div id="titre-code-postal" class="fr-col-6  fr-pt-0  fr-pb-0">
      Code postal
    </div>
    <div id="valeur-code-postal" class="fr-col-6  fr-pt-0  fr-pb-0  fr-text--bleu">
      {{ titulaire.adresse }}
    </div>

    <div class="fr-col-12  fr-pt-3w  fr-pb-2w">
      <h3 class="fr-mb-0 fr-h5">
        Certificat d'immatriculation
      </h3>
    </div>

    <div id="titre-date-immatriculation" class="fr-col-6  fr-pt-0  fr-pb-1w">
      Date de première immatriculation
      <span v-if="certificat.isVehiculeImporteDepuisEtranger">
        à l'étranger
      </span>
    </div>
    <div id="valeur-date-immatriculation" class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ datePremiereImmatriculationFR }}
    </div>

    <template v-if="certificat.isVehiculeImporteDepuisEtranger">
      <div id="titre-date-immatriculation-france" class="fr-col-6  fr-pt-0  fr-pb-1w">
        Date de première immatriculation en France
      </div>
      <div id="valeur-date-immatriculation-france" class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ datePremiereImmatriculationEnFranceFR }}
      </div>
    </template>

    <div id="titre-date-certificat" class="fr-col-6  fr-pt-0  fr-pb-0">
      Date du certificat d'immatriculation actuel
    </div>
    <div id="valeur-date-certificat" class="fr-col-6  fr-pt-0  fr-pb-0  fr-text--bleu">
      {{ dateEmissionCIFR }}
    </div>
  </div>
</template>
