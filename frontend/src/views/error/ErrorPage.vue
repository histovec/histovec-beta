<script>
import { defineComponent } from 'vue'
import HistoVecButtonLink from '@Components/HistoVecButtonLink.vue'
import ImagePresentation from '@Components/ImagePresentation.vue'

import erreurSvg from '@Assets/img/erreur.svg?url'

export default defineComponent({
  name: 'ErreurPage',

  components: { HistoVecButtonLink, ImagePresentation },

  props: {
    title: {
      type: String,
      default: 'Erreur',
    },
    subTitle: {
      type: String,
      default: '',
    },
    errorTitle: {
      type: String,
      default: null,
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
    primaryAction: {
      type: Object,
      default: () => {},
    },
    secondaryAction: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      image : {
        erreurSvg,
      },
    }
  },
})
</script>

<template>
  <div class="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
    <div class="fr-py-0 fr-col-12 fr-col-md-6">
      <h1>{{ title }}</h1>
      <p class="fr-text--sm fr-mb-3w">
        {{ subTitle }}
      </p>
      <p
        v-if="errorTitle"
        class="fr-text--lead fr-mb-3w"
      >
        {{ errorTitle }}
      </p>
      <p
        v-for="(errorMessage, index) in errorMessages"
        :key="index"
        class="fr-text--md  fr-mb-0"
      >
        {{ errorMessage }}
      </p>

      <div class="fr-grid-row  fr-grid-row--gutters  fr-mb-4w  fr-mt-4w">
        <div class="fr-col-6">
          <HistoVecButtonLink
            v-if="primaryAction"
            v-bind="primaryAction"
          />
        </div>
        <div class="fr-col-6 ">
          <HistoVecButtonLink
            v-if="secondaryAction"
            v-bind="secondaryAction"
            secondary
          />
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0">
      <ImagePresentation :src="image.erreurSvg" />
    </div>
  </div>
</template>
