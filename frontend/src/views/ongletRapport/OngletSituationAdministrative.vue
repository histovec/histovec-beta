<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'OngletSituationAdministrative',

  props: {
    assets: {
      type: Object,
    },
    reportLabels: {
      type: Object,
    },
    isRapportVendeur: {
      type: Boolean,
      default: false,
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
                :href="assets.syntheseMapping['otci'].link"
                rel="noopener noreferrer"
                target="_blank"
              > En savoir plus
              </a>
            </span>
          </h3>
        </div>
        <div class="fr-col-12  fr-pb-0  fr-pt-0">
          <p class="fr-text--md">
            <span
              v-for="(gageInfos, index) in reportLabels.gagesInfos"
              :key="index"
            >
              <span v-if="gageInfos.date">{{ gageInfos.date }} - </span>
              <span class="fr-text--bleu">{{ gageInfos.label }}</span>
            </span>
          </p>
        </div>

        <div class="fr-col-12  fr-pb-2w  fr-pt-0">
          <h3 class="fr-mb-0 fr-h5">
            Oppositions
            <span>
              <a
                class="fr-link"
                title="En savoir plus sur les oppositions - Lien vers service-public.fr"
                :href="assets.syntheseMapping['otci'].link"
                rel="noopener noreferrer"
                target="_blank"
              > En savoir plus
              </a>
            </span>
          </h3>
        </div>
        <div class="fr-col-12  fr-pb-0  fr-pt-0">
          <p class="fr-text--md">
            <span
              v-for="(oppositionInfos, index) in reportLabels.oppositionsInfos"
              :key="index"
            >
              <span v-if="oppositionInfos.date">{{ oppositionInfos.date }} - </span>
              <span class="fr-text--bleu">{{ oppositionInfos.label }}</span>
              <span
                v-if="isRapportVendeur && oppositionInfos.label.includes('PV') && oppositionSection.hasOtciPV"
              >
                ( Appelez le 08 21 08 00 31 )
              </span>
            </span>
          </p>
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
          {{ reportLabels.vol }}
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
          <p class="fr-text--md">
            <span
              v-for="(dvs, index) in reportLabels.dvsInfos"
              :key="index"
            >
              <span v-if="dvs.date">{{ dvs.date }} - </span>
              <span class="fr-text--bleu">{{ dvs.label }}</span>
            </span>
          </p>
        </div>

        <div class="fr-col-12  fr-pb-2w  fr-pt-0">
          <h3 class="fr-mb-0 fr-h5">
            Suspensions
          </h3>
        </div>
        <div class="fr-col-12  fr-pb-0  fr-pt-0">
          <div class="fr-text--md">
            <div
              v-for="(suspensionInfos, index) in reportLabels.suspensionsInfos"
              :key="index"
            >
              <span v-if="suspensionInfos.date">{{ suspensionInfos.date }} - </span>
              <span class="fr-text--bleu">{{ suspensionInfos.label }}</span>
            </div>
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
          {{ reportLabels.titre.vol }}
        </div>
        <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-0  fr-pt-0">
          Déclaré perdue
        </div>
        <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-0  fr-pt-0  fr-text--bleu">
          {{ reportLabels.titre.perte }}
        </div>
        <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-3w  fr-pt-0">
          Duplicata
        </div>
        <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-3w  fr-pt-0  fr-text--bleu">
          {{ reportLabels.titre.duplicata }}
        </div>
      </div>
    </div>
  </div>
</template>
