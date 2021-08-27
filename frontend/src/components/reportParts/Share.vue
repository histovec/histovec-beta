<template>
  <div
    class="pv-30 ph-20 feature-box bordered_spec text-center"
    style="background: white;"
  >
    <div class="row">
      <!-- debut alerte verte -->
      <div
        v-show="notifSuccess"
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
          Vous pouvez transmettre le lien du rapport à votre acheteur potentiel.
          Un lien transmis durant le mois courant sera accessible jusqu'au 8 du mois suivant.
          <br />
          (<b>Ex:</b> un lien transmis le <b>18/01/2019</b> sera accessible jusqu'au <b>08/02/2019</b>)
          <br />
        </p>

        <p class="text-center">
          <button
            v-clipboard:copy="url"
            class="btn radius-30 btn-dark btn-animated btn"
            @click="showNotifSuccess"
          >
            Copier le lien du rapport
            <i class="fa fa-copy"></i>
          </button>
          &nbsp;
          <a
            class="btn radius-30 btn-default btn-animated btn"
            :href="shareReportEmail"
            @click="logReportMailDispatch"
          >
            Envoyer le rapport à un acheteur
            <i class="fa fa-send"></i>
          </a>
        </p>
      </div>
      <div class="row">
        <div class="col-md-12">
          Ou partager le rapport par QR code :
          <p></p>
        </div>
      </div>
      <!-- <div class="separator"></div> -->
      <div class="row">
        <div
          class="col-md-12"
          style="fload: none; margin: 0 auto;"
        >
          <qrcode-vue
            :value="url"
            :size="150"
            level="L"
          >
          </qrcode-vue>
        </div>
      </div>
      <!-- Unplugged feature for now
      <div class="col-md-12 p-h-10">
        <p>
          Vous pouvez transmettre votre <b>code de partage HistoVec</b> à nos partenaires afin qu'ils puissent utiliser les informations de votre véhicule pour vous fournir un service.
          <br />
          Ce code de partage HistoVec ne donne accès à vos données que jusqu'au 8 du mois suivant (tout comme le lien permettant le partage de votre rapport HistoVec).
          <br />
          Votre <b>code partage HistoVec</b> est :  <b>{{ codePartageHistoVec }}</b>
          <br />
        </p>

        <p class="text-center">
          <button
            v-clipboard:copy="codePartageHistoVec"
            class="btn radius-30 btn-dark btn-animated btn"
            @click="showNotifSuccess"
          >
            Copier le code partage HistoVec
            <i class="fa fa-copy"></i>
          </button>
        </p>
      </div> -->
    </div>
  </div>
</template>

<script>

import QrcodeVue from 'qrcode.vue'
import { mailTo } from '../../utils/email'
import { getShareReportEmail } from '../../utils/dynamicEmail'
import { urlSafeDecode } from '../../utils/encoding.js'

export default {
  components: {
    QrcodeVue
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    holder: Boolean
  },
  data () {
    return {
      notifSuccess: false,
      timerNotifSuccess: 10000
    }
  },
  computed: {
    codePartageHistoVec () {
      // key is not urlSafe encoded by DATA pipeline while encrypting sivData
      // By urlSafeDecoding key now, we make key ready to use once received by the public-backend
      const key = urlSafeDecode(this.$store.state.histovec.key)

      return `${this.$store.state.histovec.id}-${key}`


    },
  },

  created () {
    const SHARE_REPORT_EMAIL = getShareReportEmail({reportUrl: this.url})
    this.shareReportEmail = mailTo(SHARE_REPORT_EMAIL)
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/share`)
  },
  methods: {
    logReportMailDispatch () {
      this.$store.dispatch('log', `${this.$route.path}/share/mail`)
    },
    showNotifSuccess () {
      this.$store.dispatch('log', `${this.$route.path}/share/copy`)

      this.notifSuccess = true
      setTimeout(() => {
        this.notifSuccess = false
      }, this.timerNotifSuccess)
    }
  }
}

</script>