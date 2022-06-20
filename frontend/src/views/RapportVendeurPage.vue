<script>
import { defineComponent } from 'vue'
import dayjs from 'dayjs'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'

import { hash } from '@/utils/crypto.js'
import { normalizeIdvAsDataPreparation, normalizeKeyAsDataPreparation } from '@/utils/dataPreparationFormat.js'
import { base64Encode, urlSafeBase64Encode, base64Decode, urlSafeBase64Decode } from '@/utils/encoding.js'

import reportService from '@/services/report.js'
import api from '@/api/index.js'

import siv from '@/assets/js/siv.js'
import { formatIsoToFrDate } from '@/assets/js/format.js'

import { REPORT_TABS } from '@/constants/reportTabs.js'
import { DEFAULT_DATE_UPDATE } from '@/constants/v.js'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@/constants/type.js'
import { DEFAULT_NUMERO_SIREN } from '@/constants/vehicle/numeroSiren.js'

import RapportVendeurSvg from '@/assets/img/rapport.svg'
import logoSimplimmat from '@/assets/img/simplimmat.png'

// const MOCK_REPORT = {
//   vehicule: {
//     date_mise_a_jour: '1900-01-01',
//     certificat_immatriculation: {
//       date_premiere_immatriculation: '2006-11-14',
//       nombre_de_mois_depuis_date_emission_certificat_immatriculation: '94',
//       numero_immatriculation_anonymisee: 'BH-7**-GB',
//       titulaire: {
//         particulier: {
//           nom_anonymise: 'C*****',
//           prenoms_anonymises: 'T***',
//           code_postal: '76370',
//         },
//       },
//       caracteristiques_techniques: {
//         marque: 'PIAGGIO',
//         tvv: 'C42404',
//         numero_cnit: 'LGG91C10P296',
//         nom_commercial: 'LIBERTY 50 LA POSTE',
//         couleur: 'JAUNE CLAIR',
//         type_de_reception: 'CE',
//         vin_anonymise: 'VF1B********44818',
//         ptta: 275,
//         ptac: 275,
//         ptra: 0,
//         ptes: 124,
//         ptav: 120,
//         date_emission: '2013-12-19',
//         categorie_ue: 'L1e',
//         genre_national: 'CL',
//         carrosserie_fr: 'SOLO',
//         numero_de_reception: 'E11*2002/24*0107*18',
//         cylindree: 50,
//         puissance_nette: 2.6,
//         energie: 'ES',
//         puissance_cv: 0,
//         rapport_puissance_masse: 0,
//         places_assises: 1,
//         places_debout: 0,
//         niveau_sonore: 79,
//         vitesse_du_moteur: 3500,
//         emission_co2: 0,
//       },
//       etat: {
//         duplicata: false,
//         annule: false,
//         perdu: false,
//         vole: false,
//       },
//     },
//     etat: {
//       nombre_de_titulaires: 2,
//       vignette_critair: '3',
//       vole: false,
//       procedures_ve: {
//         numero_immatriculation_au_format_fni: false,
//         apte_a_circuler: true,
//         nombre_de_procedures_ve: 0,
//         procedure_ve_en_cours: false,
//       },
//     },
//     historique: [
//       { date: '2013-12-19', type: 'CHANG_TIT_NORMAL' },
//       { date: '2010-02-15', type: 'CHANG_TIT_NORMAL' },
//     ],
//     import_en_france: {
//       vehicule_importe_depuis_etranger: false,
//       date_import: '2006-11-14',
//     },
//     situation_administrative: {
//       declarations_valant_saisie: [],
//       gages: [],
//       opposition: {
//         oves: [],
//         oveis: [],
//         otcis: [],
//         otcis_pv: [],
//       },
//       suspensions: [],
//     },
//     extra: {
//       logo_genre: 'MOTO',
//       date_premiere_immatriculation_incertaine: false,
//       vehicule_a_usage_agricole: false,
//       vehicule_a_usage_de_collection: false,
//     },
//   },
//   controles_techniques: {
//     historique: [],
//     donnee_disponible: true,
//   },
// }


