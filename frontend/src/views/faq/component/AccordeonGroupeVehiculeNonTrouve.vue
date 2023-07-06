<script>
import {defineComponent} from 'vue';
import RechercheKo from './reponseAccordeon/RechercheKo.vue';
import RechercheNAboutitPas from './reponseAccordeon/RechercheNAboutitPas.vue';
import LienNeFonctionnePas from './reponseAccordeon/LienNeFonctionnePas.vue';
import NouveauCertificatNonTrouve from './reponseAccordeon/NouveauCertificatNonTrouve.vue';
import TousVehiculesPresentsHistovec from './reponseAccordeon/TousVehiculesPresentsHistovec.vue';
import RechercheVehiculeLocation from './reponseAccordeon/RechercheVehiculeLocation.vue';

export default defineComponent({
  components :{
    RechercheKo,
    RechercheNAboutitPas,
    LienNeFonctionnePas,
    NouveauCertificatNonTrouve,
    TousVehiculesPresentsHistovec,
    RechercheVehiculeLocation,
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
        title="Que faire si je ne parviens pas à lancer la recherche de mon véhicule ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <RechercheKo />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Que faire si la recherche de mon véhicule n’aboutit pas ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <RechercheNAboutitPas />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Je viens de recevoir mon certificat d’immatriculation mais je ne trouve pas mon véhicule sur HistoVec"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <NouveauCertificatNonTrouve />
      </DsfrAccordion>
    </li>
    <li>
      <!-- @todo @doublonFaq1 Voir avec la DSR lequel on souhaite garder -->
      <DsfrAccordion
        class="background-accordeon-white"
        title="Comment effectuer la recherche sur HistoVec pour un véhicule en location longue durée (LLD) ou en location avec option d’achat (LOA ou leasing) ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <RechercheVehiculeLocation />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Tous les véhicules figurent-ils sur HistoVec ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <TousVehiculesPresentsHistovec />
      </DsfrAccordion>
    </li>
    <li>
      <!-- @todo @doublonFaq3 Voir avec la DSR lequel on souhaite garder -->
      <DsfrAccordion
        class="background-accordeon-white"
        title="Que faire si le lien du rapport HistoVec que l’on m’a envoyé ne fonctionne pas ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <LienNeFonctionnePas />
      </DsfrAccordion>
    </li>
  </DsfrAccordionsGroup>
</template>
