<template>
  <div id="app">
    <!-- debut entete -->
    <div
      v-for="(entry, index) in $store.state.configEnabler"
      :key="index"
    >
      <div
        v-shortkey="$store.state.configEnabler[index]"
        @shortkey="$store.commit('toggleConfig', index)"
      >
      </div>
    </div>
    <div class="header-container">
      <header class="header">
        <div class="container">
          <div class="row">
            <div class="col-md-8">
              <div class="row">
                <div class="header-left clearfix">
                  <!-- debut bandeau -->
                  <div class="logo col-xs-offset-1 col-xs-3 col-md-offset-1 col-md-3">
                    <router-link
                      :to="{ name: 'home' }"
                    >
                      <img
                        alt="accueil"
                        :src="logoMinistereInterieur"
                        width="140px"
                        class="img-responsive"
                      >
                    </router-link>
                  </div>
                  <div class="logo shift-logo-histovec col-xs-7 col-md-7">
                    <router-link
                      :to="{ name: 'home' }"
                    >
                      <img
                        alt="accueil"
                        :src="imageHistovecHeaderMobileSansMarianne"
                        class="img-responsive"
                      >
                    </router-link>
                  </div>
                </div>
                <!-- fin bandeau -->
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
    <contact-modal></contact-modal>
    <rating-modal></rating-modal>
    <!-- fin entete -->
    <router-view></router-view>
    <!-- footer start -->
    <footer
      id="footer"
      class="clearfix dark"
    >
      <!-- .footer start -->
      <div class="footer">
        <div class="container">
          <div class="footer-inner">
            <div class="row">
              <div class="col-md-3">
                <div class="footer-content">
                  <h4 class="title">
                    Liens utiles
                  </h4>
                  <div class="separator-2"></div>
                  <div class="btn btn-mon-avis">
                    <a
                      title="Contactez-nous"
                      @click="toggleContactModal()"
                    >
                      Contactez-nous
                      <i class="fa fa-comments"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="footer-content">
                  <h4 class="title">
                    Un service proposé par
                  </h4>
                  <div class="separator-2"></div>
                  <div class="row grid-space-12">
                    <div class="col-xs-2 col-md-4 p-g-17">
                      <div class="overlay-container">
                        <img
                          class="img-responsive"
                          width="125px"
                          :src="logoMinistereInterieur"
                          alt="Ministère de l'Intérieur"
                        >
                        <a
                          class="overlay-link small"
                          href="https://www.interieur.gouv.fr/"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                        </a>
                      </div>
                    </div>
                    <div class="shift-logo-securite-routiere col-xs-6 col-md-6 m-h-14">
                      <div class="overlay-container">
                        <img
                          class="img-responsive"
                          width="110px"
                          :src="logoSecuriteRoutiere"
                          alt="sécurité routière, tous responsables"
                        >
                        <a
                          class="overlay-link small"
                          href="http://www.securite-routiere.gouv.fr/la-securite-routiere/actualites"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="footer-content">
                  <h4 class="title">
                    Comment ça marche ?
                  </h4>
                  <div class="separator-2"></div>
                  <router-link
                    tag="button"
                    class="btn btn-mon-avis"
                    :to="{ name: 'faq' }"
                  >
                    Besoin d'aide
                    <i class="fa fa-life-ring"></i>
                  </router-link>
                </div>
              </div>

              <div class="col-md-3">
                <div class="footer-content">
                  <h4 class="title">
                    Réseaux sociaux
                  </h4>
                  <div class="separator-2"></div>
                  <ul class="social-links circle animated-effect-1">
                    <li class="facebook">
                      <a
                        href="https://www.facebook.com/Histovec/"
                        rel="noopener noreferrer"
                        target="_blank"
                        title="facebook"
                      >
                        <i class="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li class="twitter">
                      <a
                        href="https://twitter.com/histovec"
                        rel="noopener noreferrer"
                        target="_blank"
                        title="twitter"
                      >
                        <i class="fa fa-twitter"></i>
                      </a>
                    </li>
                  </ul>
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
                <p class="text-center">
                  {{ appName }} version bêta {{ appVersion }} - copyright &copy; 2018
                  <a href="legal-notice">Mentions légales</a> et <a href="information-notices">Mentions d'information</a>
                </p>
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

import npmConf from '../package.json'
import apiConf from '@/assets/json/backend.json'
import localization from '@/assets/json/lang.json'
import syntheseMapping from '@/assets/json/synthese.json'
import statusMessages from '@/assets/json/status.json'
import usagesMapping from '@/assets/json/usages.json'
import contact from '@/assets/json/contact.json'

import imageHistovecHeaderMobileSansMarianne from '@/assets/img/histovec_header_mobile_sans_marianne.png'
import logoMinistereInterieur from '@/assets/img/logo_mi.png'
import logoSecuriteRoutiere from '@/assets/img/securite_routiere.png'

import VueTheMask from 'vue-the-mask'
import VueClipboard from 'vue-clipboard2'
import ContactModal from './components/forms/ContactModal.vue'
import RatingModal from './components/forms/RatingModal.vue'


Vue.use(VueTheMask)
Vue.use(VueClipboard)

import lodash from 'lodash'

Vue.prototype.$lodash = lodash

window.bus = new Vue()

Vue.mixin({
  data () {
    return {
      appName: process.env.VUE_APP_TITLE,
      usePreviousMonthForData: true,
      previousMonthShift: 1,
      outdatedData: false,
      showDataDate: false,
      appVersion: npmConf.version,
      apiUrl: apiConf.api.url.replace('<APP>', process.env.VUE_APP_TITLE).replace(/"/g, ''),
      localization,
      syntheseMapping,
      statusMessages,
      usagesMapping,
      lang: localization.default,

      // images
      imageHistovecHeaderMobileSansMarianne,
      logoMinistereInterieur,
      logoSecuriteRoutiere,
    }
  },

  created () {
    window.bus.$on('langChange', value => {
      this.lang = value
    })
  },
})

export default {
  name: 'App',
  components: {
    ContactModal,
    RatingModal,
  },
  methods: {
    toggleContactModal (subject = contact.subject.default) {
      this.$store.dispatch('toggleContactModal', { subject })
    }
  }

}
</script>

<style lang="scss" src="./assets/scss/style.scss"></style>
