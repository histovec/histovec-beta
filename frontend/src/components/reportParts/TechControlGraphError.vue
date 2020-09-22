<template>
  <div
    v-if="ctError"
    class="alert alert-icon alert-danger"
    role="alert"
  >
    <i class="fa fa-warning">
    </i>
    {{ ctError }}
  </div>
</template>


<script>

export default {
  props: {
    ctError: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/kilometers-error`)
  },
}

</script>
