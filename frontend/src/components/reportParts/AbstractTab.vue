<template>
  <div
    class="container-fluid"
  >
    <div
      class="row"
    >
      <div class="col-md-3 col-sm-5">
        <a
          class="alert-link clickable btn-sm-link pop color-info_3 bold_4 txt-small-15 no-padding"
          href="https://urldefense.com/v3/__https://www.securite-routiere.gouv.fr/reglementation-liee-aux-modes-de-deplacements/immatriculation-des-vehicules/lapplication-simplimmat__;!!AaIhyw!402trV61GnNGBOc6PZbaQq5BpJ9ZCyPe0Cpqc92evWW2ur8CuVl7aVhUfwsvF5Q$"
          rel="noopener noreferrer"
          target="_blank"
          @click="logSimplimmatImage"
        >
          <img
            class="img-responsive"
            width="150px"
            :src="imageLogoSimplimmat"
            alt="Application Simplimmat"
          >
        </a>
        <br />
      </div>
      <div class="col-md-9 col-sm-7">
        <div class="txt-small-14">
          Utilisez maintenant l’application officielle
          <a
            class="alert-link clickable btn-sm-link pop color-info_3 bold_4 txt-small-14 no-padding"
            href="https://urldefense.com/v3/__https://www.securite-routiere.gouv.fr/reglementation-liee-aux-modes-de-deplacements/immatriculation-des-vehicules/lapplication-simplimmat__;!!AaIhyw!402trV61GnNGBOc6PZbaQq5BpJ9ZCyPe0Cpqc92evWW2ur8CuVl7aVhUfwsvF5Q$"
            rel="noopener noreferrer"
            target="_blank"
            @click="logSimplimmatLink"
          >
            Simplimmat <i class="fa fa-external-link pl-5"></i>
          </a>.
          <br />
          Elle <span class="info_red">simplifiera</span> et <span class="info_red">sécurisera</span> vos formalités administratives pour la <span class="info_red">cession</span> ou <span class="info_red">l'immatriculation</span> de votre véhicule.
        </div>
      </div>
    </div>

    <div
      v-if="isHolder"
      class="separator-2 separator-lg"
    >
    </div>

    <div
      v-if="isHolder"
      class="row"
    >
      <div class="col-md-7">
        <h6 class="title p-h-15">
          Impression CSA
        </h6>
      </div>
    </div>
    <div
      v-if="isHolder"
      class="row"
    >
      <div class="col-md-1 col-sm-2">
        <i class="fa fa-print fa-3x"></i>
      </div>
      <div class="col-md-10 col-sm-10">
        <div class="txt-small-14">
          Pour imprimer le <span class="info_red">Certificat de Situation Administrative</span>
          (<b>certificat de non gage</b>),
          <br>
          <a
            class="alert-link clickable btn-sm-link pop color-info_3 bold_4 txt-small-14 no-padding"
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
        <i :class="'fa fa-' + processedVehiculeData.logoVehicule + ' fa-2x'"></i>
      </div>
      <div class="col-sm-6">
        <span class="info_red txt-small-13">{{ caracteristiquesTechniques.marque }} {{ caracteristiquesTechniques.modele }}</span>
        <br />
        <div v-if="caracteristiquesTechniques.puissance.cv">
          <span class="txt-small-13">Puissance fiscale : </span>
          <span class="info_red txt-small-13">{{ caracteristiquesTechniques.puissance.cv }} ch</span>
        </div>
      </div>
      <div
        v-if="!isHolder"
        class="col-sm-5"
      >
        <span class="color-info_2 bold_4 txt-small-13">Calculez le montant de votre certificat d'immatriculation</span>
        <br />
        <a
          class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
          href="https://siv.interieur.gouv.fr/map-usg-ui/do/simtax_accueil"
          rel="noopener noreferrer"
          target="_blank"
          title="Simulateur"
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
    <!-- @todo: maintient-on cette section? -->
    <div
      v-if="processedVehiculeData.usage.vehiculeDeCollection"
      class="row"
    >
      <!-- debut voiture  -->
      <div class="col-sm-1">
        <i :class="'fa ' + USAGE_COLLECTION.icon + ' fa-2x'"></i>
      </div>
      <div class="col-sm-6">
        <span class="txt-small-13">Usage:</span>
        <span class="info_red txt-small-13"> {{ USAGE_COLLECTION.text }} </span>
        <br />
      </div>
      <div
        v-if="USAGE_COLLECTION.adv"
        class="col-sm-5"
      >
        <span class="color-info_2 bold_4 txt-small-13">{{ USAGE_COLLECTION.adv }}</span>
        <br />
        <a
          v-if="USAGE_COLLECTION.adv"
          class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
          :href="USAGE_COLLECTION.link"
          rel="noopener noreferrer"
          target="_blank"
          :title="USAGE_COLLECTION.adv"
        >
          En savoir plus
          <i class="fa fa-external-link pl-10"></i>
        </a>
      </div>
      <!-- fin voiture  -->
    </div>
    <div
      v-if="processedVehiculeData.usage.vehiculeDeCollection"
      class="separator-2 separator-lg"
    >
    </div>
    <div
      v-if="processedVehiculeData.usage.vehiculeAgricole"
      class="row"
    >
      <!-- debut voiture  -->
      <div class="col-sm-1">
        <i :class="'fa ' + USAGE_AGRICOLE.icon + ' fa-2x'"></i>
      </div>
      <div class="col-sm-6">
        <span class="txt-small-13">Usage:</span>
        <span class="info_red txt-small-13"> {{ USAGE_AGRICOLE.text }} </span>
        <br />
      </div>
      <div
        v-if="USAGE_AGRICOLE.adv"
        class="col-sm-5"
      >
        <span class="color-info_2 bold_4 txt-small-13">{{ USAGE_AGRICOLE.adv }}</span>
        <br />
        <a
          v-if="USAGE_AGRICOLE.adv"
          class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
          :href="USAGE_AGRICOLE.link"
          rel="noopener noreferrer"
          target="_blank"
          :title="USAGE_AGRICOLE.adv"
        >
          En savoir plus
          <i class="fa fa-external-link pl-10"></i>
        </a>
      </div>
      <!-- fin voiture  -->
    </div>
    <div
      v-if="processedVehiculeData.usage.vehiculeAgricole"
      class="separator-2 separator-lg"
    >
    </div>
    <!-- fin trait separation  -->
    <div class="row">
      <!-- debut proprietaire  -->
      <div class="col-sm-1">
        <i class="fa fa-address-card fa-2x pr-10"></i>
      </div>
      <div class="col-sm-6">
        <span class="txt-small-13">Propriétaire actuel : </span>
        <span class="info_red txt-small-13">{{ processedVehiculeData.titulaire.identite }} depuis
          <span v-if="certificat.nombreDeMoisDepuisDateEmissionCertificatImmatriculation"> {{ certificat.nombreDeMoisDepuisDateEmissionCertificatImmatriculation }} </span>
          <span v-if="!certificat.nombreDeMoisDepuisDateEmissionCertificatImmatriculation"> une durée inconnue </span>
        </span>
      </div>
      <div class="col-sm-5">
        <div v-if="!certificat.isVehiculeImporteDepuisEtranger">
          <div v-if="isHolder">
            <span class="color-info_2 bold_4 txt-small-13">Vous êtes le </span>
            <span class="info_red txt-small-13">{{ processedVehiculeData.titulairesCount }}</span><sup class="info_red txt-small">{{ getExposant(processedVehiculeData.titulairesCount) }}</sup>
            <span class="color-info_2 bold_4 txt-small-13"> titulaire de ce véhicule</span>
          </div>
          <div v-if="!isHolder">
            <span class="color-info_2 bold_4 txt-small-13">Ce véhicule a déjà eu </span>
            <span class="info_red txt-small-13">{{ processedVehiculeData.titulairesCount }}</span>
            <span class="color-info_2 bold_4 txt-small-13"> titulaire(s), en l'achetant vous serez le </span>
            <span class="info_red txt-small-13">{{ processedVehiculeData.titulairesCount + 1 }}</span>
            <sup class="info_red txt-small">{{ getExposant(processedVehiculeData.titulairesCount + 1) }}</sup>
          </div>
        </div>
        <div v-if="certificat.isVehiculeImporteDepuisEtranger">
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
        <span v-if="datePremiereImmatriculationFR">
          <span class="txt-small-13">Première immatriculation le </span>
          <span class="info_red txt-small-13">{{ datePremiereImmatriculationFR }}</span>
        </span>
        <span v-if="!datePremiereImmatriculationFR">
          <span class="txt-small-13">Date de première immatriculation </span>
          <span class="info_red txt-small-13">inconnue</span>
        </span>
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

    <div v-if="certificat.isVehiculeImporteDepuisEtranger">
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
            v-if="!isHolder"
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


    <div v-if="processedVehiculeData.hasSinistre || hasProcedureVEEnCours">
      <div class="row">
        <!-- debut sinistre  -->
        <div class="col-sm-1">
          <i
            :class="[{'fa fa-thumbs-up fa-2x pr-10' : processedVehiculeData.isApte},
                     {'fa fa-exclamation-triangle info_red fa-2x pr-10' : !processedVehiculeData.isApte}]"
          >
          </i>
        </div>
        <div class="col-sm-6">
          <!-- état - un seul sinistre !-->
          <span v-if="processedVehiculeData.sinistresCount === 1 || (processedVehiculeData.sinistresCount === 0 && hasProcedureVEEnCours)">
            <span class="txt-small-13">Ce véhicule a eu </span>
            <span class="info_red txt-small-13">un sinistre déclaré</span>
            <span
              v-if="processedVehiculeData.sinistresCount === 1"
              class="txt-small-13"
            >
              en {{ processedVehiculeData.lastSinistreYear }}
            </span>
            <br />
            <span v-if="processedVehiculeData.isApte">
              <span class="txt-small-13">et</span>
              <span class="info_red txt-small-13"> déclaré apte à circuler</span>
              <span
                v-if="!processedVehiculeData.isApte"
                class="txt-small-13"
              >
                en {{ processedVehiculeData.lastResolutionYear }}
              </span>
            </span>
          </span>
          <!-- état - plusieurs sinistres !-->
          <span v-if="processedVehiculeData.sinistresCount > 1">
            <span class="txt-small-13">Ce véhicule a eu </span>
            <span class="info_red txt-small-13">plusieurs sinistres, </span>
            <span class="txt-small-13">dont le dernier déclaré en {{ processedVehiculeData.lastSinistreYear }}</span>
            <br />
            <span v-if="processedVehiculeData.isApte">
              <span class="txt-small-13">Le véhicule a été</span>
              <span class="info_red txt-small-13"> déclaré apte à circuler</span>
              <span
                v-if="!processedVehiculeData.isApte"
                class="txt-small-13"
              >
                en {{ processedVehiculeData.lastResolutionYear }}
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
            v-if="processedVehiculeData.isApte"
            class="color-info_2 bold_4 txt-small-13"
          >
            {{ syntheseMapping[(isHolder ? 'fin_ove_vendeur' : 'fin_ove_acheteur')].adv }}
          </span>
          <span
            v-else
            class="color-info_2 bold_4 txt-small-13"
          >
            {{ syntheseMapping['ove'].adv }}
          </span>

          <br />
          <span
            v-if="processedVehiculeData.hasSinistre && processedVehiculeData.sinistresCount > 1"
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
    <div v-if="synthese.length === 0 && !processedVehiculeData.lastSinistreYear">
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
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
            :href="syntheseMapping[entry].link"
            rel="noopener noreferrer"
            target="_blank"
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
        v-if="vignetteCritair"
        class="row"
      >
        <!-- debut ras  -->
        <div class="col-sm-1">
          <img
            v-if="vignetteCritair !== VIGNETTE.NON_CLASSE"
            class="img-responsive"
            :src="'assets/images/vignettes_crit_air/35_petit/vignette_' + vignetteCritair.toLowerCase() + '.png'"
            alt="Vignette Critair"
          >
          <i
            v-if="vignetteCritair === VIGNETTE.NON_CLASSE"
            class="fa fa-question-circle fa-2x"
          >
          </i>
        </div>
        <div class="col-sm-6">
          <span
            v-if="vignetteCritair !== VIGNETTE.NON_CLASSE"
            class="txt-small-13"
          >
            {{ syntheseMapping['critair'].text }} {{ vignetteCritair }}
          </span>
          <span
            v-if="vignetteCritair === VIGNETTE.NON_CLASSE"
            class="txt-small-13"
          >
            {{ syntheseMapping['critair_non_classe'].text }}
          </span>
        </div>
        <div class="col-sm-5 color-info_2 bold_4 txt-small-13">
          {{ syntheseMapping['critair'].adv }}
          <br />
          <a
            v-if="syntheseMapping['critair'].link"
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
            :href="syntheseMapping['critair'].link"
            rel="noopener noreferrer"
            target="_blank"
          >
            En savoir plus
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </div>
        <!-- fin ras  -->
      </div>
      <div
        v-if="!vignetteCritair && !processedVehiculeData.usage.vehiculeDeCollection"
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
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
            :href="syntheseMapping['critair'].link"
            rel="noopener noreferrer"
            target="_blank"
          >
            En savoir plus
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </div>
        <!-- fin ras  -->
      </div>
    </div>
  </div>
