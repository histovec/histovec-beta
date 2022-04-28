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
          <i class="fa fa-check"></i>Le code partage HistoVec a été copié
        </div>
      </div>
      <!-- fin alerte verte -->
      <div class="col-md-12 p-h-10">
        <p>
          <!-- @todo: change wording -->
          Vous pouvez transmettre le <b>code partage HistoVec</b> à nos partenaires afin qu'ils puissent utiliser les informations de votre véhicule pour vous fournir un service.
          <br />
          <br />
          Un code partage HistoVec transmis durant le mois courant sera accessible jusqu'au 8 du mois suivant.
          <br />
          (<b>Ex:</b> un code partage HistoVec transmis le <b>18/01/2019</b> sera accessible jusqu'au <b>08/02/2019</b>)
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
          &nbsp;
          <a
            class="btn radius-30 btn-default btn-animated btn"
            :href="shareCodePartageHistoVecEmail"
            @click="logCodePartageHistoVecMailDispatch"
          >
            Envoyer le code partage HistoVec à un partenaire
            <i class="fa fa-send"></i>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import { mailTo } from '@/utils/email.js'
import { getShareCodePartageHistoVecEmail } from '@/utils/dynamicEmail.js'

export default {
  props: {
    codePartageHistoVec: {
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
    const SHARE_CODE_PARTAGE_HISTOVEC_EMAIL = getShareCodePartageHistoVecEmail({codePartageHistoVec: this.codePartageHistoVec})
    this.shareCodePartageHistoVecEmail = mailTo(SHARE_CODE_PARTAGE_HISTOVEC_EMAIL)
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/share-code-partage`)
  },
  methods: {
    logCodePartageHistoVecMailDispatch () {
      this.$store.dispatch('log', `${this.$route.path}/share-code-partage/mail`)
    },
    showNotifSuccess () {
      this.$store.dispatch('log', `${this.$route.path}/share-code-partage/copy`)

      this.notifSuccess = true
      setTimeout(() => {
        this.notifSuccess = false
      }, this.timerNotifSuccess)
    },
  },
}

</script>