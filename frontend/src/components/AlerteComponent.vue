<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AlerteComponent',
  props: {
    titre: {
      type: String,
      default: 'Titre de l\'alerte',
    },
    description: {
      type: String,
      default: 'Description de l\'alerte',
    },
    isAlerteOpened: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'success',
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  created() {
    setTimeout(() => this.$emit('close'), 5000);
  },
  methods: {
    fermerAlerte() {
      this.$emit('close')
    },
  },
})
</script>

<template>
  <div class="container-alerts__Sticky">
    <DsfrAlert
      :title="titre"
      :description="description"
      :type="type"
      :small="small"
      closeable
      @close="fermerAlerte"
    />
  </div>
</template>

<style scoped>
.container-alerts__Sticky {
  position: -webkit-sticky;
  position: sticky;
  z-index: 100000;
  top: 1rem;
  left: 0;
  width: 100%;
  background: var(--grey-1000-50);
}
</style>
