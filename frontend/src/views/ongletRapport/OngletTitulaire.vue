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
      <h6 class="fr-mb-0">
        Titulaire & Titre
      </h6>
    </div>

    <template v-if="titulaire.nature">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Nature
      </div>
      <div class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ titulaire.nature }}
      </div>
    </template>

    <div class="fr-col-6  fr-pt-0  fr-pb-1w">
      Identité
    </div>
    <div class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ titulaire.identite }}
    </div>

    <div class="fr-col-6  fr-pt-0  fr-pb-0">
      Code postal
    </div>
    <div class="fr-col-6  fr-pt-0  fr-pb-0  fr-text--bleu">
      {{ titulaire.adresse }}
    </div>

    <div class="fr-col-12  fr-pt-3w  fr-pb-2w">
      <h6 class="fr-mb-0">
        Certificat d'immatriculation
      </h6>
    </div>

    <div class="fr-col-6  fr-pt-0  fr-pb-1w">
      Date de première immatriculation
      <span v-if="certificat.isVehiculeImporteDepuisEtranger">
                à l'étranger
              </span>
    </div>
    <div class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
      {{ datePremiereImmatriculationFR }}
    </div>

    <template v-if="certificat.isVehiculeImporteDepuisEtranger">
      <div class="fr-col-6  fr-pt-0  fr-pb-1w">
        Date de première immatriculation en France
      </div>
      <div class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
        {{ datePremiereImmatriculationEnFranceFR }}
      </div>
    </template>

    <div class="fr-col-6  fr-pt-0  fr-pb-0">
      Date du certificat d'immatriculation actuel
    </div>
    <div class="fr-col-6  fr-pt-0  fr-pb-0  fr-text--bleu">
      {{ dateEmissionCIFR }}
    </div>
  </div>
</template>
