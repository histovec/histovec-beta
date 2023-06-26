<script>
import {defineComponent} from 'vue'

import syntheseMapping from '@Assets/json/synthese.json'
import { ordonneParDateAntechronologique } from '@Utils/normaliserDonneesPageRapport'

export default defineComponent({
  name: 'OngletSituationAdministrative',

  props: {
    isRapportVendeur: {
      type: Boolean,
      default: false,
    },
    situationAdministrative: {
      type: Object,
      default: null,
    },
    infos: {
      type: Object,
      default: null,
    },
    certificatImmatriculation: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      syntheseMapping,

      opposition:{},
    }
  },

  computed: {
    oppositions () {
      if(this.situationAdministrative) {
        const oppositionsLabelise = this.situationAdministrative.oppositions.informations
        console.log(oppositionsLabelise)
        return ordonneParDateAntechronologique(
          [
            ...(oppositionsLabelise.oveis.length ? [{
              date: oppositionsLabelise.oveis[0].date,
              label: 'Véhicule économiquement irréparable',
            }] : []),
            // Pour les OVEs, le CSA affiche "Véhicule endommagé".
            // Il a été convenu par la DSR qu'on préfère afficher "Procédure de réparation contrôlée" dans le cas du rapport HistoVec,
            // même si cela crée une incohérence entre le rapport HistoVec et le CSA.
            ...(oppositionsLabelise.oves.length ? [{
              date: oppositionsLabelise.oves[0].date,
              label: 'Procédure de réparation contrôlée',
            }] : []),
            // On pourrait identifier les différents motifs d'OTCI (trésor, véhicule bloqué, etc.) mais il a été décidé de laisser "Opposition temporaire" pour le moment.
            ...(oppositionsLabelise.otcis.length ? [{
              date: oppositionsLabelise.otcis[0].date,
              label: 'Opposition temporaire',
            }] : []),
            ...(oppositionsLabelise.otcisPv.length ? [{
              date: oppositionsLabelise.otcisPv[0].date,
              label: 'PV en attente',
            }] : []),
          ],
        )
      }
      return this.opposition
    },
  },
})
</script>


