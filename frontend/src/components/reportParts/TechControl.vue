<template>
  <div>
    <div
      v-if="erreurControlesTechniques"
      class="alert alert-icon alert-danger"
      role="alert"
    >
      <i class="fa fa-warning">
      </i>
      {{ erreurControlesTechniques }}
    </div>
    <div v-if="!erreurControlesTechniques && normalizedControlesTechniques.length > 0">
      <div class="row">
        <div class="col-sm-2">
          <span class="txt-small-12"><h6>Date</h6></span>
        </div>
        <div class="col-sm-4">
          <span class="bold txt-small-12"><h6>Nature</h6></span>
        </div>
        <div class="col-sm-4">
          <span class="bold txt-small-12"><h6>Résultat</h6></span>
        </div>
        <div class="col-sm-2">
          <span class="bold txt-small-12"><h6>Kilométrage</h6></span>
        </div>
      </div>
      <div class="separator"></div>

      <div
        v-for="(entry, index) in normalizedControlesTechniques"
        :key="index"
      >
        <div class="row">
          <div class="col-sm-2">
            <span class="txt-small-12">{{ entry.date }}</span>
          </div>
          <div class="col-sm-4">
            <i
              :class="entry.natureIcon"
              :title="entry.nature"
              aria-hidden="true"
            ></i> <span class="info_red txt-small-12">{{ entry.natureLibelle }}</span>
          </div>
          <div class="col-sm-4">
            <i
              :class="entry.resultatIcon"
              :title="entry.resultat"
              aria-hidden="true"
            ></i> <span class="info_red txt-small-12">{{ entry.resultatLibelle }}</span>
          </div>
          <div class="col-sm-2">
            <span class="info_red txt-small-12">{{ entry.kmLibelle }} km</span>
          </div>
        </div>
        <div class="separator pv-5"></div>
      </div>
    <!-- fin tableau operation historique FR -->
    </div>
  </div>
</template>

<script>

import orderBy from 'lodash.orderby'

import { formatIsoToFrDate } from '@/assets/js/format.js'

export default {
  props: {
    controlesTechniques: {
      type: Array,
      default: () => []
    },
    erreurControlesTechniques: {
      type: String,
      default: ''
    }
  },
  computed: {
    normalizedControlesTechniques () {
      if (this.controlesTechniques && this.controlesTechniques.length > 0) {
        const orderedControlesTechniques = orderBy(this.controlesTechniques, ['date'], ['desc'])

        return orderedControlesTechniques.map((controleTechnique) => {
          return {
            ...controleTechnique,
            date: formatIsoToFrDate(controleTechnique.date),
          }
        })
      }
      return []
    },
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/technical-control`)
  },
}

</script>
