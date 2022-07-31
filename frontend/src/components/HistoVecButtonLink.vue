<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

const propsForButtonOnly = ['disabled', 'label', 'secondary', 'tertiary', 'icon', 'iconRight', 'iconOnly']

export default defineComponent({
  name: 'HistoVecButtonLink',

  inheritAttrs: false,

  props: {
    ...RouterLink.props,
    // ...DsfrButton.props // @todo: import DsfrButton Typescript type
    disabled: Boolean,
    label: {
      type: String,
      default: undefined,
    },
    secondary: Boolean,
    tertiary: Boolean,
    icon: {
      type: String,
      default: undefined,
    },
    iconRight: Boolean,
    iconOnly: Boolean,
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
    buttonStylingClass () {
      return {
        'fr-btn': true,
        'fr-btn--secondary': this.buttonProps.secondary && !this.buttonProps.tertiary,
        'fr-btn--tertiary': this.buttonProps.tertiary && !this.buttonProps.secondary,
        'inline-flex': true,
        'reverse': this.buttonProps.iconRight,
        'justify-center': this.buttonProps.iconOnly,
      }
    },
  },
})
</script>

<template>
  <a
    v-if="isExternalLink"
    :class="buttonStylingClass"
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
      v-bind="buttonProps"
      @click="navigate"
    />
  </router-link>
</template>
