<script>
import {defineComponent} from 'vue';
import SignificationTermesHistorique from './reponseAccordeon/SignificationTermesHistorique.vue';
import QuelsSinistres from './reponseAccordeon/QuelsSinistres.vue';
import DifferenceProprietaireTitulaire from './reponseAccordeon/DifferenceProprietaireTitulaire.vue';
import RecupererRapportExpert from './reponseAccordeon/RecupererRapportExpert.vue';
import OppositionTranfertCertificat from './reponseAccordeon/OppositionTranfertCertificat.vue';
import VehiculeGage from './reponseAccordeon/VehiculeGage.vue';
import DeclarationValantSaisie from './reponseAccordeon/DeclarationValantSaisie.vue';
import AmendeVehiculePlusProprietaire from './reponseAccordeon/AmendeVehiculePlusProprietaire.vue';

export default defineComponent({
  components :{
    SignificationTermesHistorique,
    QuelsSinistres,
    DifferenceProprietaireTitulaire,
    RecupererRapportExpert,
    OppositionTranfertCertificat,
    VehiculeGage,
    DeclarationValantSaisie,
    AmendeVehiculePlusProprietaire,
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
        title="Que signifient les termes des opérations figurant dans l’historique ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <SignificationTermesHistorique />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Quels sinistres figurent sur HistoVec ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <QuelsSinistres />
      </DsfrAccordion>
    </li>
    <li>
      <!-- @todo @doublonFaq4 Voir avec la DSR lequel on souhaite garder -->
      <DsfrAccordion
        class="background-accordeon-white"
        title="Quelle différence y a-t-il entre la notion de propriétaire et titulaire ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <DifferenceProprietaireTitulaire />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Comment puis-je récupérer le rapport d’un expert en automobile ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <RecupererRapportExpert />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Pourquoi HistoVec affiche-t-il une opposition au transfert du certificat d’immatriculation ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <OppositionTranfertCertificat />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Que faire si mon véhicule est gagé ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <VehiculeGage />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Que faire en cas de déclaration valant saisie ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <DeclarationValantSaisie />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Que faire si je reçois des amendes concernant un véhicule dont je ne suis plus propriétaire ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <AmendeVehiculePlusProprietaire />
      </DsfrAccordion>
    </li>
  </DsfrAccordionsGroup>
</template>
