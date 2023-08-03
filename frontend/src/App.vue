<script>
import { defineComponent } from 'vue'

import HistoVecHeader from '@Components/HistoVecHeader.vue'
import HistoVecFooter from '@Components/HistoVecFooter.vue'
import '@/assets/stylesheets/globale.css'
import LienEvitement from '@Components/LienEvitement.vue'

import { v4 as uuidv4 } from 'uuid'

import '@gouvfr/dsfr/dist/core/core.main.min.css'            // Le CSS minimal du DSFR
import '@gouvfr/dsfr/dist/component/component.main.min.css'  // Styles de tous les composants
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'      // Classes utilitaires: les composants de VueDsfr en ont besoin
import '@gouvminint/vue-dsfr/styles'                         // Les styles propres aux composants de VueDsfr

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
