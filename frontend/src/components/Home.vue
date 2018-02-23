<template>
  <section class="section" id="home">
    <div class="container">
      <div class="columns is-multiline is-9">
        <div class="column is-half">
          <a class="hero is-light box"
            <div class="hero-body">
              <div class="container">
                <h1 class="title">
                  <upload></upload>
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

import Upload from './Upload'
export default {
  components: {
    Upload
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
