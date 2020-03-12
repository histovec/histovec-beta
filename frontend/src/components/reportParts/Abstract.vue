<template>
  <div
    class="container-fluid"
  >
    <div
      v-if="holder"
      class="row"
    >
      <div class="col-md-7">
        <h6 class="title p-h-15">
          Impression CSA
        </h6>
      </div>
    </div>
    <div
      v-if="holder"
      class="row"
    >
      <div class="col-md-1 col-sm-2">
        <i class="fa fa-print fa-3x"></i>
      </div>
      <div class="col-md-10 col-sm-10">
        <div class="txt-small-13">
          Pour imprimer le <span class="info_red">Certificat de Situation Administrative</span>
          (<b>certificat de non gage</b>),
          <br>
          <a
            class="alert-link clickable btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
            @click="changeTab('csa')"
          >
            rendez-vous ici<i class="fa fa-external-link pl-5"></i>
          </a>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-7">
        <h6 class="title p-h-35">
          Résumé
        </h6>
      </div>
      <div class="col-md-4">
        <h6 class="title p-h-35">
          Informations utiles
        </h6>
      </div>
    </div>
    <div class="separator-2 separator-lg"></div>
    <div class="row">
      <!-- debut voiture  -->
      <div class="col-sm-1">
        <i :class="'fa fa-' + v.logoVehicule + ' fa-2x'"></i>
      </div>
      <div class="col-sm-6">
        <span class="info_red txt-small-13">{{ v.ctec.marque }} {{ v.ctec.modele }}</span>
        <br />
        <div v-if="v.ctec.puissance.cv">
          <span class="txt-small-13">Puissance fiscale : </span>
          <span class="info_red txt-small-13">{{ v.ctec.puissance.cv }} ch</span>
        </div>
      </div>
      <div
        v-if="!holder"
        class="col-sm-5"
      >
        <span class="color-info_2 bold_4 txt-small-13">Calculez le montant de votre certificat d'immatriculation</span>
        <br />
        <a
          href="https://siv.interieur.gouv.fr/map-usg-ui/do/simtax_accueil"
          class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
          title="Simulateur"
          target="_blank"
        >
          Accédez au simulateur de calcul
          <i class="fa fa-external-link pl-10"></i>
        </a>
      </div>
      <!-- fin voiture  -->
    </div>
    <!-- debut trait separation  -->
    <div class="separator-2 separator-lg">
    </div>
    <!-- fin trait separation  -->
    <!-- debut trait separation  -->
    <div v-if="v.usages.length">
      <div
        v-for="(usage, index) in v.usages"
        :key="index"
      >
        <div
          v-if="usagesMapping[usage]"
          class="row"
        >
          <!-- debut voiture  -->
          <div class="col-sm-1">
            <i :class="'fa ' + usagesMapping[usage].icon + ' fa-2x'"></i>
          </div>
          <div class="col-sm-6">
            <span class="txt-small-13">Usage:</span>
            <span class="info_red txt-small-13"> {{ usagesMapping[usage].text }} </span>
            <br />
          </div>
          <div
            v-if="usagesMapping[usage].adv"
            class="col-sm-5"
          >
            <span class="color-info_2 bold_4 txt-small-13">{{ usagesMapping[usage].adv }}</span>
            <br />
            <a
              v-if="usagesMapping[usage].adv"
              :href="usagesMapping[usage].link"
              class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
              :title="usagesMapping[usage].adv"
              target="_blank"
            >
              En savoir plus
              <i class="fa fa-external-link pl-10"></i>
            </a>
          </div>
          <!-- fin voiture  -->
        </div>
        <div
          v-if="usagesMapping[usage]"
          class="separator-2 separator-lg"
        >
        </div>
      </div>
    </div>
    <!-- fin trait separation  -->
    <div class="row">
      <!-- debut proprietaire  -->
      <div class="col-sm-1">
        <i class="fa fa-address-card fa-2x pr-10"></i>
      </div>
      <div class="col-sm-6">
        <span class="txt-small-13">Propriétaire actuel : </span><span class="info_red txt-small-13">{{ v.titulaire.identite }} depuis {{ v.certificat.depuis }} </span>
      </div>
      <div class="col-sm-5">
        <div v-if="!v.certificat.etranger">
          <div v-if="holder">
            <span class="color-info_2 bold_4 txt-small-13">Vous êtes le </span>
            <span class="info_red txt-small-13">{{ v.titulairesCount }}</span><sup class="info_red txt-small">{{ getExposant(v.titulairesCount) }}</sup>
            <span class="color-info_2 bold_4 txt-small-13"> titulaire de ce véhicule</span>
          </div>
          <div v-if="!holder">
            <span class="color-info_2 bold_4 txt-small-13">Ce véhicule a déjà eu </span>
            <span class="info_red txt-small-13">{{ v.titulairesCount }}</span>
            <span class="color-info_2 bold_4 txt-small-13"> titulaire(s), en l'achetant vous serez le </span>
            <span class="info_red txt-small-13">{{ v.titulairesCount + 1 }}</span>
            <sup class="info_red txt-small">{{ getExposant(v.titulairesCount + 1) }}</sup>
          </div>
        </div>
        <div v-if="v.certificat.etranger">
          <span class="color-info_2 bold_4 txt-small-13">Le nombre exact de titulaires ne peut être calculé avec précision </span>
          <span class="color-info_2 bold_4 txt-small-12">(première immatriculation à l'étranger)</span>
        </div>
      </div>
      <!-- fin proprietaire  -->
    </div>
    <!-- debut trait separation  -->
    <div class="separator-2 separator-lg">
    </div>
    <!-- fin trait separation  -->
    <div class="row">
      <!-- debut immatriculation  -->
      <div class="col-sm-1">
        <i class="fa fa-calendar fa-2x pr-10"></i>
      </div>
      <div class="col-sm-6">
        <span class="txt-small-13">Première immatriculation le </span>
        <span class="info_red txt-small-13">{{ v.certificat.premier }}</span>
        <br />
        <br />
      </div>
      <div class="col-sm-5"></div>
      <!-- fin immatriculation  -->
    </div>
    <!-- debut trait separation  -->
    <div class="separator-2 separator-lg">
    </div>
    <!-- fin trait separation  -->

    <div v-if="v.etranger.hasBeenImported">
      <div class="row">
        <!-- debut immatriculer  -->
        <div class="col-sm-1">
          <i class="fa fa fa-globe fa-2x pr-10"></i>
        </div>
        <div class="col-sm-6">
          <span class="txt-small-13">Ce véhicule a été </span> <span class="info_red txt-small-13">importé</span>
        </div>
        <div class="col-sm-5">
          <span
            v-if="!holder"
            class="color-info_2 bold_4 txt-small-13"
          >
            Vérifier les options incluses qui peuvent être différentes
          </span>
        </div>
        <!-- fin immatriculer  -->
      </div>
      <!-- debut trait separation  -->
      <div class="separator-2 separator-lg"></div>
      <!-- fin trait separation  -->
    </div>


    <div v-if="v.hasSinistre || v.administratif.hasPve">
      <div class="row">
        <!-- debut sinistre  -->
        <div class="col-sm-1">
          <i
            :class="[{'fa fa-thumbs-up fa-2x pr-10' : v.isApte},
                     {'fa fa-exclamation-triangle info_red fa-2x pr-10' : !v.isApte}]"
          >
          </i>
        </div>
        <div class="col-sm-6">
          <!-- état - un seul sinistre !-->
          <span v-if="v.sinistresCount === 1 || (v.sinistresCount === 0 && v.administratif.hasPve)">
            <span class="txt-small-13">Ce véhicule a eu </span>
            <span class="info_red txt-small-13">un sinistre déclaré</span>
            <span
              v-if="v.sinistresCount === 1"
              class="txt-small-13"
            >
              en {{ v.lastSinistreYear }}
            </span>
            <br />
            <span v-if="v.isApte">
              <span class="txt-small-13">et</span>
              <span class="info_red txt-small-13"> déclaré apte à circuler</span>
              <span
                v-if="!v.isApte"
                class="txt-small-13"
              >
                en {{ v.lastResolutionYear }}
              </span>
            </span>
          </span>
          <!-- état - plusieurs sinistres !-->
          <span v-if="v.sinistresCount > 1">
            <span class="txt-small-13">Ce véhicule a eu </span>
            <span class="info_red txt-small-13">plusieurs sinistres, </span>
            <span class="txt-small-13">dont le dernier déclaré en {{ v.lastSinistreYear }}</span>
            <br />
            <span v-if="v.isApte">
              <span class="txt-small-13">Le véhicule a été</span>
              <span class="info_red txt-small-13"> déclaré apte à circuler</span>
              <span
                v-if="!v.isApte"
                class="txt-small-13"
              >
                en {{ v.lastResolutionYear }}
              </span>
            </span>
          </span>
          <a
            class="clickable btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
            @click="changeTab('history')"
          >
            Détails
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </div>

        <div class="col-sm-5">
          <!-- commentaire: un ou plusieurs sinistres !-->
          <span
            v-if="v.isApte"
            class="color-info_2 bold_4 txt-small-13"
          >
            {{ syntheseMapping[(holder ? 'fin_ove_vendeur' : 'fin_ove_acheteur')].adv }}
          </span>
          <span
            v-else
            class="color-info_2 bold_4 txt-small-13"
          >
            {{ syntheseMapping['ove'].adv }}
          </span>

          <br />
          <span
            v-if="v.hasSinistre && v.sinistres.length > 1"
            class="color-info_2 bold_4 txt-small-13"
          >
            {{ syntheseMapping['multi_ove'].adv }}
          </span>
        </div>
        <!-- fin sinistre  -->
      </div>
      <!-- debut trait separation  -->
      <div class="separator-2 separator-lg"></div>
      <!-- fin trait separation  -->
    </div>
    <div v-if="synthese.length === 0 && !v.lastSinistreYear">
      <div class="row">
        <!-- debut ras  -->
        <div class="col-sm-1">
          <i class="fa fa-check info_green fa-2x"></i>
        </div>
        <div class="col-sm-6">
          <span class="info_red txt-small-13">Rien à signaler </span>
          <span class="txt-small-13">du point de vue administratif
            <br />
            (gages, opposition, vol,...)
          </span>
        </div>
        <div
          v-if="false"
          class="col-sm-5"
        >
          <span class="color-info_2 bold_4 txt-small-13">Demandez au Vendeur un Certificat de Situation Administratif détaillé</span>
        </div>
        <!-- fin ras  -->
      </div>
      <!-- debut trait separation  -->
      <div class="separator-2 separator-lg"></div>
      <!-- fin trait separation  -->
    </div>
    <div
      v-for="(entry, index) in synthese"
      :key="index"
    >
      <div class="row info_red">
        <div class="col-sm-1">
          <i
            class="fa fa-2x pr-10"
            :class="syntheseMapping[entry].icon"
          >
          </i>
        </div>
        <div class="col-sm-6 txt-small-13">
          {{ syntheseMapping[entry].text }}
          <br />
          <a
            class="clickable btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
            @click="changeTab('situation')"
          >
            Détails
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </div>
        <div class="col-sm-5 color-info_2 bold_4 txt-small-13">
          {{ syntheseMapping[entry].adv }}
          <br />
          <a
            v-if="syntheseMapping[entry].link"
            :href="syntheseMapping[entry].link"
            target="_blank"
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
          >
            En savoir plus
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </div>
      </div>
      <!-- debut trait separation  -->
      <div class="separator-2 separator-lg"></div>
      <!-- fin trait separation  -->
    </div>
    <div>
      <div
        v-if="v.vignetteNumero"
        class="row"
      >
        <!-- debut ras  -->
        <div class="col-sm-1">
          <img
            class="img-responsive"
            :src="'assets/images/vignettes_crit_air/35_petit/vignette_' + v.vignetteNumero + '.png'"
          >
        </div>
        <div class="col-sm-6">
          <span class="txt-small-13"> {{ syntheseMapping['critair'].text }} {{ v.vignetteNumero }}</span>
        </div>
        <div class="col-sm-5 color-info_2 bold_4 txt-small-13">
          {{ syntheseMapping['critair'].adv }}
          <br />
          <a
            v-if="syntheseMapping['critair'].link"
            :href="syntheseMapping['critair'].link"
            target="_blank"
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
          >
            En savoir plus
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </div>
        <!-- fin ras  -->
      </div>
      <div
        v-if="!v.vignetteNumero && !v.usages.includes('COL')"
        class="row"
      >
        <!-- debut pas de critair  -->
        <div class="col-sm-1">
          <i class="fa fa-ban fa-2x"></i>
        </div>
        <div class="col-sm-6">
          <span class="txt-small-13">Votre véhicule ne répond pas aux critères retenus pour l'attribution d'une vignette Crit'air ou les informations dont nous disposons sont insuffisantes</span>
        </div>
        <div class="col-sm-5 color-info_2 bold_4 txt-small-13">
          {{ syntheseMapping['critair'].adv }}
          <br />
          <a
            v-if="syntheseMapping['critair'].link"
            :href="syntheseMapping['critair'].link"
            target="_blank"
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
          >
            En savoir plus
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </div>
        <!-- fin ras  -->
      </div>
    </div>
    <div v-if="$store.state.config.allTabs">
      <br />
    </div>
  </div>
</template>

<script>

import { formatMixin } from '../../mixins/format.js'

export default {
  mixins: [formatMixin],
  props: {
    v: {
      type: Object,
      default: () => {}
    },
    holder: Boolean,
    changeTab: {
      type: Function,
      default: () => {}
    },
  },
  computed: {
    synthese () {
      return this.v.administratif.reportLabels.synthese
    }
  },

  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/synthesis`)
  },
}

</script>


logoVehicule
ctec
