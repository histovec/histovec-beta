<template>
  <div
    v-if="erreurControlesTechniques"
    class="alert alert-icon alert-danger"
    role="alert"
  >
    <i class="fa fa-warning">
    </i>
    {{ erreurControlesTechniques }}
  </div>
</template>


<script>

export default {
  props: {
    erreurControlesTechniques: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/kilometers-error`)
  },
}

</script>
