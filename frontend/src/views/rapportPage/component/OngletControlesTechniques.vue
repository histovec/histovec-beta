<script>
import {defineComponent} from 'vue'
import { RESULTAT } from '@/constants/controlesTechniques.js'
import { normalizedControlesTechniquesHistorique } from '@Utils/controlesTechniquesComposant'

export default defineComponent({
  name: 'OngletControlesTechniques',
  props:{
    controlesTechniquesHistorique: {
      type: Array,
      default: new Array([]),
    },
  },
  data () {
    return {
      normalizedControlesTechniquesHistorique,
    }
  },
  computed: {
    erreurControlesTechniques () {
      return false
      // return 'Un problème est survenu lors de la récupération des contrôles techniques. Veuillez réessayer plus tard.'
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
        role="alert"
        title="Erreur lors de la récupération des contrôles techniques"
        :description="erreurControlesTechniques"
      />
    </div>
    <template v-if="!erreurControlesTechniques">
      <template v-if="normalizedControlesTechniquesHistorique(controlesTechniquesHistorique).length > 0">
        <div class="fr-col-6 fr-col-sm-2 fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0">
          <h3 class="fr-mb-0 fr-h5">
            Date
          </h3>
        </div>
        <div class="fr-col-6 fr-col-sm-4 fr-col-md-4  fr-col-lg-4  fr-col-xl-4  fr-pb-0">
          <h3 class="fr-mb-0 fr-h5">
            Nature
          </h3>
        </div>
        <div class="fr-col-6 fr-col-sm-3 fr-col-md-3  fr-col-lg-3  fr-col-xl-3  fr-pb-0">
          <h3 class="fr-mb-0 fr-h5">
            Résultat
          </h3>
        </div>
        <div class="fr-col-6 fr-col-sm-3 fr-col-md-3  fr-col-lg-3  fr-col-xl-3  fr-pb-3w">
          <h3 class="fr-mb-0 fr-h5">
            Kilométrage
          </h3>
        </div>
        <template
          v-for="(entry, index) in normalizedControlesTechniquesHistorique(controlesTechniquesHistorique)"
          :key="index"
        >
          <div class="fr-col-6 fr-col-sm-2 fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-text--bleu">
            {{ entry.date }}
          </div>
          <div class="fr-col-6 fr-col-sm-4 fr-col-md-4  fr-col-lg-4  fr-col-xl-4  fr-pb-0  fr-text--bleu">
            {{ entry.nature }}
          </div>
          <div class="fr-col-6 fr-col-sm-3 fr-col-md-3  fr-col-lg-3  fr-col-xl-3  fr-text--bleu">
            <DsfrBadge
              :label="entry.resultat"
              :type="getDsfrBadgeType(entry.resultat)"
              :no-icon="true"
            />
          </div>
          <div class="fr-col-6 fr-col-sm-3 fr-col-md-3  fr-col-lg-3  fr-col-xl-3  fr-pb-2w  fr-text--bleu">
            {{ entry.km }} km
          </div>
        </template>
      </template>
      <div
        v-if="normalizedControlesTechniquesHistorique(controlesTechniquesHistorique) === []"
        class="fr-col-12"
      >
        Ce véhicule ne possède actuellement aucun contrôle technique.
      </div>
    </template>
  </div>
</template>
