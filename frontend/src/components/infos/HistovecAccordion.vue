<template>
  <ul class="panel-group collapse-style-2">
    <HistovecAccordionItem
      v-for="item in content"
      :key="item.id"
      :title="item.title"
      :active="active === item.id"
      :body="item.body"
      :callbacks="item.callbacks"
      :react="item.react"
      @click="activate(item.id)"
    />
  </ul>
</template>

<script>
import HistovecAccordionItem from '@/components/infos/HistovecAccordionItem.vue'

export default {
  components: {
    HistovecAccordionItem,
  },

  props: {
    content: {
      type: Array,
      required: true,
    },
    initialActive: {
      type: String,
      default: '',
    },
  },

  data() {
    return { active: this.initialActive }
  },

  methods: {
    activate(id) {
      this.$emit('click', id)
      this.active = id
    },
  },
}
</script>

<style scoped>
.panel-group {
  list-style: none;
  padding-left: 0;
}
</style>
