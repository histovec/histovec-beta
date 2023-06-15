<script>
import {defineComponent} from 'vue'
import { formatIsoToFrDate } from '@Assets/js/format'
import { useRapportStore } from '@Stores/rapport'

import operationsMapping from '@Assets/json/operations.json'

export default defineComponent({
  name: 'OngletHistorique',

  data () {
    return {
      formatIsoToFrDate,

      operationsMapping,
      store: useRapportStore(),
      historique: [],
      vehiculeImport: {},
      datePremiereImmatriculationEtr: '',

    }
  },
  computed: {
    historiqueData () {
      const rapport = this.store.getRapport
      if (rapport) {
        return rapport.vehicule.historique || []
      }
      return this.historique
    },

    vehiculeImporte () {
      const rapport = this.store.getRapport
      if (rapport) {
        return rapport.vehicule.infosImport.isImported
      }
      return this.vehiculeImport
    },

    datePremiereImmatriculationEtranger () {
      const rapport = this.store.getRapport
      if(rapport) {
        return formatIsoToFrDate(rapport.vehicule.infosImport.datePremiereImmatEtranger)
      }
      return this.datePremiereImmatriculationEtr
    },
  },
})
</script>


<template>
  <div
    class="fr-grid-row  fr-grid-row--gutters"
  >
    <template v-if="vehiculeImporte">
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
        {{ datePremiereImmatriculationEtranger }}
      </div>
      <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pb-4w  fr-pt-0  fr-text--bleu">
        <!-- @todo:
          Il serait plus sûr de créer un enum HISTORIQUE_OPERATION_TYPE pour l'utiliser ici
          et dans le fichier assets/js/operations.json afin de tokenizer les opérations et réduire les erreurs liées à une typo
          Pas urgent : en pratique, on ne se sert que très peu de ces HISTORIQUE_OPERATION_TYPE (appelé opa_type dans le SIV)
        -->
        {{ operationsMapping['IMMAT_NORMALE_PREM_ETRANGER'] }}
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
      v-for="(entry, index) in historiqueData"
      :key="index"
    >
      <div class="fr-col-12  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-pt-0">
        <span class="txt-small-12">{{ formatIsoToFrDate(entry.date) }}</span>
      </div>
      <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pb-2w  fr-pt-0  fr-text--bleu">
        <span class="info_red txt-small-12">
          <!-- @todo: a deplacer soit dans le back soit dans l'api data          -->
          {{ operationsMapping[entry.type] }}
        </span>
      </div>
    </template>
  </div>
</template>
