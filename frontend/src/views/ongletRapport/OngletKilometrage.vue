<script>
import {defineComponent} from 'vue'
import ControlesTechniquesLineChart from '@/components/ControlesTechniquesLineChart.vue'
export default defineComponent({
  name: 'OngletKilometrage',
  components: {
    ControlesTechniquesLineChart,
  },
  props: {
    erreurControlesTechniques: {
      type: String,
      default: '',
    },
    controlesTechniquesHistorique: {
      type: Object,
      default: null,
    },
    controlesTechniquesHistoriqueAriaLabel: {
      type: String,
      default: '',
    },
  },
})
</script>


<template>
  <div
    class="fr-grid-row  fr-grid-row--gutters"
  >
    <div
      v-if="erreurControlesTechniques"
      class="fr-col-12"
    >
      <DsfrAlert
        type="error"
        role="alert"
        title="Erreur lors de la récupération des contrôles techniques"
        :description="erreurControlesTechniques"
      />
    </div>
    <template
      v-if="!erreurControlesTechniques"
    >
      <controles-techniques-line-chart
        v-if="controlesTechniquesHistorique.length > 0"
        class="fr-col-12"
        :controles-techniques="controlesTechniquesHistorique"
        :aria-label="controlesTechniquesHistoriqueAriaLabel"
      />
      <div
        v-if="controlesTechniquesHistorique === 0"
        class="fr-col-12"
      >
        Ce véhicule ne possède actuellement aucun contrôle technique.
      </div>
    </template>
  </div>
</template>
