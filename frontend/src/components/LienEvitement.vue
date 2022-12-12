<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'LienEvitement',
  data () {
    return {
      links: [
        {
          id: 'contenu',
          text: 'Contenu',
        },
        {
          id: 'button-menu-header',
          text: 'Menu',
        },
        {
          id: 'footer',
          text: 'Pied de page',
        },
      ],
    }
  },
})
</script>

<template>
  <DsfrSkipLinks :links="links" />
</template>