export default defineComponent({
  name: 'RapportVendeurPage',

  components: { RapportVendeurSvg, HistoVecButtonLink },

  data () {
    return  {
      // Initialized onCreated
      holderId: null,
      holderKey: null,
      processedVehiculeData: {},

      formData: this.$route.params.formData || JSON.parse(sessionStorage.getItem('formData')),

      tabs: {
        selectedTabIndex: 0,
        asc: true,
        mapping: {
          0: REPORT_TABS.SYNTHESE,
          1: REPORT_TABS.VEHICULE,
          2: REPORT_TABS.TITULAIRE_ET_TITRE,
          3: REPORT_TABS.SITUATION_ADMINISTRATIVE,
          4: REPORT_TABS.CONTROLES_TECHNIQUES,
          5: REPORT_TABS.KILOMETRAGE,
        },
      },

      images: {
        logoSimplimmat,
      },

      // @todo: FLAGs à centraliser au niveau de l'application et à externalisé via un des variables d'environnement
      flags: {
        // Gestion de la fraîcheur des données
        outdatedData: true,
        showDataDate: true,

        // Flag du 8
        usePreviousMonthForData: false,
        previousMonthShift: 1,

        // Outil de debug (doublé par côté backend pour empêcher son usage en PROD)
        ignoreUtacCache: false,
      },
    }
  },

  computed: {
    tilesVehiculeLinks () {
      return [
        {
          title: 'Le véhicule',
          description: (
            this.isCIAnnule ?
              `Le certificat demandé a été annulé : ${ this.processedVehiculeData.plaque }` :
              `Numéro d'immatriculation : ${ this.processedVehiculeData.plaque }`
          ),
          to: '',
          imgSrc: '',
        },
      ]
    },
    tilesDateDonneesVehiculeLinks () {
      const description = (
        this.flags.showDataDate ? (
            this.isDefaultDataDate ?
            'Non à jour' :
            `Datant du ${this.dateMiseAJourFR}`
          ) :
        'Connues d\'HistoVec à ce jour'
      )

      return [
        {
          title: 'Informations du Ministère de l\'Intérieur',
          description,
          to: '',
          imgSrc: '',
        },
      ]
    },

    currentTab () {
      return this.tabs.mapping[this.tabs.selectedTabIndex]
    },

    // ----- Partage du rapport acheteur par le vendeur -----

    currentMonthNumber () {
      let date = dayjs().add(-7, 'day')

      if (this.flags.usePreviousMonthForData) {
        date = date.add(-this.previousMonthShift, 'month')
      }

      return date.format('YYYYMM')
    },
    titulaireId () {
      if (this.formData.typePersonne === TYPE_PERSONNE.PARTICULIER) {
        if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
          return this.formData.siv.titulaire.particulier.nom + this.formData.siv.titulaire.particulier.prenoms
        }

        if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
          return this.formData.fni.titulaire.particulier.nomEtPrenoms
        }

        return ''
      }

      if (this.formData.typePersonne === TYPE_PERSONNE.PRO) {
        if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
          const numeroSiren = this.formData.siv.titulaire.personneMorale.numeroSiren || DEFAULT_NUMERO_SIREN
          return this.formData.siv.titulaire.personneMorale.raisonSociale + numeroSiren
        }

        if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
          const numeroSiren = this.formData.fni.titulaire.personneMorale.numeroSiren || DEFAULT_NUMERO_SIREN
          return this.formData.fni.titulaire.personneMorale.raisonSociale + numeroSiren
        }
      }

      return ''
    },
    vehicleId () {
      if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
        return this.formData.siv.numeroImmatriculation + this.formData.siv.numeroFormule
      }

      if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
        return this.formData.fni.numeroImmatriculation + this.formData.fni.dateEmissionCertificatImmatriculation
      }

      return ''
    },

    codePartageHistoVec () {
      return `${this.holderId}-${this.holderKey}`
    },
    baseUrl () {
      // Equivalent to 'https://histovec.interieur.gouv.fr' for production
      return window.location.protocol + '//' + window.location.host
    },
    url () {
      const idParam = encodeURIComponent(this.holderId)
      const keyParam = encodeURIComponent(this.holderKey)
      const queryString = `?id=${idParam}&key=${keyParam}`

      // Add 'urlUnsafe' queryParameter to make new buyer urls (urlUnsafeBase64 encoded parameters) recognizable for frontend and backend
      // @todo remove 'urlUnsafe' queryParam while transition done (8th day of the next month after 'HistoVec code partage' feature deployement)
      return `${this.baseUrl}/histovec/report${queryString}&urlUnsafe=true`
    },

    // ----- Interrogation de l'api pour le rapport acheteur -----

    buyerId () {
      const { id: buyerId, urlUnsafe } = this.$route.query

      // @todo: Supprimer ce bloc de code une fois la transition vers le nouveau backend effectuée (le 8 du mois suivant la mise en prod)
      if (!urlUnsafe && buyerId) {  // old buyer report link
        return base64Encode(urlSafeBase64Decode(buyerId))
      }

      return buyerId
    },
    buyerKey () {
      const { key: buyerKey, urlUnsafe } = this.$route.query

      // @todo: Supprimer ce bloc de code une fois la transition vers le nouveau backend effectuée (le 8 du mois suivant la mise en prod)
      if (!urlUnsafe && buyerKey) {  // old buyer report link
        return base64Encode(urlSafeBase64Decode(buyerKey))
      }

      return buyerKey
    },
    // -----------------------------------------------------------

    // ----- Accès rapide au données du rapport -----

    caracteristiquesTechniques () {
      return this.processedVehiculeData.caracteristiquesTechniques
    },
    certificat () {
      return this.processedVehiculeData.certificat
    },
    controlesTechniques () {
      const { controlesTechniques: controlesTechniquesData } = this.report

      return controlesTechniquesData.historique || []
    },
    dateMiseAJourFR () {
      return formatIsoToFrDate(this.processedVehiculeData.dateMiseAJour)
    },
    erreurControlesTechniques () {
      const { controlesTechniques: controlesTechniquesData } = this.report

      return controlesTechniquesData.erreur
    },
    isCIAnnule () {
      return Boolean(
        this.processedVehiculeData &&
        this.processedVehiculeData.administratif &&
        this.processedVehiculeData.administratif.isCIAnnule,
      )
    },
    isDefaultDataDate () {
      return this.processedVehiculeData.dateMiseAJour === DEFAULT_DATE_UPDATE
    },
    isHolder () {
      return Boolean(!this.buyerId && this.holderId)
    },
    isBuyer () {
      return Boolean(this.buyerId || this.buyerKey)
    },
    isValidBuyer () {
      return Boolean(this.buyerId && this.buyerKey)
    },
    synthese () {
      return this.processedVehiculeData.administratif.reportLabels.synthese
    },

    // ----------------------------------------------


    // ----- Accès rapide au données du rapport -----



    // status () {
    //   const { lastReportStatusCode } = this.$store.state.histovec

    //   if (lastReportStatusCode === 404) {
    //     return this.isHolder ? 'notFound' : 'notFoundBuyer'
    //   } else if (this.report) {
    //     this.showRatingModal()
    //     return 'ok'
    //   } else if (!this.isHolder && (!this.buyerId || !this.buyerKey)) {
    //     return 'invalidBuyer'
    //   } else if (!this.id) {
    //     return 'invalid'
    //   } else if (
    //     lastReportStatusCode &&
    //     lastReportStatusCode !== 200
    //   ) {
    //     return (
    //       this.isHolder ?
    //       STATUS_FROM_CODE.holder[lastReportStatusCode] :
    //       STATUS_FROM_CODE.buyer[lastReportStatusCode]
    //     )
    //   }

    //   return 'wait'
    // },



  },

  beforeMount: async function () {
    console.log('-- beforeMount --')

    this.holderId = await this.computeHolderId()
    this.holderKey = await this.computeHolderKey()

    let report = {}

    if (this.isBuyer) {
      if (this.isValidBuyer) {
        report = await this.getBuyerReport()
      } else {
        // @todo: gérer ce edge case
        // lien acheteur invalide
        // => demandez un lien valide à votre vendeur
      }
    } else if (this.isHolder) {
      if (this.formData) {
        report = await this.getHolderReport()
      } else {
        // @todo : gérer ce edge case
        // aucun rapport déjà consulté
        // => veuillez remplir le formulaire proprietaire
      }
    } else {
        // @todo : gérer ce edge case
        // accès à l'url du rapport sans passer ni par le formulaire, ni par un lien acheteur
        // => Si vous être propriétaire veuillez remplir le formulaire
        // => Si vous êtes acheteur veuillez demander un lien acheteur à votre vendeur
    }

    // @todo: remove
    // report = MOCK_REPORT
    const { vehicule: vehiculeData } = report

    this.processedVehiculeData = siv.processVehiculeData(vehiculeData)
  },

  methods: {
    // Tabs
    selectTab (idx) {
      console.log('-- selectTab --')

      this.tabs.asc = this.tabs.selectedTabIndex < idx
      this.tabs.selectedTabIndex = idx
    },

    async computeHolderId () {
      console.log('-- computeHolderId --')
      const id = `${this.titulaireId}${this.vehicleId}${this.currentMonthNumber}`
      const normalizedId = normalizeIdvAsDataPreparation(id)

      const hashedIdBuffer = await hash(normalizedId)
      const holderId = base64Encode(hashedIdBuffer)
      // @todo: remove these logs while transition done (8th day of the next month after 'HistoVec code partage' feature deployement)
      // eslint-disable-next-line no-console
      console.log(`[NEW] id base64Encoded = ${this.holderId}`)

      const urlSafeBase64EncodedId = urlSafeBase64Encode(base64Decode(holderId))
      // eslint-disable-next-line no-console
      console.log(`[OLD] id urlSafeBase64Encoded = ${urlSafeBase64EncodedId}`)

      // eslint-disable-next-line no-console
      console.log(`[ID] are they different ? ${holderId !== urlSafeBase64EncodedId}`)

      return holderId
    },

    async computeHolderKey () {
      console.log('-- computeHolderKey --')

      const normalizedKey = normalizeKeyAsDataPreparation(this.vehicleId)
      const hashedKeyBuffer = await hash(normalizedKey)
      const holderKey = base64Encode(hashedKeyBuffer)
      // @todo: remove these logs while transition done (8th day of the next month after 'HistoVec code partage' feature deployement)
      // eslint-disable-next-line no-console
      console.log(`[NEW] key base64Encoded = ${holderKey}`)

      const urlSafeBase64EncodedKey = urlSafeBase64Encode(base64Decode(holderKey))
      // eslint-disable-next-line no-console
      console.log(`[OLD] key urlSafeBase64Encoded = ${urlSafeBase64EncodedKey}`)

      // eslint-disable-next-line no-console
      console.log(`[KEY] are they different ? ${holderKey !== urlSafeBase64EncodedKey}`)

      return holderKey
    },

    async getBuyerReport () {
      console.log('-- getBuyerReport --')

      const data = {
        id: this.buyerId,
        key: this.buyerKey,
      }

      const report = await reportService.getBuyerReport(data, { ignoreUtacCache: this.flags.ignoreUtacCache })

      return report
    },

    async getHolderReport () {
      console.log('-- getHolderReport --')

      const data = {
        id: this.holderId,
        formData: this.formData,
      }

      const report = await reportService.getHolderReport(data, { ignoreUtacCache: this.flags.ignoreUtacCache })

      return report
    },

    /** logs **/
    logSimplimmatImage () {
      api.log.log(`${this.$route.path}/simplimmat/image`)
    },
  },
})
</script>

