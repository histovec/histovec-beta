<template>
  <div
    class="form-group has-feedback"
    :class="[{'has-error' : ((!checkForm) && active)}]"
  >
    <label
      for="input"
      class="control-label"
    >
      {{ label }}
      <span
        v-if="required"
        class="info_red"
        :title="requiredTitle"
      >
        *
      </span>
    </label>
    <slot name="link"></slot>
    <i
      v-if="false"
      class="pull-right m-l-15 fa"
      :class="{
        'fa-lock': masked,
        'fa-unlock-alt': !masked
      }"
      :title="maskTitle"
      @click="toggleMask"
    >
    </i>
    <input
      v-if="masked && ((typeof mask) === 'string')"
      :id="formId"
      v-model="model"
      v-mask="mask"
      :type="type"
      :required="required"
      class="form-control"
      :placeholder="placeholder"
      :tabindex="tabindex"
    >
    <input
      v-if="masked && ((typeof mask) !== 'string')"
      :id="formId"
      v-model="model"
      :type="type"
      :required="required"
      class="form-control"
      :placeholder="placeholder"
      :tabindex="tabindex"
      @input="applyMask"
    >
    <input
      v-if="!masked"
      :id="formId"
      v-model="model"
      :type="type"
      :required="required"
      class="form-control"
      :placeholder="placeholder"
      :tabindex="tabindex"
    >
    <i
      v-if="icon"
      class="form-control-feedback"
      :class="icon"
    >
    </i>
  </div>
</template>

<script>
import masks from  '@/assets/js/masks'

export default {
  props: {
    active: {
      type: Boolean,
      default: false,
      required: false,
    },
    formId: {
      type: String,
      default: 'default',
      required: true,
    },
    option: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  computed: {
    defaultOptions () {
      return this.$store.state.identity.formOptions.default
    },
    options () {
      if (this.option) {
        return this.$store.state.identity.formOptions[this.formId][this.option]
      } else {
        return this.$store.state.identity.formOptions[this.formId]
      }
    },
    model: {
      get () {
        return this.$store.state.identity[this.options.model]
      },
      set (value) {
        const modelName = this.options.model
        const camelizedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1)
        this.$store.commit(`update${camelizedModelName}`, value)
      }
    },
    label () {
      return this.options.label || this.defaultOptions.label
    },
    required () { return ('required' in this.options) ? this.options.required : this.defaultOptions.required },
    requiredTitle () { return this.options.requiredTitle || this.defaultOptions.requiredTitle },
    type () { return this.options.type || this.defaultOptions.type },
    masked () { return this.options.masked },
    maskTitle () { return this.masked ? (this.options.maskTitle || this.defaultOptions.maskTitle) : (this.options.maskTitleAlt || this.defaultOptions.maskTitleAlt) },
    tabindex () { return this.options.tabindex },
    icon () { return this.options.icon },
    placeholder () { return this.masked ? this.options.placeholder : this.options.placeholderAlt },
    mask () {
      if (this.options.mask in masks) {
        return masks[this.options.mask]
      } else {
        return this.options.mask
      }
    },
    checkForm () {
      return this.model.match(this.options.check)
    }
  },
  methods: {
    toggleMask () {
      const lockKeyPath = this.option ? `${this.formId}.${this.option}.masked` : `${this.formId}.masked`
      this.$store.commit('updateFormOptions', { [lockKeyPath]: !this.masked })
    },
    applyMask (evt) {
      if (!evt.isTrusted) return
      const target = evt.currentTarget
      this.model = this.mask(target.value)
    }
  }
}
</script>