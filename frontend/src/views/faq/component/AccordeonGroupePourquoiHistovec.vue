<script>
import {defineComponent} from 'vue';
import VenteVehicule from './reponseAccordeon/VenteVehicule.vue';
import LocationParticulier from './reponseAccordeon/LocationParticulier.vue';
import VendeurProfessionnel from './reponseAccordeon/VendeurProfessionnel.vue';
import AchatVehicule from './reponseAccordeon/AchatVehicule.vue';

export default defineComponent({
  components :{
    VenteVehicule,
    LocationParticulier,
    VendeurProfessionnel,
    AchatVehicule,
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
        title="Je vends mon véhicule d’occasion"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <VenteVehicule />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="J’achète un véhicule d’occasion"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <AchatVehicule />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Je suis un professionnel négociant automobile"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <VendeurProfessionnel />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Je loue ma voiture à des particuliers"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <LocationParticulier />
      </DsfrAccordion>
    </li>
  </DsfrAccordionsGroup>
</template>