<template>
  <div class="fr-grid-row  fr-grid-row--gutters  fr-mb-4w">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="[
          {
            to: '/accueil',
            text: 'Accueil',
          },
          {
            text: 'Rapport vendeur',
          },
        ]"
      />
    </div>

    <div class="fr-col-lg-4 fr-col-xl-4">
      <DsfrPicture src="">
        <RapportVendeurSvg
          title="Illustration de la page du rapport vendeur HistoVec"
        />
      </DsfrPicture>
    </div>

    <div class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v">
      <h1>Rapport de votre véhicule</h1>
      <h2>Consultez et partagez l'historique du véhicule</h2>

      currentTab: {{ currentTab }}
      <!-- query: {{ $route.query }}
      params: {{ $route.params }}

      holderId: {{ holderId }}
      formData: {{ formData }}

      processedVehiculeData: {{ processedVehiculeData }}
      typeImmatriculation: {{ formData.typeImmatriculation }}
      typePersonne {{ formData.typePersonne }} -->
    </div>
  </div>

  <div
    v-if="flags.outdatedData"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-3w"
  >
    <!-- @todo: revoir avec la DSR pour le title -->
    <div class="fr-col-8">
      <DsfrAlert
        type="warning"
        title="Fraîcheur des données"
        description="
          HistoVec rencontre actuellement des difficultés techniques dans la mise à jour des données relatives aux véhicules qu'il vous permet de consulter.
          Seul le certificat de situation administrative disponible sur le site de l'ANTS fait foi.
          Veuillez nous excuser pour la gêne occasionnée.
        "
      />
    </div>
  </div>

  <div
    v-if="flags.outdatedData"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w"
  >
    <div class="fr-col-4  text-center">
      <HistoVecButtonLink
        label="Obtenir le CSA à jour via l'ANTS"
        to="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
      />
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-mb-6w">
    <div class="fr-col-offset-2  fr-col-4">
      <DsfrTiles
        :tiles="tilesVehiculeLinks"
        :horizontal="true"
      />
    </div>
    <div class="fr-col-4">
      <DsfrTiles
        :tiles="tilesDateDonneesVehiculeLinks"
        :horizontal="true"
      />
    </div>
  </div>

  <div
    v-if="!isCIAnnule"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w"
  >
    <div class="fr-col-11">
      <DsfrTabs
        tab-list-name="Liste d'onglets du rapport du véhicule"
        :tab-titles="[{ title: 'Synthèse'}]"
        @select-tab="selectTab"
      >
        <!-- :tab-titles="[
          { title: 'Synthèse'},
          { title: 'Véhicule'},
          { title: 'Titulaire & Titre'},
          { title: 'Situation administrative'},
          { title: 'Historique'},
          { title: 'Contrôles techniques'},
          { title: 'Kilométrage'}
        ]" -->
        <DsfrTabContent
          panel-id="report-tab-content-0"
          tab-id="report-tab-0"
          :selected="tabs.selectedTabIndex === 0"
          :asc="tabs.asc"
        >
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-6">
              <!-- <h5>Résumé</h5>

              <h6>Modèle</h6>
              <p
                v-if="caracteristiquesTechniques.puissance.cv"
                class="fr-text--md"
              >
                {{ caracteristiquesTechniques.puissance.cv }}
                <br />
                Puissance fiscale : {{ puissanceFiscale }}
              </p>

              <h6>Propriétaire actuel</h6>
              <p class="fr-text--md">
                {{ titulaire }} depuis {{ ageCertificat }}
                <br />
                En achetant ce véhicule, vous serez le {{ numeroTitulaire }} titulaire
              </p> -->
            </div>
            <div class="fr-col-6">
              <!-- <h6>Immatriculation</h6>
              <p class="fr-text--md">
                Première immatriculation le {{ datePremiereImmatriculation }}
              </p>

              <h6>Situation administrative</h6>
              <p class="fr-text--md">
                Rien à signaler du point de vue administratif (gages, opposition, vol, …)
              </p>

              <h6>Autre</h6>
              <p class="fr-text--md">
                Eligible vignette Crit'Air {{ critair }}
                <br />
                Consulter le site des vignettes Crit'Air
              </p> -->
            </div>
          </div>
        </DsfrTabContent>

        <!-- <DsfrTabContent
          panel-id="report-tab-content-1"
          tab-id="report-tab-1"
          :selected="tabs.selectedTabIndex === 1"
          :asc="tabs.asc"
        >
          <div
            class="fr-grid-row  fr-grid-row--gutters"
          >
            <div class="fr-col-12">
              <h6>Caractéristiques techniques</h6>
            </div>

            <div class="fr-col-6">
              Marque
            </div>
            <div class="fr-col-2">
              D.1
            </div>
            <div class="fr-col-4">
              {{ caracteristiquesTechniques.marque }}
            </div>

            <div class="fr-col-6">
              Type variante version
            </div>
            <div class="fr-col-2">
              D.2
            </div>
            <div class="fr-col-4">
              {{ caracteristiquesTechniques.tvv }}
            </div>

            <div class="fr-col-6">
              Numéro CNIT
            </div>
            <div class="fr-col-2">
              D.2.1
            </div>
            <div class="fr-col-4">
              {{ caracteristiquesTechniques.cnit }}
            </div>

            <div class="fr-col-6">
              Nom commercial
            </div>
            <div class="fr-col-2">
              D.3
            </div>
            <div class="fr-col-4">
              {{ caracteristiquesTechniques.modele }}
            </div>

            <div class="fr-col-6">
              Couleur
            </div>
            <div class="fr-col-2">
            </div>
            <div class="fr-col-4">
              {{ caracteristiquesTechniques.couleur }}
            </div>

            <div class="fr-col-6">
              Type de réception
            </div>
            <div class="fr-col-2">
            </div>
            <div class="fr-col-4">
              {{ caracteristiquesTechniques.reception.type }}
            </div>
            ²
            <div class="fr-col-6">
              Numéro d'identification véhicule
            </div>
            <div class="fr-col-2">
              E
            </div>
            <div class="fr-col-4">
              {{ caracteristiquesTechniques.vin }}
            </div>

            <template v-if="caracteristiquesTechniques.PT.admissible">
              <div class="fr-col-6">
                PT technique admissible (kg)
              </div>
              <div class="fr-col-2">
                F.1
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.PT.admissible }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.AC">
              <div class="fr-col-6">
                PTAC (kg)
              </div>
              <div class="fr-col-2">
                F.2
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.PT.AC }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.RA">
              <div class="fr-col-6">
                PTRA (kg)
              </div>
              <div class="fr-col-2">
                F.3
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.PT.RA }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.service">
              <div class="fr-col-6">
                PT en service (kg)
              </div>
              <div class="fr-col-2">
                G
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.PT.service }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.AV">
              <div class="fr-col-6">
                PTAV (kg)
              </div>
              <div class="fr-col-2">
                G.1
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.PT.AV }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.categorie">
              <div class="fr-col-6">
                Catégorie (CE)
              </div>
              <div class="fr-col-2">
                J
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.categorie }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.genre">
              <div class="fr-col-6">
                Genre (National)
              </div>
              <div class="fr-col-2">
                J.1
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.genre }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.carrosserie.ce">
              <div class="fr-col-6">
                Carrosserie (CE)
              </div>
              <div class="fr-col-2">
                J.2
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.carrosserie.ce }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.carrosserie.national">
              <div class="fr-col-6">
                Carrosserie (National)
              </div>
              <div class="fr-col-2">
                J.3
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.carrosserie.national }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.reception.numero">
              <div class="fr-col-6">
                Numéro de réception
              </div>
              <div class="fr-col-2">
                K
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.reception.numero }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.cylindres">
              <div class="fr-col-6">
                Cylindrée (cm3)
              </div>
              <div class="fr-col-2">
                P.1
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.puissance.cylindres }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.nette">
              <div class="fr-col-6">
                Puissance nette max (kW)
              </div>
              <div class="fr-col-2">
                P.2
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.puissance.nette }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.energie">
              <div class="fr-col-6">
                Energie
              </div>
              <div class="fr-col-2">
                P.3
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.energie }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.cv">
              <div class="fr-col-6">
                Puissance CV
              </div>
              <div class="fr-col-2">
                P.6
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.puissance.cv }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.norm">
              <div class="fr-col-6">
                Puissance / masse (kW/kg)
              </div>
              <div class="fr-col-2">
                Q
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.puissance.norm }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.places.assis">
              <div class="fr-col-6">
                Places assises
              </div>
              <div class="fr-col-2">
                S.1
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.places.assis }}
              </div>
            </template>

            <div class="fr-col-6">
              Places debout
            </div>
            <div class="fr-col-2">
              S.2
            </div>
            <div class="fr-col-4">
              <template v-if="caracteristiquesTechniques.places.debout">
                {{ caracteristiquesTechniques.places.debout }}
              </template>
            </div>

            <template v-if="caracteristiquesTechniques.db">
              <div class="fr-col-6">
                Niveau sonore (db(A))
              </div>
              <div class="fr-col-2">
                U.1
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.db }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.moteur">
              <div class="fr-col-6">
                Vitesse moteur (min-1)
              </div>
              <div class="fr-col-2">
                U.2
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.moteur }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.co2">
              <div class="fr-col-6">
                CO2 (g/km)
              </div>
              <div class="fr-col-2">
                V.7
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.co2 }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.environnement">
              <div class="fr-col-6">
                Classe environnement (CE)
              </div>
              <div class="fr-col-2">
                V.9
              </div>
              <div class="fr-col-4">
                {{ caracteristiquesTechniques.environnement }}
              </div>
            </template>
          </div>
        </DsfrTabContent> -->

        <!-- <DsfrTabContent
          panel-id="report-tab-content-2"
          tab-id="report-tab-2"
          :selected="tabs.selectedTabIndex === 2"
          :asc="tabs.asc"
        >
          <div
            class="fr-grid-row  fr-grid-row--gutters"
          >
            <div class="fr-col-6">
            </div>
            <div class="fr-col-6">
            </div>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="report-tab-content-3"
          tab-id="report-tab-3"
          :selected="tabs.selectedTabIndex === 3"
          :asc="tabs.asc"
        >
          <div
            class="fr-grid-row  fr-grid-row--gutters"
          >
            <div class="fr-col-6">
            </div>
            <div class="fr-col-6">
            </div>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="report-tab-content-4"
          tab-id="report-tab-4"
          :selected="tabs.selectedTabIndex === 4"
          :asc="tabs.asc"
        >
          <div
            class="fr-grid-row  fr-grid-row--gutters"
          >
            <div class="fr-col-6">
            </div>
            <div class="fr-col-6">
            </div>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="report-tab-content-5"
          tab-id="report-tab-5"
          :selected="tabs.selectedTabIndex === 5"
          :asc="tabs.asc"
        >
          <div
            class="fr-grid-row  fr-grid-row--gutters"
          >
            <div class="fr-col-6">
            </div>
            <div class="fr-col-6">
            </div>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="report-tab-content-6"
          tab-id="report-tab-6"
          :selected="tabs.selectedTabIndex === 6"
          :asc="tabs.asc"
        >
          <div
            class="fr-grid-row  fr-grid-row--gutters"
          >
            <div class="fr-col-6">
            </div>
            <div class="fr-col-6">
            </div>
          </div>
        </DsfrTabContent> -->
      </DsfrTabs>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div
      class="fr-col-6"
      style="text-align: right"
    >
      <DsfrButton
        label="Imprimer le CSA"
        on-click="@todo"
      />
    </div>
    <div
      class="fr-col-6"
      style="text-align: left"
    >
      <DsfrButton
        label="Envoyer le rapport"
        on-click="@todo"
        secondary
      />
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div class="col-3 col-sm-5">
      <DsfrPicture src="">
        <RapportVendeurSvg
          title="Illustration de la page du rapport vendeur HistoVec"
        />
      </DsfrPicture>
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
          :src="images.logoSimplimmat"
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
</template>

