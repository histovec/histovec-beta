<script>
import {defineComponent} from 'vue'
import { RESULTAT } from '@/constants/controlesTechniques.js'

export default defineComponent({
  name: 'OngletControlesTechniques',

  props: {
    erreurControlesTechniques: {
      type: String,
      default: '',
    },
    normalizedControlesTechniquesHistorique: {
      type: Object,
    },
  },
  methods: {
    getDsfrBadgeType (resultatControleTechnique) {
      if (resultatControleTechnique === RESULTAT.A || resultatControleTechnique === RESULTAT.AP) {
        return 'success'
      }
      if (resultatControleTechnique === RESULTAT.S || resultatControleTechnique === RESULTAT.SP) {
        return 'warning'
      }
      if (resultatControleTechnique === RESULTAT.R || resultatControleTechnique === RESULTAT.RP) {
        return 'error'
      }
      // RESULTAT.X or undefined => undefined (Grey color for DsfrBadge)
    },
  },
})
</script>


<template>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div
      v-if="erreurControlesTechniques"
      class="fr-col-12"
    >
      <DsfrAlert
        type="error"
        title="Erreur lors de la récupération des contrôles techniques"
        :description="erreurControlesTechniques"
      />
    </div>
    <template v-if="!erreurControlesTechniques">
      <template v-if="normalizedControlesTechniquesHistorique.length > 0">
        <div class="fr-col-2  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0">
          <h6 class="fr-mb-0">
            Date
          </h6>
        </div>
        <div class="fr-col-3  fr-col-md-6  fr-col-lg-5  fr-col-xl-5  fr-pb-0">
          <h6 class="fr-mb-0">
            Nature
          </h6>
        </div>
        <div class="fr-col-3  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0">
          <h6 class="fr-mb-0">
            Résultat
          </h6>
        </div>
        <div class="fr-col-2  fr-col-md-2  fr-col-lg-3  fr-col-xl-3  fr-pb-3w">
          <h6 class="fr-mb-0">
            Kilométrage
          </h6>
        </div>
        <template
          v-for="(entry, index) in normalizedControlesTechniquesHistorique"
          :key="index"
        >
          <div class="fr-col-12  fr-col-sm-2  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-text--bleu">
            {{ entry.date }}
          </div>
          <div class="fr-col-12  fr-col-sm-6  fr-col-md-6  fr-col-lg-5  fr-col-xl-5  fr-pb-0  fr-text--bleu">
            {{ entry.natureLibelle }}
          </div>
          <div class="fr-col-4  fr-col-sm-2  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-text--bleu">
            <DsfrBadge
              :label="entry.resultatLibelle"
              :type="getDsfrBadgeType(entry.resultat)"
              :no-icon="true"
            />
          </div>
          <div class="fr-col-8  fr-col-sm-2  fr-col-md-2  fr-col-lg-3  fr-col-xl-3  fr-pb-2w  fr-text--bleu">
            {{ entry.kmLibelle }} km
          </div>
        </template>
      </template>
      <div
        v-if="normalizedControlesTechniquesHistorique === 0"
        class="fr-col-12"
      >
        Ce véhicule ne possède actuellement aucun contrôle technique.
      </div>
    </template>
  </div>
</template>
