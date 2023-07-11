<script>
import {defineComponent} from 'vue';
import CorrigerInformationsInexactes from './reponseAccordeon/CorrigerInformationsInexactes.vue';

export default defineComponent({
  components :{
    CorrigerInformationsInexactes,
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
        title="Comment corriger une information manquante ou inexacte sur les données de mon véhicule ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <CorrigerInformationsInexactes />
      </DsfrAccordion>
    </li>
  </DsfrAccordionsGroup>
</template>
