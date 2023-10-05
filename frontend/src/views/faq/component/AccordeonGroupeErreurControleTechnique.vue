<script>
import {defineComponent} from 'vue';
import ControleTechniqueAbsent from './reponseAccordeon/ControleTechniqueAbsent.vue';
import KilometrageIncoherent from './reponseAccordeon/KilometrageIncoherent.vue';

export default defineComponent({
  components :{
    ControleTechniqueAbsent,
    KilometrageIncoherent,

  },
  data () {
    return {
      expandedId: undefined,
    }
  },
})
</script>
<template>
  <DsfrAccordionsGroup>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Que faire si le kilométrage ou le contrôle technique de mon véhicule ne figurent pas sur HistoVec ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <ControleTechniqueAbsent />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Que faire si le kilométrage de mon véhicule présente une incohérence ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <KilometrageIncoherent />
      </DsfrAccordion>
    </li>
  </DsfrAccordionsGroup>
</template>
