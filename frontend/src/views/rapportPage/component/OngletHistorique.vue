<script>
import {defineComponent} from 'vue'

import operationsMapping from '@Assets/json/operations.json'

export default defineComponent({
  name: 'OngletHistorique',
  props:{
    historiqueData: {
      type: Array,
      default: new Array([]),
    },
    vehiculeImporte: {
      type: Boolean,
      default: false,
    },
    datePremiereImmatriculationEtranger: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      operationsMapping,
    }
  },

})
</script>


<template>
  <div
    class="fr-grid-row fr-grid-row--gutters"
  >
    <template v-if="vehiculeImporte">
      <div class="fr-col-12 fr-pb-3w">
        <h3 class="fr-mb-0 fr-h5">
          Historique des opérations à l'étranger
        </h3>
      </div>
      <div class="fr-col-2 fr-pb-2w fr-pt-0">
        <h4 class="fr-mb-0 fr-h6">
          Date
        </h4>
      </div>
      <div class="fr-col-10 fr-pb-2w fr-pt-0">
        <h4 class="fr-mb-0 fr-h6">
          Opération
        </h4>
      </div>
      <div class="fr-col-12 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pb-0 fr-pt-0">
        {{ datePremiereImmatriculationEtranger }}
      </div>
      <div class="fr-col-12 fr-col-md-10 fr-col-lg-10 fr-col-xl-10 fr-pb-4w fr-pt-0 fr-text--bleu">
        Première immatriculation à l'étranger
      </div>
    </template>

    <div class="fr-col-12 fr-pb-3w">
      <h3 class="fr-mb-0 fr-h5">
        Historique des opérations en France
      </h3>
    </div>
    <div class="fr-col-2 fr-pb-2w fr-pt-0">
      <h4 class="fr-mb-0 fr-h6">
        Date
      </h4>
    </div>
    <div class="fr-col-10 fr-pb-2w fr-pt-0">
      <h4 class="fr-mb-0 fr-h6">
        Opération
      </h4>
    </div>

    <template
      v-for="(entry, index) in historiqueData"
      :key="index"
    >
      <div class="fr-col-12 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pb-0 fr-pt-0">
        <span class="txt-small-12">{{ entry.date }}</span>
      </div>
      <div class="fr-col-12 fr-col-md-10 fr-col-lg-10 fr-col-xl-10 fr-pb-2w fr-pt-0 fr-text--bleu">
        <span class="info_red txt-small-12">
          <!-- @todo: a deplacer soit dans le back soit dans l'api data          -->
          {{ entry.type }}
        </span>
      </div>
    </template>
  </div>
</template>
