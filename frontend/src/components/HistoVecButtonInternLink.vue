<script>
import { defineComponent } from 'vue'
import router from '../router';


export default defineComponent({
  name: 'HistoVecButtonInternLink',

  inheritAttrs: false,

  props: {
    routerLinkProps: {
      type: Object,
      default: undefined,
    },
    buttonProps: {
      type: Object,
      default: undefined,
    },
    to:{
      type: String,
      default: null,
    },
  },
  methods: {
    navigate() {
      return router.push({path: this.to})
    },
  },
})
</script>
<template>
  <router-link
    v-bind="routerLinkProps"
    custom
  >
    <DsfrButton
      v-bind="buttonProps"
      @click="navigate"
    />
  </router-link>
</template>
