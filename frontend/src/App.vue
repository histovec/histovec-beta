<script>
import { defineComponent } from 'vue'

import HistoVecHeader from '@/components/HistoVecHeader.vue'
import HistoVecFooter from '@/components/HistoVecFooter.vue'

import { v4 as uuidv4 } from 'uuid'


// Ajout d'un id anonyme pour un usage statistique
if (localStorage.getItem('userId') === null) {
  const uuid = uuidv4()
  localStorage.setItem('userId', uuid, 1)
}

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
  <div class="fr-container  fr-mb-6w">
    <router-view />
  </div>
  <HistoVecFooter />
  <!-- </div> -->
</template>
