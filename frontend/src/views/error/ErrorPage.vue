<script>
import { defineComponent } from 'vue'
import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'
import ImagePresentation from '@/components/ImagePresentation.vue'

import erreurSvg from '@/assets/img/erreur.svg?url'

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
      default: '',
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
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="[]"
      />
    </div>
    <div class="fr-col-lg-4 fr-col-xl-4">
      <ImagePresentation :src="image.erreurSvg" alt="Illustration de la page d'erreur"/>
    </div>
    <div class="fr-col-12  fr-col-lg-8  fr-col-xl-8  fr-mt-10v">
      <h1>{{ title }}</h1>
      <p class="fr-error-subtitle fr-text--xs">
        {{ subTitle }}
      </p>

      <p class="fr-text--xl">
        {{ errorTitle }}
      </p>

      <p
        v-for="(errorMessage, index) in errorMessages"
        :key="index"
        class="fr-text--md  fr-mb-0"
      >
        {{ errorMessage }}
      </p>
    </div>

    <div class="fr-col-lg-4  fr-col-xl-4">
      <!--
        @todo @erreurSvg1:
        Récupérer l'image auprès de l'équipe du DSFR:
        https://gouvfr.atlassian.net/wiki/spaces/DB/pages/993165327/Mod+les+de+pages+d+erreurs
      -->
      <!-- <DsfrPicture src="">
        <ErreurSvg
          title="Illustration de la page d'erreur"
        />
      </DsfrPicture> -->
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-mb-4w  fr-mt-4w">
    <div class="fr-col-12  fr-col-md-5  fr-col-lg-4  fr-col-xl-4">
      <HistoVecButtonLink
        v-if="primaryAction"
        v-bind="primaryAction"
      />
    </div>
    <div class="fr-col-12  fr-col-md-5  fr-col-lg-4  fr-col-xl-4">
      <HistoVecButtonLink
        v-if="secondaryAction"
        v-bind="secondaryAction"
        secondary
      />
    </div>
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}

.fr-error-subtitle {
  color: var(--text-mention-grey);
}
</style>