<template>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12  fr-col-md-6  fr-col-lg-6  fr-col-xl-6">
      <div class="fr-grid-row  fr-grid-row--gutters">
        <div class="fr-col-12  fr-pb-2w">
          <h3 class="fr-mb-0 fr-h5">
            Gages
            <span>
              <a
                class="fr-link"
                title="En savoir plus sur les gages - Lien vers service-public.fr"
                :href="syntheseMapping['otci'].link"
                rel="noopener noreferrer"
                target="_blank"
              > En savoir plus
              </a>
            </span>
          </h3>
        </div>
        <div class="fr-col-12  fr-pb-0  fr-pt-0">
          <div
            v-if="situationAdministrative?.gages.hasGages"
            class="fr-text--md"
          >
            <div
              v-for="(gageInfos, index) in situationAdministrative?.gages.informations"
              :key="index"
            >
              <span v-if="gageInfos.date">{{ gageInfos.date }} - </span>
              <span class="fr-text--bleu">{{ gageInfos.nomCreancier }}</span>
            </div>
          </div>
          <div
            v-if="!situationAdministrative?.gages.hasGages"
            class="fr-text--md fr-text--bleu"
          >
            NON
          </div>
        </div>

        <div class="fr-col-12  fr-pb-2w  fr-pt-0">
          <h3 class="fr-mb-0 fr-h5">
            Oppositions
            <span>
              <a
                class="fr-link"
                title="En savoir plus sur les oppositions - Lien vers service-public.fr"
                :href="syntheseMapping['otci'].link"
                rel="noopener noreferrer"
                target="_blank"
              > En savoir plus
              </a>
            </span>
          </h3>
        </div>
        <div class="fr-col-12  fr-pb-0  fr-pt-0">
          <div
            v-if="situationAdministrative?.oppositions.hasOppositions"
            class="fr-text--md"
          >
            <div
              v-for="(oppositionInfos, index) in oppositions"
              :key="index"
            >
              <span v-if="oppositionInfos.date">{{ oppositionInfos.date }} - </span>
              <span class="fr-text--bleu">{{ oppositionInfos.label }}</span>
              <span
                v-if="isRapportVendeur && oppositionInfos.label && oppositionInfos.hasOtciPV"
              >
                ( Appelez le 08 21 08 00 31 )
              </span>
            </div>
          </div>
          <div
            v-if="!situationAdministrative?.oppositions.hasOppositions"
            class="fr-text--md fr-text--bleu"
          >
            NON
          </div>
        </div>

        <div class="fr-col-12  fr-pb-2w  fr-pt-0">
          <h3 class="fr-mb-0 fr-h5">
            Véhicule
          </h3>
        </div>
        <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-3w  fr-pt-0">
          Déclaré volé
        </div>
        <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-3w  fr-pt-0  fr-text--bleu">
          {{ situationAdministrative?.isVehVole? 'OUI':'NON' }}
        </div>
      </div>
    </div>

    <div class="fr-col-12  fr-col-md-6  fr-col-lg-6  fr-col-xl-6">
      <div class="fr-grid-row  fr-grid-row--gutters">
        <div class="fr-col-12  fr-pb-2w">
          <h3 class="fr-mb-0 fr-h5">
            Déclarations valant saisie
          </h3>
        </div>
        <div class="fr-col-12  fr-pb-0  fr-pt-0">
          <div
            v-if="situationAdministrative?.dvs.hasDvs"
            class="fr-text--md"
          >
            <div
              v-for="(dvs, index) in situationAdministrative?.dvs.informations"
              :key="index"
            >
              <span v-if="dvs.date">{{ dvs.date }} - </span>
              <span class="fr-text--bleu">{{ dvs.dvsAutorite }}</span>
            </div>
          </div>
          <div
            v-if="!situationAdministrative?.dvs.hasDvs"
            class="fr-text--md fr-text--bleu"
          >
            NON
          </div>
        </div>

        <div class="fr-col-12  fr-pb-2w  fr-pt-0">
          <h3 class="fr-mb-0 fr-h5">
            Suspensions
          </h3>
        </div>
        <div class="fr-col-12  fr-pb-0  fr-pt-0">
          <div
            v-if="situationAdministrative?.suspensions.hasSuspensions"
            class="fr-text--md"
          >
            <div
              v-for="(suspensionInfos, index) in situationAdministrative?.suspensions.informations"
              :key="index"
            >
              <span v-if="suspensionInfos.date">{{ suspensionInfos.date }} - </span>
              <span class="fr-text--bleu">{{ suspensionInfos.motif }}</span>
            </div>
          </div>
          <div
            v-if="!situationAdministrative?.suspensions.hasSuspensions"
            class="fr-text--md fr-text--bleu"
          >
            NON
          </div>
        </div>

        <div class="fr-col-12  fr-pb-2w  fr-pt-0">
          <h3 class="fr-mb-0 fr-h5">
            Certificat d'immatriculation
          </h3>
        </div>
        <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-0  fr-pt-0">
          Déclaré volée
        </div>
        <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-0  fr-pt-0  fr-text--bleu">
          {{ situationAdministrative?.isCiVole? 'OUI':'NON' }}
        </div>
        <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-0  fr-pt-0">
          Déclaré perdue
        </div>
        <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-0  fr-pt-0  fr-text--bleu">
          {{ situationAdministrative?.isCiPerdu? 'OUI':'NON' }}
        </div>
        <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-3w  fr-pt-0">
          Duplicata
        </div>
        <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-3w  fr-pt-0  fr-text--bleu">
          {{ situationAdministrative?.isDuplicata? 'OUI':'NON' }}
        </div>
      </div>
    </div>
  </div>
</template>
