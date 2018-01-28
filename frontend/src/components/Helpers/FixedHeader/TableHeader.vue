<template>
  <thead :style="style" class="bring-front">
    <tr>
      <th class="head-centered" v-show="view.display">{{view.column_name}}</th>
      <th
        v-for="column in columns"
        v-show="column.display"
        :class="column.appliedClass ? column.appliedClass.head : ''"
      >
        {{column.label}}
      </th>
      <th class="head-centered" v-show="actions.display">{{actions.action.label}}</th>
      <th class="head-centered" v-show="actions.display">{{actions.done.label}}</th>
    </tr>
  </thead>
</template>

<script>
  import Vue from 'vue'

  export default {
    props: {
      columns: {
        type: Array,
        required: true
      },
      scrollContainer: {
        type: String,
        required: true
      },
      actions: {
        type: Object,
        required: true
      },
      view: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        style: { position: 'static', 'background-color': '#FFF' },
        sticky: false
      }
    },
    mounted () {
      this.$table = this.$el.parentNode
      this.createReferenceHeader()
    },
    methods: {
      createReferenceHeader () {
        this.$referenceHeader = this.$el.cloneNode(true)
        this.$referenceHeader.style.display = 'none'
        this.$table.insertBefore(this.$referenceHeader, this.$el.nextSibling)
      },
      justify () {
        Vue.nextTick(() => {
          const scrollContainerEl = document.querySelector(this.scrollContainer)
          const scrollContainerElRect = scrollContainerEl.getBoundingClientRect()

          this.style.width = this.$table.clientWidth + 'px'
          this.style.top = scrollContainerElRect.top + 'px'
        })
      },
      stick () {
        if (!this.sticky) {
          this.sticky = true
          this.style.position = 'fixed'
          this.$referenceHeader.style.display = null

          Vue.nextTick(() => {
            const stickyHeaders = this.$table.querySelectorAll('thead th')
            const referencedHeaders = this.$referenceHeader.querySelectorAll('th')
            referencedHeaders.forEach((th, i) => {
              stickyHeaders[i].style.minWidth = window.getComputedStyle(th).width
              stickyHeaders[i].style.maxWidth = window.getComputedStyle(th).width
            })
          })
        }
      },
      release () {
        if (this.sticky) {
          this.sticky = false
          this.style.position = 'static'
          this.$referenceHeader.style.display = 'none'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bring-front {
    z-index: 21;
  }
</style>
