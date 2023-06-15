<script>
import {defineComponent} from 'vue'

import syntheseMapping from '@Assets/json/synthese.json'
import { formatIsoToFrDate } from '@Assets/js/format'
import { getExposant } from '@Utils/format.js'
import { USAGE_AGRICOLE, USAGE_COLLECTION } from '@Constants/usagesSynthese.js'
import { useRapportStore } from '@Stores/rapport'
import { syntheseVehiculeMapping } from '@Utils/normaliserDonneesPageRapport'

export default defineComponent({
  name: 'OngletSynthese',

  props: {
    isRapportVendeur: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      syntheseMapping,
      formatIsoToFrDate,
      getExposant,

      store: useRapportStore(),
      hasProcedureVE:{},
      datePremImmatriculationFR:{},
      processedVehicule:{
        proprietaire:{
          particulier:{},
        },
        certificatImmatriculation:{},
        vehicule:{
          accidents:{},
          caracteristiques: {},
          infos:{},
          infosImport:{},
          situationAdmin:{
            dvs:{},
            gages:{},
            oppositions:{},
            suspensions:{},
          },
          usage:{},
        },


      },

      constants: {
        USAGE_AGRICOLE,
        USAGE_COLLECTION,
      },
    }
  },
  computed: {
    processedVehiculeData(){
      const rapport = this.store.getRapport
      if(rapport) {
        return rapport
      }
      return this.processedVehicule
    },
    situationAdministrative(){
      const rapport = this.store.getRapport
      if(rapport) {
        const etatCi = {
          isDuplicata: rapport.vehicule.situationAdmin.isDuplicata,
          isCIAnnule: rapport.vehicule.situationAdmin.isCiAnnule,
          isCIPerdu: rapport.vehicule.situationAdmin.isCiPerdu,
          isCIVole: rapport.vehicule.situationAdmin.isCiVole,
        }
        const isVehVol = rapport.vehicule.situationAdmin.isVehVole
        const syntheseSituationAdmin = {
          hasDeclarationsValantSaisie: rapport.vehicule.situationAdmin.dvs.hasDvs,
          hasGage: rapport.vehicule.situationAdmin.gages.hasGages,
          hasOtci: rapport.vehicule.situationAdmin.oppositions.informations.otcis.length > 0,
          hasOtciPV: rapport.vehicule.situationAdmin.oppositions.informations.otcisPv.length> 0,
          hasOve: rapport.vehicule.situationAdmin.oppositions.informations.oves.length> 0,
          hasOvei: rapport.vehicule.situationAdmin.oppositions.informations.oveis.length> 0,
          hasSuspension: rapport.vehicule.situationAdmin.suspensions.hasSuspensions,
        }
        return syntheseVehiculeMapping(etatCi, isVehVol, syntheseSituationAdmin)
      }
      return this.processedVehicule.vehicule.situationAdmin
    },
    hasProcedureVEEnCours () {
      const rapport = this.store.getRapport
      if(rapport) {
        return rapport.vehicule.accidents.dateDernierSinistre > rapport.vehicule.accidents.dateDerniereResolution
      }
      return this.hasProcedureVE
    },

    datePremiereImmatriculationFR () {
      const rapport = this.store.getRapport
      if(rapport) {
        return formatIsoToFrDate(rapport.vehicule.infos.datePremiereImmatriculation)
      }
      return this.datePremImmatriculationFR
    },

    isRapportAcheteur () {
      return !this.isRapportVendeur
    },
  },
})
</script>


