<script>
import { defineComponent } from 'vue'

import HistoVecHeader from '@/components/HistoVecHeader.vue'
import HistoVecFooter from '@/components/HistoVecFooter.vue'


export default defineComponent({
  name: 'App',
  components: { HistoVecHeader, HistoVecFooter },
})
</script>


<template>
  <!-- @todo reimplement shortcut config
    <div
      v-for="(entry, index) in $store.state.configEnabler"
      :key="index"
    >
      <span
        v-shortkey="$store.state.configEnabler[index]"
        @shortkey="$store.commit('toggleConfig', index)"
      >
      </span> -->
  <HistoVecHeader />
  <div
    class="fr-container"
    style="margin-bottom: 5rem"
  >
    <router-view />
  </div>
  <HistoVecFooter />
  <!-- </div> -->
</template>
