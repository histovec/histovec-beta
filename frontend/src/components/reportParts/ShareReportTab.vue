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
          Vous pouvez transmettre <b>le lien du rapport</b> à votre acheteur potentiel.
          <br />
          <br />
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
    </div>
  </div>
</template>

<script>

import QrcodeVue from 'qrcode.vue'
import { mailTo } from '@/utils/email.js'
import { getShareReportEmail } from '@/utils/dynamicEmail.js'

export default {
  components: {
    QrcodeVue,
  },
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      notifSuccess: false,
      timerNotifSuccess: 10000,
    }
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
    },
  },
}

</script>