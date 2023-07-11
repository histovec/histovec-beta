<script>
import {defineComponent} from 'vue';
import QuiPeutConsulterHistovec from './reponseAccordeon/QuiPeutConsulterHistovec.vue';
import CommentConsulterRapportNAppartientPas from './reponseAccordeon/CommentConsulterRapportNAppartientPas.vue';
import LienNeFonctionnePas from './reponseAccordeon/LienNeFonctionnePas.vue';
import DifferenceProprietaireTitulaire from './reponseAccordeon/DifferenceProprietaireTitulaire.vue';
import AccesNonAutorise from './reponseAccordeon/AccesNonAutorise.vue';
import InformationNecessaireRecherche from './reponseAccordeon/InformationNecessaireRecherche.vue';
import RechercheVehiculeLocation from './reponseAccordeon/RechercheVehiculeLocation.vue';
import CertificatImmatNonValide from './reponseAccordeon/CertificatImmatNonValide.vue';

export default defineComponent({
  components :{
    QuiPeutConsulterHistovec,
    CommentConsulterRapportNAppartientPas,
    LienNeFonctionnePas,
    DifferenceProprietaireTitulaire,
    AccesNonAutorise,
    InformationNecessaireRecherche,
    RechercheVehiculeLocation,
    CertificatImmatNonValide,
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
        title="Qui peut consulter HistoVec ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <QuiPeutConsulterHistovec />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Comment consulter le rapport d’un véhicule qui ne m’appartient pas ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <CommentConsulterRapportNAppartientPas />
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
        title="Que faire si le message « accès non autorisé » s’affiche lors de ma recherche ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <AccesNonAutorise />
      </DsfrAccordion>
    </li>
    <li>
      <DsfrAccordion
        class="background-accordeon-white"
        title="Quelles sont les informations à indiquer pour effectuer ma recherche ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <InformationNecessaireRecherche />
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
        title="Comment consulter HistoVec si je n’ai pas le certificat d'immatriculation en cours de validité ?"
        :expanded-id="expandedId"
        @expand="expandedId = $event"
      >
        <CertificatImmatNonValide />
      </DsfrAccordion>
    </li>
  </DsfrAccordionsGroup>
</template>