<template>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12  fr-pb-3w">
      <h3 class="fr-mb-0 fr-h5">
        Résumé
      </h3>
    </div>

    <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
      <div class="fr-pb-3w  fr-pt-0">
        <h4 class="fr-mb-0  fr-pb-2w fr-h6">
          Modèle
        </h4>

        <p class="fr-text--md  fr-text--bleu  fr-mb-1v">
          {{ processedVehiculeData.vehicule.caracteristiques.marque }} {{ processedVehiculeData.vehicule.caracteristiques.nomCommercial }}
        </p>

        <p
          v-if="processedVehiculeData.vehicule.caracteristiques.puissanceCv"
          class="fr-text--md  fr-mb-1v"
        >
          Puissance fiscale : <span class="fr-text--bleu">{{ processedVehiculeData.vehicule.caracteristiques.puissanceCv }} ch</span>
        </p>

        <p
          v-if="isRapportAcheteur"
          class="fr-text--md  fr-mb-1v"
        >
          Calculez le montant de votre certificat d'immatriculation
          <br />
          <a
            class="fr-link"
            href="https://siv.interieur.gouv.fr/map-usg-ui/do/simtax_accueil"
            rel="noopener noreferrer"
            target="_blank"
            title="Simulateur"
          >
            Accédez au simulateur de calcul
          </a>
        </p>
      </div>

      <div
        v-if="processedVehiculeData.vehicule.usage.isAgricole || processedVehiculeData.vehicule.usage.isCollection"
        class="fr-pb-3w  fr-pt-0"
      >
        <h4 class="fr-mb-0  fr-pb-2w fr-h6">
          Usage
        </h4>
        <div
          v-if="processedVehiculeData.vehicule.usage.isCollection "
        >
          <p class="fr-text--md  fr-mb-2w">
            <span class="fr-text--bleu">
              <VIcon
                :name="constants.USAGE_COLLECTION.icon"
              />
            </span>
            {{ constants.USAGE_COLLECTION.text }}
            <br />
            <span
              v-if="constants.USAGE_COLLECTION.adv"
              class="fr-text--md  fr-mb-1w"
            >
              <a
                class="fr-link"
                :href="constants.USAGE_COLLECTION.link"
                rel="noopener noreferrer"
                target="_blank"
                :title="constants.USAGE_COLLECTION.adv"
              >
                {{ constants.USAGE_COLLECTION.adv }}
              </a>
            </span>
          </p>
        </div>
        <div
          v-if="processedVehiculeData.vehicule.usage.isAgricole"
        >
          <p class="fr-text--md  fr-mb-0">
            <span class="fr-text--bleu">
              <VIcon
                :name="constants.USAGE_AGRICOLE.icon"
              />
            </span>
            {{ constants.USAGE_AGRICOLE.text }}
            <br />
            <span
              v-if="constants.USAGE_AGRICOLE.adv"
              class="fr-text--md  fr-mb-1w"
            >
              <a
                class="fr-link"
                :href="constants.USAGE_AGRICOLE.link"
                rel="noopener noreferrer"
                target="_blank"
                :title="constants.USAGE_AGRICOLE.adv"
              >
                {{ constants.USAGE_AGRICOLE.adv }}
              </a>
            </span>
          </p>
        </div>
      </div>

      <div class="fr-pb-0  fr-pt-0">
        <h4 class="fr-mb-0  fr-pb-0 fr-h6">
          Propriétaire actuel
        </h4>

        <p class="fr-text--md  fr-mb-0">
          <span class="fr-text--bleu">{{ processedVehiculeData.proprietaire.particulier.nomNaissance }} {{ processedVehiculeData.proprietaire.particulier.prenom }}</span>
          depuis
          <span
            v-if="processedVehiculeData.certificatImmatriculation.age"
            class="fr-text--bleu"
          >
            {{ processedVehiculeData.certificatImmatriculation.age }}
          </span>
          <span
            v-if="!processedVehiculeData.certificatImmatriculation.age"
            class="fr-text--bleu"
          >
            une durée inconnue
          </span>
          <br />
          <template v-if="!processedVehiculeData.vehicule.infosImport.isImported">
            <template v-if="isRapportVendeur">
              Vous êtes le
              <span class="fr-text--bleu">{{ processedVehiculeData.vehicule.infos.nbTitulaires }}</span>
              <sup class="fr-text--bleu">{{ getExposant(processedVehiculeData.vehicule.infos.nbTitulaires) }}</sup>
              titulaire de ce véhicule
            </template>
            <template v-if="isRapportAcheteur">
              Ce véhicule a déjà eu
              <span class="fr-text--bleu">{{ processedVehiculeData.vehicule.infos.nbTitulaires }}</span>
              titulaire(s), en l'achetant vous serez le
              <span class="fr-text--bleu">{{ Number(processedVehiculeData.vehicule.infos.nbTitulaires) + 1 }}</span>
              <sup class="fr-text--bleu">{{ getExposant(Number(processedVehiculeData.vehicule.infos.nbTitulaires) + 1) }}</sup>
            </template>
          </template>
          <br />
          <template v-if="processedVehiculeData.vehicule.infosImport.isImported">
            Le nombre exact de titulaires ne peut être calculé avec précision
            <br />
            (première immatriculation à l'étranger)
          </template>
        </p>
      </div>
    </div>

    <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
      <div class="fr-pb-3w  fr-pt-0">
        <h4 class="fr-mb-0  fr-pb-2w fr-h6">
          Immatriculation
        </h4>

        <p class="fr-text--md  fr-mb-1v">
          <template v-if="datePremiereImmatriculationFR">
            Première immatriculation le
            <span class="fr-text--bleu">{{ datePremiereImmatriculationFR }}</span>
          </template>

          <template v-if="!datePremiereImmatriculationFR">
            Date de première immatriculation <span class="fr-text--bleu">inconnue</span>
          </template>
        </p>

        <template v-if="processedVehiculeData.vehicule.infosImport.isImported">
          <p class="fr-text--md  fr-text--bleu  fr-mb-1v">
            <span class="fr-text--bleu">
              <VIcon
                name="ri-earth-line"
              />
            </span>
            Ce véhicule a été <span class="fr-text--bleu">importé</span>
            <br />
            <span
              v-if="isRapportAcheteur"
              class="fr-text--bleu"
            >
              Vérifier les options incluses qui peuvent être différentes
            </span>
          </p>
        </template>
      </div>

      <div class="fr-pb-3w  fr-pt-0">
        <h4 class="fr-mb-0  fr-pb-2w fr-h6">
          Situation administrative
        </h4>

        <p
          v-if="hasProcedureVEEnCours || processedVehiculeData.vehicule.accidents.nbSinistres > 0"
          class="fr-text--md  fr-mb-1v"
        >
          <span class="fr-text--bleu">
            <VIcon
              :name="processedVehiculeData.vehicule.situationAdmin.isApteACirculer ? 'ri-thumb-up-line' : 'ri-error-warning-fill'"
            />
          </span>
          <!-- état - un seul sinistre !-->
          <template v-if="processedVehiculeData.vehicule.accidents.nbSinistres === 1 || (processedVehiculeData.vehicule.accidents.nbSinistres === 0 && hasProcedureVEEnCours)">
            Ce véhicule a eu <span class="fr-text--bleu">un sinistre déclaré</span>
            <span
              v-if="processedVehiculeData.vehicule.accidents.dateDernierSinistre"
              class="fr-text--bleu"
            >
              en {{ processedVehiculeData.vehicule.accidents.dateDernierSinistre }}
            </span>
            <br />
            <template v-if="processedVehiculeData.vehicule.situationAdmin.isApteACirculer">
              et
              <span class="fr-text--bleu"> déclaré apte à circuler</span>
              <span
                v-if="processedVehiculeData.vehicule.accidents.dateDerniereResolution"
                class="fr-text--bleu"
              >
                en {{ processedVehiculeData.vehicule.accidents.dateDerniereResolution }}
              </span>
            </template>
          </template>
          <!-- état - plusieurs sinistres !-->
          <template v-if="processedVehiculeData.vehicule.accidents.nbSinistres > 1">
            Ce véhicule a eu
            <span class="fr-text--bleu">plusieurs sinistres</span>
            , dont le dernier déclaré en <span class="fr-text--bleu">{{ processedVehiculeData.vehicule.accidents.dateDernierSinistre }}</span>
            <br />
            <template v-if="processedVehiculeData.vehicule.situationAdmin.isApteACirculer">
              Le véhicule a été
              <span class="fr-text--bleu"> déclaré apte à circuler</span>
              <span
                v-if="processedVehiculeData.vehicule.accidents.dateDerniereResolution"
                class="fr-text--bleu"
              >
                en {{ processedVehiculeData.vehicule.accidents.dateDerniereResolution }}
              </span>
            </template>
          </template>
          <!-- @todo @redirectTab: Voir avec la DSR s'il est utile de rediriger vers l'ongler "Historique" ? -->
          <br />
          <!-- Commentaire: un ou plusieurs sinistres -->
          <span
            v-if="processedVehiculeData.vehicule.situationAdmin.isApteACirculer"
            class="fr-text--bleu"
          >
            {{ syntheseMapping[(isRapportVendeur ? 'fin_ove_vendeur' : 'fin_ove_acheteur')].adv }}
          </span>
          <span
            v-else
            class="fr-text--bleu"
          >
            {{ syntheseMapping['ove'].adv }}
          </span>
          <br />
          <span
            v-if="processedVehiculeData.vehicule.accidents.nbSinistres > 0"
            class="fr-text--bleu"
          >
            {{ syntheseMapping['multi_ove'].adv }}
          </span>
          <br />
          <br />
        </p>
        <p
          v-if="!(processedVehiculeData.vehicule.situationAdmin.dvs.hasDvs && processedVehiculeData.vehicule.situationAdmin.gages.hasGages && processedVehiculeData.vehicule.situationAdmin.oppositions.hasOppositions && processedVehiculeData.vehicule.situationAdmin.suspensions.hasSuspensions) && !processedVehiculeData.lastSinistreYear"
          class="fr-text--md  fr-mb-1v"
        >
          <span class="fr-text--bleu">
            <VIcon
              name="ri-check-line"
            />
          </span>
          <span class="fr-text--bleu">Rien à signaler </span>
          <br />
          (gages, opposition, vol,...)
        </p>

        <p
          v-for="(entry, index) in situationAdministrative"
          :key="index"
        >
          <span class="fr-text--bleu">
            <VIcon
              :name="syntheseMapping[entry]?.icon"
            />
          </span>
          {{ syntheseMapping[entry]?.text }}
          <!-- @todo: Voir avec la DSR s'il est utile de rediriger vers l'ongler "Situation administrative" ? -->
          <br />
          {{ syntheseMapping[entry]?.adv }}
          <br />
          <a
            v-if="syntheseMapping[entry]?.link"
            class="fr-link"
            title="Lien vers service-public.fr"
            :href="syntheseMapping[entry].link"
            rel="noopener noreferrer"
            target="_blank"
          >
            En savoir plus
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
