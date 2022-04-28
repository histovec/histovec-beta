<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

const propsForButtonOnly = ['label']

export default defineComponent({
  name: 'HistoVecButtonLink',


  inheritAttrs: false,

  props: {
    ...RouterLink.props,
    label: {
      type: String,
      default: 'lien',
    },
  },

  computed: {
    isExternalLink() {
      return typeof this.to === 'string' && this.to.startsWith('http')
    },
    routerLinkProps () {
      return Object.fromEntries(Object.entries(this.$props).filter(([prop]) => !propsForButtonOnly.includes(prop)))
    },
    buttonProps () {
      return {
        ...this.$attrs,
        ...Object.fromEntries(Object.entries(this.$props).filter(([prop]) => propsForButtonOnly.includes(prop))),
      }
    },
  },
})
</script>

<template>
  <a
    v-if="isExternalLink"
    :href="to"
    target="_blank"
    rel="noopener noreferrer"
  >
    {{ label }}
  </a>
  <router-link
    v-else
    v-slot="{ navigate }"
    v-bind="routerLinkProps"
    custom
  >
    <DsfrButton
      :label="label"
      v-bind="buttonProps"
      @click="navigate"
    />
  </router-link>
</template>
