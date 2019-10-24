<template>
  <div>
    <div>
      Historique des opérations en France
    </div>
    <div class="row">
      <div class="col-sm-4">
        <span class="txt-small-12"><h6>Date</h6></span>
      </div>
      <div class="col-sm-8">
        <span class="bold txt-small-12"><h6>Opération</h6></span>
      </div>
    </div>
    <div class="separator"></div>

    <div
      v-for="(entry, index) in v.historique"
      :key="index"
    >
      <div class="row">
        <div class="col-sm-2">
          <span class="txt-small-12">{{ entry.date }}</span>
        </div>
        <div class="col-sm-10">
          <span class="info_red txt-small-12">
            {{ entry.nature }}
            <span
              v-if="entry.numAgree"
            >
              n° d'agrément <b>{{ entry.numAgree }}</b> -
              <a
                  class="clickable text-info"
                  @click="numAgreeModal = true"
                >
                  En savoir plus
                  <i class="fa fa-info-circle fa-lg"></i>
              </a>
            </span>
          </span>
        </div>
      </div>
      <div class="separator pv-5"></div>
    </div>
    <div v-if="v.certificat.incertain">
      <div class="row">
        <div class="col-sm-2">
          <span class="txt-small-12">{{ v.certificat.fr }}</span>
        </div>
        <div class="col-sm-10">
          <span class="info_red txt-small-12"> Première immatriculation (source incertaine)</span>
        </div>
      </div>
      <div class="separator pv-5"></div>
    </div>
    <!-- fin tableau operation historique FR -->
    <br />
    <div v-if="v.certificat.etranger">
      Historique des opérations à l'étranger
    </div>
    <!-- debut tableau operation historique Etranger -->
    <div v-if="v.certificat.etranger">
      <div class="row">
        <div class="col-sm-4">
          <span class="txt-small-12"><h6>Date</h6></span>
        </div>
        <div class="col-sm-8">
          <span class="bold txt-small-12"><h6>Opération</h6></span>
        </div>
      </div>
      <div class="separator"></div>
      <div>
        <div class="row">
          <div class="col-sm-2">
            <span class="txt-small-12">{{ v.certificat.premier }}</span>
          </div>
          <div class="col-sm-10">
            <span class="info_red txt-small-12">Première immatriculation à l'étranger</span>
          </div>
        </div>
        <div class="separator pv-5"></div>
      </div>
    </div>

    <modal-helper
      v-if="numAgreeModal"
      @close="numAgreeModal = false"
    >
      <span slot="title">Plus d'infos à propos du numéro d'expert agréé</span>
      <div slot="body">
        <p>
          HistoVec n'a pas accès au rapport lié à un sinistre.
          <br>
          Pour obtenir plus de précisions, recherchez les coordonnées de l'expert en automobile via son <b>numéro d'agrément (ex: 012345-VE)</b> sur
          <a
            href="https://www.securite-routiere.gouv.fr/reglementation-liee-aux-modes-de-deplacements/en-voiture/experts-automobiles/carte-des-experts"
            target="_blank"
          >
            le site de la Sécurité Routière
          </a>,
          <br>
          en cliquant sur le lien <b>« Liste des experts »</b> (Cf image ci-dessous).
        </p>
        <img
          slot="body"
          alt="Indication localisation nom(s) et prénom(s) : sous le numéro d'immatriculation"
          :src="imageListeDesExperts"
          class="img-responsive"
          style="margin: 0 auto;"
          width="390px"
        >
        <!-- <span>Il est possible que votre n'expert ne soit pas dans la liste. Cela signifie alors qu'il n'exerce plus.
        Dans ce cas, ...</span> -->
      </div>
    </modal-helper>
  </div>
</template>

<script>

import ModalHelper from '../infos/ModalHelper'
import imageListeDesExperts from '@/assets/img/liste_des_experts.png'

export default {
  components: {
    ModalHelper
  },
  props: {
    v: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      numAgreeModal: false,
      imageListeDesExperts,
    }
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/history`)
  }
}

</script>
