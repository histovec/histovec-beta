<template>
  <div class="progress-container is-flex" v-if="displayProgress">
    <progress :class="['progress', 'is-' + colorProgress, size ? `is-${size}` : '']" :value="value" :max="max"></progress>
    <span v-show="showLabel">{{value}}</span>
  </div>
  <div v-else v-html="value">
  </div>
</template>

<script>
export default {
  props: {
    size: String,
    colors: {
      required: true,
      type: Object
    },
    value: {
      type: null,
      required: true,
      default: 0
    },
    max: {
      type: Number,
      required: true,
      default: 100
    },
    showLabel: Boolean
  },
  data () {
    return {
      displayProgress: false
    }
  },
  mounted () {
    if (Number.isInteger(this.value) && this.value > 0 && this.value <= this.max) {
      this.displayProgress = true
    }
  },
  computed: {
    colorProgress () {
      if (this.value >= this.colors.success) {
        return 'success'
      } else if (this.value >= this.colors.info) {
        return 'info'
      } else if (this.value >= this.colors.warning) {
        return 'warning'
      } else if (this.value >= this.colors.danger) {
        return 'danger'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.progress-container {
  align-items: center;
  .progress {
    margin-bottom: 0 !important;
  }
  .progress + span {
    min-width: 36px;
    text-align: right;
  }
}
</style>
