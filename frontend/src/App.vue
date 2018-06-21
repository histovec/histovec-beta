<template>
  <div id="app">
    <!-- debut entete -->
    <div class="header-container">
      <header class="header">
        <div class="container">
          <div class="row">
            <div class="col-md-8">
              <div class="header-left clearfix">
                <!-- debut bandeau -->
                <div class="logo"><a href="home"><img @click="show = !show" src="assets/images/histovec-header-mobile.png" class="img-responsive" width="548" height="98"> </a></div>
                <!-- fin bandeau -->
              </div>
            </div>
            <!-- debut beta -->
            <div id="no-boot" class="col-xs-1"> <img src="assets/images/beta.png" class="img-responsive" width="100" height="100"></div>
            <!-- debut beta -->
          </div>
        </div>
      </header>
    </div>
    <!-- fin entete -->
    <router-view></router-view>
    <!-- footer start -->
    <footer id="footer" class="clearfix dark">
      <!-- .footer start -->
      <div class="footer">
        <div class="container">
          <div class="footer-inner">
            <div class="row">
              <div class="col-md-6">
                <div class="footer-content">
                  <h4 class="title">Liens utiles</h4>
                  <div class="separator-2"></div>
                  <!-- debut -->
                  <div class="media margin-clear">
                    <nav>
                      <ul class="nav nav-pills nav-stacked">
                        <li><a href="faq">FAQ</a></li>
                        <li><a href="contact">Contact</a></li>
                        <li><a href="feedback">Signaler une erreur</a></li>
                      </ul>
                    </nav>
                  </div>
                  <!-- fin -->
                </div>
              </div>
              <div class="col-md-6">
                <div class="footer-content">
                  <h4 class="title">Un service proposé par</h4>
                  <div class="separator-2"></div>
                  <div class="row grid-space-12">
                    <div class="col-md-2 p-b-10">
                      <div class="overlay-container"> <img class="img-responsive" src="assets/images/logos_metiers/logo_mi.png" alt="Ministère de l'Intérieur"> <a href="https://www.interieur.gouv.fr/" target="_blank" class="overlay-link small"></a> </div>
                    </div>
                    <div class="col-md-6 p-b-10">
                      <div class="overlay-container"><img class="img-responsive" src="assets/images/logos_metiers/securite_routiere_120.png" alt="Délégation à la sécurité routière"> <a href="http://www.securite-routiere.gouv.fr/la-securite-routiere/actualites" target="_blank" class="overlay-link small"></a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- .footer end -->
      <!-- .subfooter start -->
      <div class="subfooter">
        <div class="container">
          <div class="subfooter-inner">
            <div class="row">
              <div class="col-md-12">
                <p class="text-center">Copyright &copy; 2018 <a href="legal">Mentions légales</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- .subfooter end -->
    </footer>
    <!-- footer end -->
  </div>
</template>

<script>
import Vue from 'vue'

import apiConf from './assets/json/backend.json'
import localization from './assets/json/lang.json'
import operations from './assets/json/libelle_operations.json'
import verbatims from './assets/json/verbatims.json'

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

import lodash from 'lodash'

Vue.prototype.$lodash = lodash

window.bus = new Vue()

Vue.mixin({
  data () {
    return {
      apiUrl: apiConf.api.url.replace('<APP>', process.env.APP).replace(/"/g, ''),
      localization: localization,
      operations: operations,
      verbatims: verbatims,
      lang: localization.default,
      show: false
    }
  },
  mounted () {
    window.bus.$on('langChange', value => {
      this.lang = value
    })
  }
})

export default {
  name: 'app'
}
</script>

<style lang="scss" src="./assets/scss/style.scss"></style>
