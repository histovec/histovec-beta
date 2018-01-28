<template>
  <div id="navigationWrapper">
    <nav class="navbar is-transparent">
        <router-link class="logo" :to="{ name: 'root'}">
          <img class="logo custom-margin-right-8" src="../assets/img/logo.svg">
          <span class="logo custom-margin-right-8"/>
        </router-link> 
      <div class="navbar-brand">

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link is-active">
            <span class="icon"><i class="fa fa-globe"></i></span>
          </a>
          <div class="navbar-dropdown is-boxed">
            <a
              class="navbar-item"
              v-for="availableLang in langs"
              :key="availableLang.key"
              :class="{'is-active' : availableLang === lang}"
              @click="changeLang(availableLang)"
            >
              {{ availableLang.toUpperCase() }}
            </a>
          </div>
        </div>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <div class="navbar-item has-dropdown is-hoverable">
            <router-link
              :to="{ name: 'home'}"
              class="navbar-link"
            >
              <span class="icon"><i class="fa fa-play" aria-hidden="true"></i></span>
              <span>{{localization.navbar.static.name[lang]}}</span>
            </router-link>

            <div class="navbar-dropdown is-boxed is-overflowed-y"  :style="dropdownMaxHeight">
              <div class="dropdown-item">
                <h6 class="title is-6 has-text-primary">{{localization.navbar.static.first_item[lang]}}</h6>
              </div>
              <hr class="dropdown-divider">
              <div class="dropdown-item">
                <h6 class="title is-6 has-text-primary">{{localization.navbar.static.second_item[lang]}}</h6>
              </div>              
            </div>
          </div>

          <div class="navbar-item has-dropdown is-hoverable">
            <router-link
              :to="{ name: 'home'}"
              class="navbar-link"
            >
              <span class="icon">
                <i class="fa fa-connectdevelop" aria-hidden="true"></i>
              </span>
              {{localization.navbar.dynamic.name[lang]}}
            </router-link>

            <div class="navbar-dropdown is-boxed is-overflowed-y" :style="dropdownMaxHeight">
              <a
                class="navbar-item has-text-info"
              >
                <span class="icon">
                  <i class ="fa fa-plus"></i>
                </span>
                {{ localization.new[lang] }}
              </a>

              <hr class="dropdown-divider">

              <a
                class="navbar-item has-text-info"
                @click="getConf();"
              >
                <span class="icon">
                  <i class ="fa fa-refresh"></i>
                </span>
                {{ localization.global.refresh_list[lang] }}
              </a>

              <hr class="dropdown-divider">

              <div class="has-text-centered" v-if="loadingConf">
                <span class="icon has-text-black-bis is-medium">
                  <i class="fa fa-spinner fa-2x fa-spin"></i>
                </span>
              </div>

              <router-link
                class="navbar-item"
                v-else
                v-for="conf in orderedConf"
                :key="conf.key"
                :class="{'is-active' : project === $route.params.project}"
                :to="{ name: 'project', params: { project: project}}"
              >
                {{ conf }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item breadcrumb">
            <ul>
              <li>
                <span class="icon has-text-info">
                  <i
                    class="fa fa-connectdevelop custom-clickable"
                  ></i>
                </span>

              </li>

              <li v-if="$route.params.recipe || $route.params.dataset">
                <a class="custom-unclickable">
                  {{ $route.params.recipe ? $route.params.recipe : '' }}{{ $route.params.dataset ? $route.params.dataset : '' }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    let maxHeightCalc = window.screen.availHeight - 200
    return {
      langs: [],
      dropdownMaxHeight: {maxHeight: maxHeightCalc + 'px'},
      conf: [],
      loadingConf: true,
      interval: 3000,
      clickPossible: true
    }
  },
  mounted () {
    this.langs = this.localization.available

    this.changeLang(this.lang)

    this.getConf()

    window.bus.$on('reloadNav', () => {
      this.getConf()
    })
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  watch: {
    '$route.name' (newVal) {
      if (newVal === 'conf') {
        this.interval.status = setInterval(() => {
          this.getConf()
        }, 3000)
      } else {
        clearInterval(this.interval)
      }
    }
  },
  computed: {
    orderedConf () {
      return this.$lodash.sortBy(this.conf)
    }
  },
  methods: {
    changeLang (newLang) {
      this.lang = newLang
      window.bus.$emit('langChange', this.lang)
    },
    getConf () {
      this.loadingConf = true
      this.$http.get(this.apiUrl + 'conf')
        .then(response => {
          this.conf = Object.keys(response.body)
          setTimeout(() => { this.loadingConf = false }, 500)
        })
    }
  }
}
</script>

<style scoped lang="scss">
a.logo {
  line-height: 0;
    }
</style>
