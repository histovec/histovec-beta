<template>
  <div
    class="pv-30 ph-20 feature-box bordered_spec text-center" 
    style="background: white"
  >
    <div class="row">
      <!-- debut alerte verte -->
      <div 
        v-if="notifSuccess"
        class="col-md-12"
      >
        <div 
          class="alert alert-icon alert-success"
          role="alert"
        >
          <i class="fa fa-check"></i>Le lien a été copié
        </div>
      </div>
      <!-- fin alerte verte -->
      <div class="col-md-12 p-h-10">
        <p>
          Vous pouvez transmettre à votre acheteur potentiel, le rapport que vous venez de consulter par mail.
          <br />
          Ce rapport sera accessible jusqu'au {{ validityDate }} 
          <br />
        </p>
        <p class="text-center">
          <button 
            v-clipboard:copy="url"
            class="btn radius-30 btn-dark btn-animated btn"
            @click="showNotifSuccess"
          >
            Copier le lien
            <i class="fa fa-copy"></i>
          </button>
          <a
            :href="'mailto:?subject=Rapport%20Histovec&body=' + mailBody"
            class="btn radius-30 btn-default btn-animated btn"
          >
            Courriel
            <i class="fa fa-send"></i>
          </a>
        </p>
      </div>
      <div class="row">
        <div class="col-md-12">
          Ou par QR code
          <p></p>
        </div>
      </div>
      <!-- <div class="separator"></div> -->
      <div class="row">
        <div
          class="col-md-12"
          style="fload: none; margin: 0 auto"
        >
          <qrcode-vue
            :value="url"
            :size="150"
            level="L"
          >
          </qrcode-vue>
        </div>
      </div>
      <!-- debut bouton imprimer csa detaille -->
      <div class="row">
        <div 
          v-if="holder&&display['pdf']"
          class="col-sm-12 pv-20" 
        >
          <csa
            :v="v"
            :url="url"
            :baseurl="baseurl"
          >
          </csa>
        </div>
      </div>
    <!-- fin bouton imprimer csa detaille -->
    </div>
  </div>
</template>

<script>

import Csa from './CSA.vue'
import QrcodeVue from 'qrcode.vue'
import moment from 'moment'

export default {
  components: {
    QrcodeVue,
    Csa
  },
  props: {
    v: {
      type: Object,
      default: () => {}
    },
    url: {
      type: String,
      default: ''
    },
    baseurl: {
      type: String,
      default: ''
    },
    holder: Boolean
  },
  data () {
    return {
      notifSuccess: false,
      timerNotifSuccess: 2000
    }
  },
  computed: {
    validityDate () {
      return moment().add(-7, 'days').add(2, 'months').date(0).format('DD/MM/YYYY')
    },
    mailBody () {
      var text = encodeURI('Un titulaire de véhicule vous transmet un rapport HistoVec\n\nRendez-vous sur le lien suivant pour le consulter: \n')
      return text + this.url.replace('&', '%26')
    }
  },
  methods: {
    showNotifSuccess () {
      this.notifSuccess = true
      setTimeout(() => {
        this.notifSuccess = false
      }, this.timerNotifSuccess)
    }
  }
}

</script>
