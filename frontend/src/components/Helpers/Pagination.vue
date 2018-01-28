<template>
  <nav
    v-if="maxPage > 1"
    class="field pagination is-narrow is-small is-centered"
  >
    <a
      class="pagination-previous is-paddingless is-marginless"
      @click="setPageCurrent(pageCurrent > 1 ? pageCurrent - 1 : pageCurrent)"
    >
      <span class="icon is-small"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
    </a>
    <a
      class="pagination-next is-paddingless is-marginless"
      @click="setPageCurrent(pageCurrent < maxPage ? pageCurrent + 1 : pageCurrent)"
    >
      <span class="icon is-small"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
    </a>
    <ul class="pagination-list">
      <li>
        <a
          class="pagination-link"
          :class="{'is-current' : 1 === pageCurrent}"
          @click="setPageCurrent(1)"
        >1</a>
      </li>
      <template v-if="maxPage <= 7">
        <li v-for="n in maxPage - 1" v-if="n > 1">
          <a
            class="pagination-link"
            :class="{'is-current' : n === pageCurrent}"
            @click="setPageCurrent(n)"
          >{{n}}</a>
        </li>
      </template>
      <template v-else>
        <li v-if="pageCurrent > 4"><span class="pagination-ellipsis">&hellip;</span></li>
        <template v-if="pageCurrent > 4 && pageCurrent < maxPage - 3">
          <li><a class="pagination-link" @click="setPageCurrent(pageCurrent - 1)">{{pageCurrent - 1}}</a></li>
          <li><a class="pagination-link is-current">{{pageCurrent}}</a></li>
          <li><a class="pagination-link" @click="setPageCurrent(pageCurrent + 1)">{{pageCurrent + 1}}</a></li>
        </template>
        <template v-else>
          <li v-for="n in 4">
            <a
              class="pagination-link"
              :class="{'is-current' : n + 1 === pageCurrent}"
              v-if="pageCurrent <= 4"
              @click="setPageCurrent(n + 1)"
            >{{n + 1}}</a>
            <a
              class="pagination-link"
              :class="{'is-current' : maxPage - (4 - n) - 1 === pageCurrent}"
              v-else
              @click="setPageCurrent(maxPage - (4 - n) - 1)"
            >{{maxPage - (4 - n) - 1}}</a>
          </li>
        </template>
        <li v-if="pageCurrent < maxPage - 3"><span class="pagination-ellipsis">&hellip;</span></li>
      </template>
      <li>
        <a
          class="pagination-link"
          :class="{'is-current' : maxPage === pageCurrent}"
          @click="setPageCurrent(maxPage)"
        >{{maxPage}}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    pageSize: Number,
    lengthData: Number
  },
  data () {
    return {
      pageMax: 1,
      pageCurrent: 1
    }
  },
  computed: {
    maxPage () {
      let resultPage = this.lengthData / this.pageSize
      let floorPage = Math.floor(resultPage)
      return resultPage === floorPage ? floorPage : floorPage + 1
    }
  },
  methods: {
    setPageCurrent (page) {
      this.pageCurrent = page
      this.$emit('pageChanged', page)
    }
  }
}
</script>
