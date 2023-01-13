<script>
import { defineComponent } from 'vue'

import HistoVecHeader from '@/components/HistoVecHeader.vue'
import HistoVecFooter from '@/components/HistoVecFooter.vue'
import LienEvitement from '@/components/LienEvitement.vue'

import { v4 as uuidv4 } from 'uuid'


// Ajout d'un id anonyme pour un usage statistique
if (localStorage.getItem('userId') === null) {
  const uuid = uuidv4()
  localStorage.setItem('userId', uuid, 1)
}

export default defineComponent({
  name: 'App',
  components: {LienEvitement, HistoVecHeader, HistoVecFooter },
})
</script>


<template>
  <!--
    @todo @shortCutConfig2:
    Réimplémenter le mécanisme de raccourci clavier pour activer/désactiver des feature flags
    Voici l'ancienne implémentation avec Vuex :
    (Utiliser le SessionStorage serait probablement plus sage que d'utiliser Pinia, le successeur de Vuex)
    <div
      v-for="(entry, index) in $store.state.configEnabler"
      :key="index"
    >
      <span
        v-shortkey="$store.state.configEnabler[index]"
        @shortkey="$store.commit('toggleConfig', index)"
      >
      </span> -->
  <LienEvitement />
  <HistoVecHeader />
  <main
    id="contenu"
    role="main"
    class="fr-container fr-mb-6w"
  >
    <router-view />
  </main>
  <HistoVecFooter />
  <!-- </div> -->
</template>
