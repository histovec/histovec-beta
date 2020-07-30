<template>
  <div>
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
      v-for="(entry, index) in controlesTechniques"
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
          ></i> <span class="info_red txt-small-12">{{ entry.natureLabel }}</span>
        </div>
        <div class="col-sm-4">
          <i
            :class="entry.resultatIcon"
            :title="entry.resultat"
            aria-hidden="true"
          ></i> <span class="info_red txt-small-12">{{ entry.resultatLabel }}</span>
        </div>
        <div class="col-sm-2">
          <span class="info_red txt-small-12">{{ entry.kmLabel }} km</span>
        </div>
      </div>
      <div class="separator pv-5"></div>
    </div>
    <!-- fin tableau operation historique FR -->
  </div>
</template>

<script>


import orderBy from 'lodash.orderby'


export default {
  props: {
    ct: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    controlesTechniques () {
      if (this.ct.length > 0) {
        return orderBy(this.ct, ['id'], ['desc'])
      } else {
        return []
      }
    },
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/technical-control`)
  },
}

</script>
