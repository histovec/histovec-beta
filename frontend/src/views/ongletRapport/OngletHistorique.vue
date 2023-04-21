<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'OngletHistorique',

  props: {
    assets: {
      type: Object,
    },
    certificat: {
      type: Object,
    },
    datePremiereImmatriculationFR: {
      type: String,
      Default: '',
    },
    processedVehiculeData: {
      type: Object,
    },
  },
})
</script>


<template>
  <div
    class="fr-grid-row  fr-grid-row--gutters"
  >
    <template v-if="certificat.isVehiculeImporteDepuisEtranger">
      <div class="fr-col-12  fr-pb-3w">
        <h3 class="fr-mb-0 fr-h5">
          Historique des opérations à l'étranger
        </h3>
      </div>
      <div class="fr-col-2  fr-pb-2w  fr-pt-0">
        <h4 class="fr-mb-0 fr-h6">
          Date
        </h4>
      </div>
      <div class="fr-col-10  fr-pb-2w  fr-pt-0">
        <h4 class="fr-mb-0 fr-h6">
          Opération
        </h4>
      </div>
      <div class="fr-col-12  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-pt-0">
        {{ datePremiereImmatriculationFR }}
      </div>
      <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pb-4w  fr-pt-0  fr-text--bleu">
        <!-- @todo:
          Il serait plus sûr de créer un enum HISTORIQUE_OPERATION_TYPE pour l'utiliser ici
          et dans le fichier assets/js/operations.json afin de tokenizer les opérations et réduire les erreurs liées à une typo
          Pas urgent : en pratique, on ne se sert que très peu de ces HISTORIQUE_OPERATION_TYPE (appelé opa_type dans le SIV)
        -->
        {{ assets.operationsMapping['IMMAT_NORMALE_PREM_ETRANGER'] }}
      </div>
    </template>

    <div class="fr-col-12  fr-pb-3w">
      <h3 class="fr-mb-0 fr-h5">
        Historique des opérations en France
      </h3>
    </div>
    <div class="fr-col-2  fr-pb-2w  fr-pt-0">
      <h4 class="fr-mb-0 fr-h6">
        Date
      </h4>
    </div>
    <div class="fr-col-10  fr-pb-2w  fr-pt-0">
      <h4 class="fr-mb-0 fr-h6">
        Opération
      </h4>
    </div>

    <template
      v-for="(entry, index) in processedVehiculeData.historique"
      :key="index"
    >
      <div class="fr-col-12  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-pt-0">
        <span class="txt-small-12">{{ entry.date }}</span>
      </div>
      <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pb-2w  fr-pt-0  fr-text--bleu">
                <span class="info_red txt-small-12">
                  {{ entry.nature }}
                </span>
      </div>
    </template>
  </div>
</template>
