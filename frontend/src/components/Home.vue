<template>
  <section class="section" id="home">
    <div class="container">
      <div class="columns is-multiline is-9">
        <div class="column is-half" v-for="c in conf" :key="c.key">
          <router-link class="hero is-link box" :to="{ name: 'home', params: { conf: c}}">
            <div class="hero-body">
              <div class="container">
                <h1 class="title">
                  {{ c }}
                </h1>
              </div>
            </div>
          </router-link>
        </div>
        <div class="column is-half">
          <a class="hero is-light box" 
            <div class="hero-body">
              <div class="container">
                <h1 class="title">
                  <span class="icon custom-margin-right-8"><i class="fa fa-plus" aria-hidden="true"></i></span>
                  <span>{{ localization.new[lang] }}</span>
                </h1>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

  </section>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      conf: []
    }
  },
  computed: {
    orderedProjects () {
      return this.$lodash.sortBy(this.projects)
    }
  },
  created () {
    this.$http.get(this.apiUrl + 'conf')
      .then(response => {
        this.conf = Object.keys(response.body)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