</template>

<script>

import { formatMixin } from '../../mixins/format.js'
import { formatIsoToFrDate } from '../../assets/js/format.js'

import { VIGNETTE } from '../../constants/vehicle/critair.js'
import { USAGE_AGRICOLE, USAGE_COLLECTION } from '../../constants/usagesSynthese.js'

import imageLogoSimplimmat from '@/assets/img/simplimmat.png'


export default {
  mixins: [formatMixin],
  props: {
    processedVehiculeData: {
      type: Object,
      default: () => {},
    },
    isHolder: Boolean,
    changeTab: {
      type: Function,
      default: () => {},
    },
  },
  data () {
    return {
      imageLogoSimplimmat,

      VIGNETTE,
      USAGE_AGRICOLE,
      USAGE_COLLECTION,
    }
  },
  computed: {
    caracteristiquesTechniques () {
      return this.processedVehiculeData.caracteristiquesTechniques
    },
    certificat () {
      return this.processedVehiculeData.certificat
    },
    datePremiereImmatriculationFR () {
      return formatIsoToFrDate(this.certificat.datePremiereImmatriculation)
    },
    hasProcedureVEEnCours () {
      return this.processedVehiculeData.administratif.hasProcedureVEEnCours
    },
    synthese () {
      return this.processedVehiculeData.administratif.reportLabels.synthese
    },
    vignetteCritair () {
      return this.processedVehiculeData.vignetteCritair
    },
  },

  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/synthesis`)
  },

  methods: {
    logSimplimmatImage () {
      this.$store.dispatch('log', `${this.$route.path}/simplimmat/image`)
    },
    logSimplimmatLink () {
      this.$store.dispatch('log', `${this.$route.path}/simplimmat/link`)
    },
  },
}

</script>
