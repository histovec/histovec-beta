<script>
import {defineComponent} from 'vue'
import dayjs from 'dayjs'
import QrcodeVue from 'qrcode.vue'
import {copyText} from 'vue3-clipboard'


import orderBy from 'lodash.orderby'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'
import ControlesTechniquesLineChart from '@/components/ControlesTechniquesLineChart.vue'

import {hash} from '@/utils/crypto.js'
import {generateCsa} from '@/utils/csaAsPdf/index.js'
import {RAPPORT_FILENAME} from '@/utils/csaAsPdf/constants.js'
import {normalizeIdvAsDataPreparation, normalizeKeyAsDataPreparation} from '@/utils/dataPreparationFormat.js'
import {base64Decode, base64Encode, urlSafeBase64Decode, urlSafeBase64Encode} from '@/utils/encoding.js'
import {downloadBlob} from '@/utils/file.js'
import {getExposant} from '@/utils/format.js'
import {mailTo} from '@/utils/email.js'
import {getShareReportEmail} from '@/utils/dynamicEmail.js'

import api from '@/api/index.js'

import reportService from '@/services/report.js'

import {formatIsoToFrDate} from '@/assets/js/format.js'
import siv from '@/assets/js/siv.js'
import operationsMapping from '@/assets/json/operations.json'
import syntheseMapping from '@/assets/json/synthese.json'

import {RESULTAT} from '@/constants/controlesTechniques.js'
import {REPORT_TABS} from '@/constants/reportTabs.js'
import {TYPE_IMMATRICULATION, TYPE_PERSONNE, TYPE_RAPPORT} from '@/constants/type.js'
import {DEFAULT_DATE_UPDATE} from '@/constants/v.js'
import {VIGNETTE} from '@/constants/vehicle/critair.js'
import {DEFAULT_NUMERO_SIREN} from '@/constants/vehicle/numeroSiren.js'
import {USAGE_AGRICOLE, USAGE_COLLECTION} from '@/constants/usagesSynthese.js'

import logoSimplimmat from '@/assets/img/simplimmat.png'

// @todo @lazyLoadCritairImage1 Le lazy loading dynamique serait bien mieux, mais je n'ai pas réussi à le mettre en place avec le temps qu'il me reste
import logoVignetteCritair1 from '@/assets/img/critair/vignette_1.png'
import logoVignetteCritair2 from '@/assets/img/critair/vignette_2.png'
import logoVignetteCritair3 from '@/assets/img/critair/vignette_3.png'
import logoVignetteCritair4 from '@/assets/img/critair/vignette_4.png'
import logoVignetteCritair5 from '@/assets/img/critair/vignette_5.png'
import logoVignetteCritairElectrique from '@/assets/img/critair/vignette_electrique.png'

// CSA
import logoHistoVec from '@/assets/img/deprecated/logo_histovec_avec_titre.png'
import logoMI from '@/assets/img/deprecated/logo_ministere_interieur.png'


export default defineComponent({
  name: 'RapportVendeurPage',

  components: {
    ControlesTechniquesLineChart,
    HistoVecButtonLink, QrcodeVue,
  },

  props: {
    typeRapport: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      // Initialized beforeMount
      holderId: null,
      holderKey: null,
      processedVehiculeData: {
        vignetteCritair: null,
        administratif: {
          opposition: {},
          csaLabels: {},
          reportLabels: {
            synthese: [],
            titre: {},
          },
        },
        certificat: {},
        caracteristiquesTechniques: {
          carrosserie: {},
          places: {},
          puissance: {},
          reception: {},
          PT: {},
        },
        titulaire: {},
        etranger: {},
        usage: {},
      },
      controlesTechniques: {
        historique: [],
      },
      formData: null,
      tabTitles: [],
      modaleActions: [],

      modalPartagerRapport: {
        opened: false,
      },

      tabs: {
        selectedTabIndex: 0,
        asc: true,
        mapping: {
          0: REPORT_TABS.SYNTHESE,
          1: REPORT_TABS.VEHICULE,
          2: REPORT_TABS.TITULAIRE_ET_TITRE,
          3: REPORT_TABS.SITUATION_ADMINISTRATIVE,
          4: REPORT_TABS.HISTORIQUE,
          5: REPORT_TABS.CONTROLES_TECHNIQUES,
          6: REPORT_TABS.KILOMETRAGE,
        },
      },

      images: {
        logoHistoVec,
        logoSimplimmat,
        logoMI,

        critair: {
          logoVignetteCritair1,
          logoVignetteCritair2,
          logoVignetteCritair3,
          logoVignetteCritair4,
          logoVignetteCritair5,
          logoVignetteCritairElectrique,
        },

        csa: {
          logoHistoVecBytes: '',
          logoMIBytes: '',
        },
      },

      constants: {
        REPORT_TABS,
        USAGE_AGRICOLE,
        USAGE_COLLECTION,
        VIGNETTE,
      },

      assets: {
        syntheseMapping,
        operationsMapping,
      },

      utils: {
        api,
        getExposant,
        copyText,
      },

      // @todo: @featureFlags
      // Feature flags à centraliser au niveau de la création de l'application Vue et à configurer via des variables d'environnement
      // Actuellement la construction des builds de PROD ne permet pas d'injecter de variable d'environnement, pour que cela fonctionne en PROD, il faudrait revoir le mode de build du front.
      // Pour pouvoir changer les feature flags en PROD, il est actuellement nécessaire de faire un commit en modifiant les flags ci-dessous, et donc un nouveau build.
      // En local, il suffit de modifier les flags ci-dessous et sauvergarder: le hot module reload (HMR) de Vite actualisera le code en temps réel dans la navigateur web.

      // @shortCutConfig1: brancher ces features flags sur un raccourci clavier si besoin
      flags: {
        // Gestion de la fraîcheur des données
        outdatedData: false,  // @flag @outdatedData : A activer quand la DSR juge que la donnée n'est pas assez fraîche
        showDataDate: true,  // @feature @showDataDate : Permet d'afficher la vraie date des données dans le CSA et le rapport HTML HistoVec - Devrait toujours rester à true
        codePartage: false,  // @todo @feature @codePartage1: A activer quand on aura ouvert l'API grand public et qu'on communiquera dessus et que le bug clipboard sera résolu

        // Flag du 8
        usePreviousMonthForData: false, // @flag @usePreviousMonthForData
        previousMonthShift: 1, // @flag @previousMonthShift

        // @flag @ignoreUtacCache
        // Outil de debug (doublé par côté backend pour empêcher son usage en PROD)
        ignoreUtacCache: false,
      },
      sessionStorage,
    }
  },

  computed: {
    tilesVehiculeLinks() {
      return [
        {
          title: 'Le véhicule',
          description: (
            this.isCIAnnule ?
              `Le certificat demandé a été annulé : ${this.processedVehiculeData.plaque}` :
              `Numéro d'immatriculation : ${this.processedVehiculeData.plaque}`
          ),
          to: '',
          imgSrc: '',
        },
      ]
    },
    tilesDateDonneesVehiculeLinks() {
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

    breadcrumbLinks() {
      return [
        {
          to: '/accueil',
          text: 'Accueil',
        },
        {
          text: `Rapport ${this.isRapportAcheteur ? 'acheteur' : 'vendeur'}`,
        },
      ]
    },

    isRapportAcheteur() {
      return (
        this.typeRapport === TYPE_RAPPORT.ACHETEUR ||
        (this.typeRapport !== TYPE_RAPPORT.VENDEUR && this.isBuyer)
      )
    },

    isRapportVendeur() {
      return (
        this.typeRapport === TYPE_RAPPORT.VENDEUR ||
        (this.typeRapport !== TYPE_RAPPORT.ACHETEUR && this.isHolder)
      )
    },

    currentTab() {
      return this.tabs.mapping[this.tabs.selectedTabIndex]
    },

    // ----- Partage du rapport acheteur par le vendeur -----

    currentMonthNumber() {
      let date = dayjs().add(-7, 'day')

      if (this.flags.usePreviousMonthForData) {
        date = date.add(-this.flags.previousMonthShift, 'month')
      }

      return date.format('YYYYMM')
    },
    titulaireId() {
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
    vehicleId() {
      if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
        return this.formData.siv.numeroImmatriculation + this.formData.siv.numeroFormule
      }

      if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
        return this.formData.fni.numeroImmatriculation + this.formData.fni.dateEmissionCertificatImmatriculation
      }

      return ''
    },

    codePartageHistoVec() {
      return `${this.holderId}-${this.holderKey}`
    },
    baseUrl() {
      // Equivalent to 'https://histovec.interieur.gouv.fr' for production
      return window.location.protocol + '//' + window.location.host
    },
    url() {
      const idParam = encodeURIComponent(this.holderId)
      const keyParam = encodeURIComponent(this.holderKey)
      const queryString = `?id=${idParam}&key=${keyParam}`

      // Ajout du queryParam 'urlUnsafe' afin que le front puisse distinguer les nouveaux liens acheteurs (au format urlUnsafeBase64Encoded) des anciens (au format urlSafeBase64Encoded)
      // L'usage de ce nouveau format (urlUnsafeBase64Encoded) est nécessaire au bon fonctionnement du codePartageHistoVec et l'API associée: /report_by_code
      // @todo @urlUnsafe1 : Supprimer cette ligne
      return `${this.baseUrl}/histovec/report${queryString}&urlUnsafe=true`

      // Après la 8 du mois suivant la mise en PROD Vue3 + DSFR, supprimer le queryParam 'urlUnsafe'.
      // En effet, les anciens liens acheteur (au format urlSafeBase64Encoded) auront tous périmé
      // et tous les liens acheteurs générés à partir du 1er du mois auront le nouveau format (urlUnsafeBase64Encoded).
      // Plus besoin de mécanisme pour les distinguer.
      // @todo @urlUnsafe2 : Décommenter cette ligne
      // return `${this.baseUrl}/histovec/report${queryString}`
    },

    // ----- Interrogation de l'api pour le rapport acheteur -----

    buyerId() {
      const {id: buyerId, urlUnsafe} = this.$route.query

      /* ----- @todo @urlUnsafe3 : Supprimer ce bloc de code  ------- */
      if (!urlUnsafe && buyerId) {  // old buyer report link
        return base64Encode(urlSafeBase64Decode(buyerId))
      }
      /* -------------------------------------------------------- */

      return buyerId
    },
    buyerKey() {
      const {key: buyerKey, urlUnsafe} = this.$route.query

      /* ----- @todo @urlUnsafe4 : Supprimer ce bloc de code  ------- */
      if (!urlUnsafe && buyerKey) {  // old buyer report link
        return base64Encode(urlSafeBase64Decode(buyerKey))
      }
      /* -------------------------------------------------------- */

      return buyerKey
    },
    // -----------------------------------------------------------

    // ----- Accès rapide aux données du rapport -----

    caracteristiquesTechniques() {
      return this.processedVehiculeData.caracteristiquesTechniques
    },
    certificat() {
      return this.processedVehiculeData.certificat
    },
    controlesTechniquesHistorique() {
      return this.controlesTechniques.historique || []
    },
    dateEmissionCIFR() {
      return formatIsoToFrDate(this.certificat.dateEmissionCI)
    },
    dateMiseAJourFR() {
      return formatIsoToFrDate(this.processedVehiculeData.dateMiseAJour)
    },
    datePremiereImmatriculationFR() {
      return formatIsoToFrDate(this.certificat.datePremiereImmatriculation)
    },
    datePremiereImmatriculationEnFranceFR() {
      return formatIsoToFrDate(this.certificat.datePremiereImmatriculationEnFrance)
    },
    erreurControlesTechniques() {
      return this.controlesTechniques.erreur
      // return 'Un problème est survenu lors de la récupération des contrôles techniques. Veuillez réessayer plus tard.'
    },
    hasProcedureVEEnCours() {
      return this.processedVehiculeData.administratif.hasProcedureVEEnCours
    },
    isCIAnnule() {
      return Boolean(
        this.processedVehiculeData &&
        this.processedVehiculeData.administratif &&
        this.processedVehiculeData.administratif.isCIAnnule,
      )
    },
    isDefaultDataDate() {
      return this.processedVehiculeData.dateMiseAJour === DEFAULT_DATE_UPDATE
    },
    isBuyer() {
      return Boolean(this.buyerId || this.buyerKey)
    },
    isHolder() {
      return Boolean(!this.buyerId && this.holderId)
    },
    isValidBuyer() {
      return Boolean(this.buyerId && this.buyerKey)
    },
    normalizedControlesTechniquesHistorique() {
      if (this.controlesTechniquesHistorique && this.controlesTechniquesHistorique.length > 0) {
        const orderedControlesTechniques = orderBy(this.controlesTechniquesHistorique, ['date'], ['desc'])

        return orderedControlesTechniques.map((controleTechnique) => {
          return {
            ...controleTechnique,
            date: formatIsoToFrDate(controleTechnique.date),
          }
        })
      }

      return []
    },
    oppositionSection() {
      return this.processedVehiculeData.administratif.opposition
    },
    reportLabels() {
      return this.processedVehiculeData.administratif.reportLabels
    },
    synthese() {
      return this.processedVehiculeData.administratif.reportLabels.synthese
    },
    titulaire() {
      return this.processedVehiculeData.titulaire
    },
    vignetteCritair() {
      return this.processedVehiculeData.vignetteCritair
    },


    // ------------------ email ---------------------

    shareReportEmail() {
      const SHARE_REPORT_EMAIL = getShareReportEmail({reportUrl: this.url})
      return mailTo(SHARE_REPORT_EMAIL)
    },
    // ----------------------------------------------
  },

  beforeMount: async function () {
    const formDataParams = this.$route.params.formData && JSON.parse(this.$route.params.formData)

    if (formDataParams) {
      // 1er accès au rapport vendeur (suite au remplissage du formulaire de recherche)
      this.formData = formDataParams
    } else {
      // accès suivant via l'url /rapport-vendeur (rafraîchissement de la page du rapport)
      const cachedFormData = sessionStorage.getItem('formData') && JSON.parse(sessionStorage.getItem('formData'))
      this.formData = cachedFormData
    }

    // Préparation des images pour la génération du CSA
    if (!this.images.csa.logoHistoVecBytes) {
      this.images.csa.logoHistoVecBytes = await fetch(logoHistoVec).then((res) => res.arrayBuffer())
    }

    if (!this.images.csa.logoMIBytes) {
      this.images.csa.logoMIBytes = await fetch(logoMI).then((res) => res.arrayBuffer())
    }

    // Calcul des informations du propriétaire pour pouvoir créer un lien acheteur et le code Partage HistoVec
    this.holderId = await this.computeHolderId()
    this.holderKey = await this.computeHolderKey()

    // Récupération de la donnée du rapport HistoVec
    let report = {}

    if (this.isRapportAcheteur) {
      if (this.isValidBuyer) {
        const buyerReportResponse = await this.getBuyerReport()
        if (buyerReportResponse === null) {
          // Cas: Aucune Reponse du back
          this.$router.push({
            name: 'erreurInattendue',
          })
          return
        }
        if (buyerReportResponse.status === 404) {
          // Cas: véhicule non trouvé
          this.$router.push({
            name: 'pageNonTrouvee',
            query: {
              errorTitle: 'Ce véhicule est inconnu d\'HistoVec',
              errorMessages: JSON.stringify([
                'Vos noms et prénoms sont susceptibles d\'avoir fait l\'objet d\'erreurs lors de la saisie de votre dossier.',
                'Recopiez exactement les données de votre certificat d\'immatriculation. Le certificat d\'immatriculation que vous utilisez n\'est peut-être pas le dernier en cours de validité (perte, vol, ...).',
              ]),
              primaryAction: JSON.stringify({
                label: 'Revenir au formulaire de recherche',
                icon: 'ri-arrow-right-fill',
                to: '/proprietaire',
              }),
            },
          })
          return
        }

        if (buyerReportResponse.status !== 200) {
          // Cas: erreur lors de la récupération du rapport (hors contrôles techniques)
          this.$router.push({
            name: 'serviceIndisponible',
          })
          return
        }

        report = buyerReportResponse.report
      } else {
        // Cas: lien acheteur invalide
        this.$router.push({
          name: 'erreurInattendue',
          query: {
            errorTitle: 'Lien de partage HistoVec invalide',
            errorMessages: JSON.stringify([
              'Veuillez demander un nouveau lien au vendeur.',
            ]),
            primaryAction: JSON.stringify({
              label: 'Demander le rapport à un vendeur',
              icon: 'ri-arrow-right-fill',
              to: '/acheteur',
            }),
          },
        })
        return
      }
    } else if (this.isRapportVendeur) {
      if (this.formData) {
        const holderReportResponse = await this.getHolderReport()
        if (holderReportResponse === null) {
          // Cas: Aucune Reponse du back
          this.$router.push({
            name: 'erreurInattendue',
          })
          return
        }
        if (holderReportResponse.status === 404) {
          // Cas: véhicule non trouvé
          this.$router.push({
            name: 'pageNonTrouvee',
            query: {
              errorTitle: 'Ce véhicule est inconnu d\'HistoVec',
              errorMessages: JSON.stringify([
                'Vos noms et prénoms sont susceptibles d\'avoir fait l\'objet d\'erreurs lors de la saisie de votre dossier.',
                'Recopiez exactement les données de votre certificat d\'immatriculation. Le certificat d\'immatriculation que vous utilisez n\'est peut-être pas le dernier en cours de validité (perte, vol, ...).',
              ]),
              primaryAction: JSON.stringify({
                label: 'Revenir au formulaire de recherche',
                icon: 'ri-arrow-right-fill',
                to: '/proprietaire',
              }),
            },
          })
          return
        }

        if (holderReportResponse.status !== 200) {
          // Cas: erreur lors de la récupération du rapport (hors contrôles techniques)
          this.$router.push({
            name: 'serviceIndisponible',
          })
          return
        }

        report = holderReportResponse.report
      } else {
        // Cas: Accès à l'url du rapport vendeur sans avoir rempli le formulaire au moins une fois
        this.$router.push({
          name: 'proprietaire',
        })
        return
      }
    } else {
      // Cas: Accès à l'url du rapport vendeur sans avoir rempli le formulaire au moins une fois
      this.$router.push({
        name: 'proprietaire',
      })
      return
    }


    const {vehicule: vehiculeData, controlesTechniques} = report

    this.processedVehiculeData = siv.processVehiculeData(vehiculeData)
    this.controlesTechniques = controlesTechniques

    const {isDonneeDisponible: areControlesTechinquesDisponibles, historique} = this.controlesTechniques

    const defaultTabTitles = [
      {title: 'Synthèse'},
      {title: 'Véhicule'},
      {title: 'Titulaire & Titre'},
      {title: 'Situation administrative'},
      {title: 'Historique'},
    ]

    this.tabTitles = (
      (areControlesTechinquesDisponibles && historique.length > 0) ?
        defaultTabTitles.concat([
          {title: 'Contrôles techniques'},
          {title: 'Kilométrage'},
        ]) :
        defaultTabTitles
    )

    // @todo: Implémenter un mécanisme de notification dans la DsfrModal
    // pour confirmer visuellement la prise en compte des actions
    this.modaleActions = [
      {
        label: 'Envoyer le lien par mail',
        icon: 'ri-send-plane-fill',
        secondary: true,
        onClick: this.onClickMailLienPartage,
      },
      {
        label: 'Copier le lien',
        icon: 'ri-clipboard-line',
        onClick: this.onClickCopyLienPartage,
      },
    ]

    if (this.flags.codePartage) {
      this.modaleActions.push({
        label: 'Copier le \'Code partage HistoVec\'',
        icon: 'ri-clipboard-line',
        secondary: true,
        onClick: this.onClickCopyCodePartage,
      })
    }

    if (!areControlesTechinquesDisponibles) {
      await this.logKilometersError()
    }
  },

  methods: {
    getVignetteCritairImage(vignetteCritair) {
      // @todo @lazyLoadCritairImage2 lazy loader les images dynamiquement

      if (vignetteCritair === VIGNETTE[1]) {
        return this.images.critair.logoVignetteCritair1
      }

      if (vignetteCritair === VIGNETTE[2]) {
        return this.images.critair.logoVignetteCritair2
      }

      if (vignetteCritair === VIGNETTE[3]) {
        return this.images.critair.logoVignetteCritair3
      }

      if (vignetteCritair === VIGNETTE[4]) {
        return this.images.critair.logoVignetteCritair4
      }

      if (vignetteCritair === VIGNETTE[5]) {
        return this.images.critair.logoVignetteCritair5
      }

      if (vignetteCritair === VIGNETTE['ELECTRIQUE']) {
        return this.images.critair.logoVignetteCritairElectrique
      }

      return
    },

    // ModalPartagerRapport
    onCloseModalPartagerRapport() {
      this.modalPartagerRapport.opened = false
    },
    async onOpenModalPartagerRapport() {
      // @todo @copyLink2: On force la copie du lien à l'ouverture de la modale
      // en attendant de corriger le bug de copie du lien dans bouton de la modale
      this.utils.copyText(this.url)

      await this.logPartageDuRapport()
      this.modalPartagerRapport.opened = true
    },

    // Tabs
    async onTabSelected() {
      switch (this.currentTab) {
        case (this.constants.REPORT_TABS.SYNTHESE):
          await api.log(`${this.$route.path}/synthesis`)
          break;
        case (this.constants.REPORT_TABS.VEHICULE):
          await api.log(`${this.$route.path}/vehicle`)
          break;
        case (this.constants.REPORT_TABS.TITULAIRE_ET_TITRE):
          await api.log(`${this.$route.path}/holder`)
          break
        case (this.constants.REPORT_TABS.SITUATION_ADMINISTRATIVE):
          await api.log(`${this.$route.path}/administrative-status`)
          break
        case (this.constants.REPORT_TABS.HISTORIQUE):
          await api.log(`${this.$route.path}/history`)
          break
        case (this.constants.REPORT_TABS.CONTROLES_TECHNIQUES):
          await api.log(`${this.$route.path}/technical-control`)
          break
        case (this.constants.REPORT_TABS.KILOMETRAGE):
          await api.log(`${this.$route.path}/kilometers`)
          break
        default:
          break
      }
    },
    async selectTab(idx) {
      this.tabs.asc = this.tabs.selectedTabIndex < idx
      this.tabs.selectedTabIndex = idx

      await this.onTabSelected(idx)
    },

    async computeHolderId() {
      if (!this.formData) {
        return null
      }

      const id = `${this.titulaireId}${this.vehicleId}${this.currentMonthNumber}`
      const normalizedId = normalizeIdvAsDataPreparation(id)

      const hashedIdBuffer = await hash(normalizedId)
      const holderId = base64Encode(hashedIdBuffer)

      /* ------------------ @todo @urlUnsafe6: Supprimer bloc de code ------------------ */
      // Ces logs sont utiles pour debugger un éventuel souci sur la migration
      // de l'ancien format des liens acheteur (urlSafeBase64Encoded)
      // vers le nouveau format des liens acheteurs (urlUnsafeBase64Encoded)

      // eslint-disable-next-line no-console
      console.log(`[NEW] id base64Encoded = ${this.holderId}`)

      const urlSafeBase64EncodedId = urlSafeBase64Encode(base64Decode(holderId))
      // eslint-disable-next-line no-console
      console.log(`[OLD] id urlSafeBase64Encoded = ${urlSafeBase64EncodedId}`)

      // eslint-disable-next-line no-console
      console.log(`[ID] are they different ? ${holderId !== urlSafeBase64EncodedId}`)
      /* ------------------------------------------------------------------------------------------ */

      return holderId
    },

    async computeHolderKey() {
      if (!this.formData) {
        return null
      }

      const normalizedKey = normalizeKeyAsDataPreparation(this.vehicleId)
      const hashedKeyBuffer = await hash(normalizedKey)
      const holderKey = base64Encode(hashedKeyBuffer)
      // @todo @urlUnsafe5 : remove these logs while transition done (8th day of the next month after 'HistoVec code partage' feature deployement)
      // eslint-disable-next-line no-console
      console.log(`[NEW] key base64Encoded = ${holderKey}`)

      const urlSafeBase64EncodedKey = urlSafeBase64Encode(base64Decode(holderKey))
      // eslint-disable-next-line no-console
      console.log(`[OLD] key urlSafeBase64Encoded = ${urlSafeBase64EncodedKey}`)

      // eslint-disable-next-line no-console
      console.log(`[KEY] are they different ? ${holderKey !== urlSafeBase64EncodedKey}`)

      return holderKey
    },

    async getBuyerReport() {
      const data = {
        id: this.buyerId,
        key: this.buyerKey,
      }

      const report = await reportService.getBuyerReport(data, {ignoreUtacCache: this.flags.ignoreUtacCache})

      return report
    },

    async getHolderReport() {
      const data = {
        id: this.holderId,
        formData: this.formData,
      }

      const report = await reportService.getHolderReport(data, {ignoreUtacCache: this.flags.ignoreUtacCache})
      return report
    },
    async generatePdf() {
      await api.log(`${this.$route.path}/csa/download`)

      const {
        dateMiseAJour,
        administratif: {
          isCIAnnule,
          csaLabels,
          dateAnnulationCI,
        },
        caracteristiquesTechniques: {
          marque,
          vin,
        },
        certificat: {
          datePremiereImmatriculation,
        },
      } = this.processedVehiculeData

      const numeroImmatriculation = this.typeImmatriculation === TYPE_IMMATRICULATION.SIV ? this.formData.siv.numeroImmatriculation : this.formData.fni.numeroImmatriculation

      const csaPdfBytes = await generateCsa({
          isCIAnnule,
          annulationCurrentStatus: csaLabels.annulationCurrentStatus,
          dateAnnulationCI,
          dateDonnees: this.flags.showDataDate ? dateMiseAJour : null,
          histoVecLogoBytes: this.images.csa.logoHistoVecBytes,
          marianneImageBytes: this.images.csa.logoMIBytes,
          marque,
          // @todo: @renamePlaque
          // Renommer PARTOUT DANS LE CODE le mot "plaque"/"plaque d'immatriculation" en "numero d'immatriculation"
          // que ce soit en nom de variable ou en texte descriptif
          plaque: numeroImmatriculation,
          premierCertificat: datePremiereImmatriculation,
          qrCodeUrl: this.url,
          validityDate: this.validityDate,
          vin,
          webSiteUrl: this.baseUrl,
        },
        (
          !isCIAnnule ? {
            duplicataTitre: csaLabels.titre.duplicata,
            dvsCurrentStatusLines: csaLabels.dvsCurrentStatusLines,
            gagesCurrentStatusLines: csaLabels.gagesCurrentStatusLines,
            historyItems: this.processedVehiculeData.historique.map((item) => `${item.date} ${item.nature}`),
            otcisCurrentStatusLines: csaLabels.otcisCurrentStatusLines,
            otcisPVCurrentStatusLines: csaLabels.otcisPVCurrentStatusLines,
            oveisCurrentStatusLines: csaLabels.oveisCurrentStatusLines,
            ovesCurrentStatusLines: csaLabels.ovesCurrentStatusLines,
            perteTitre: csaLabels.titre.perte,
            proceduresReparationControleeStatus: csaLabels.proceduresReparationControleeStatus,
            suspensionsCurrentStatusLines: csaLabels.suspensionsCurrentStatusLines,
            volTitre: csaLabels.titre.vol,
            volVehicule: csaLabels.vol,
          } : {}
        ))

      this.csaObjectURL = downloadBlob(
        new Blob([csaPdfBytes], {type: 'application/pdf'}),
        `${RAPPORT_FILENAME}.pdf`,
      )
    },

    /** DsfrBadge **/
    getDsfrBadgeType(resultatControleTechnique) {
      if (resultatControleTechnique === RESULTAT.A || resultatControleTechnique === RESULTAT.AP) {
        return 'success'
      }
      if (resultatControleTechnique === RESULTAT.S || resultatControleTechnique === RESULTAT.SP) {
        return 'warning'
      }
      if (resultatControleTechnique === RESULTAT.R || resultatControleTechnique === RESULTAT.RP) {
        return 'error'
      }
      // RESULTAT.X or undefined => undefined (Grey color for DsfrBadge)
    },

    /** logs **/
    async logSimplimmatImage() {
      await api.log(`${this.$route.path}/simplimmat/image`)
    },
    async logSimplimmatLink() {
      await api.log(`${this.$route.path}/simplimmat/link`)
    },
    async logPartageDuRapport() {
      await api.log(`${this.$route.path}/share`)
    },
    async logCopieLienPartage() {
      await api.log(`${this.$route.path}/share/copy`)
    },
    async logCopieCodePartage() {
      await api.log(`${this.$route.path}/share/code-partage`)
    },
    async logMailLienPartage() {
      await api.log(`${this.$route.path}/share/mail`)
    },
    async logMonAvisImage() {
      await api.log(`${this.$route.path}/mon-avis/image`)
    },
    async logKilometersError() {
      await api.log(`${this.$route.path}/kilometers-error`)
    },

    async onClickCopyLienPartage() {
      // @todo @copyLink3: la copie ne s'effectue pas dans le cadre de la modale,
      // malgré la configuration de VueClipboard dans le main.js
      // On force donc la copie de l'url à l'ouverture de la modale pour dépanner.
      // PS: la lib '@soerenmartius/vue3-clipboard' a été testée sans succès

      // this.utils.copyText(this.url)
      await this.logCopieLienPartage()
      this.onCloseModalPartagerRapport()
    },

    async onClickCopyCodePartage() {
      // @todo @codePartage2: pré-requis @copyLink
      // la copie ne s'effectue pas dans le cadre de la modale,
      // malgré la configuration de VueClipboard dans le main.js
      // On ne peut pas forcer 2 copies en même temps à l'ouverture de la modale
      // /!\ Cette feature ne pourra fonctionner qu'après correction du bug copy clipboard dans la DsfrModale /!\

      // this.utils.copyText(this.codePartageHistoVec)
      await this.logCopieCodePartage()
      this.onCloseModalPartagerRapport()
    },

    async onClickMailLienPartage() {
      window.location = this.shareReportEmail

      await this.logMailLienPartage()
      this.onCloseModalPartagerRapport()
    },
  },
})
</script>

<template>
  <div class="fr-grid-row  fr-grid-row--gutters  fr-mb-4w">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="breadcrumbLinks"
      />
    </div>

    <div class="fr-col-lg-4  fr-col-xl-4">
      <div class="fr-content-media" v-if="isRapportVendeur">
        <img
          class="fr-img-responsive fr-pl-2v"
          alt="Illustration de la page du rapport vendeur HistoVec"
          src="../../src/assets/img/rapport.svg"
          style="width:100%"
        >
      </div>
      <div class="fr-content-media" v-if="isRapportAcheteur">
        <img
          class="fr-img-responsive fr-pl-2v"
          alt="Illustration de la page du rapport acheteur HistoVec"
          src="../../src/assets/img/acheteur.svg"
          style="width:100%"
        >
      </div>
    </div>

    <div
      v-if="isRapportVendeur"
      class="fr-col-12  fr-col-lg-8  fr-col-xl-8  fr-mt-10v"
    >
      <h1>Rapport de votre véhicule</h1>
      <h2>Consultez et partagez l'historique du véhicule</h2>
      <div class="fr-grid-row  fr-grid-row--gutters">
        <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6  fr-mt-2w  text-center">
          <a
            id="monAvisImage"
            href="https://voxusagers.numerique.gouv.fr/Demarches/1867?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=8a933f17a9df32bb39598522e6d48688"
            rel="noopener noreferrer"
            target="_blank"
            @click="logMonAvisImage"
          >
            <img
              class="fr-responsive-img"
              style="height: 5rem;"
              src="https://voxusagers.numerique.gouv.fr/static/bouton-blanc.svg"
              alt="Lien vers un formulaire permettant de donner son avis sur la démarche HistoVec"
              title="Je donne mon avis sur cette démarche"
            />
          </a>
        </div>
      </div>
    </div>

    <div
      v-if="isRapportAcheteur"
      class="fr-col-12  fr-col-lg-8  fr-col-xl-8  fr-mt-10v"
    >
      <h1>Rapport du véhicule</h1>
      <h2>Consultez l'historique du véhicule</h2>
      <div class="fr-grid-row  fr-grid-row--gutters">
        <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6  fr-mt-2w  text-center">
          <a
            id="monAvisImage"
            href="https://voxusagers.numerique.gouv.fr/Demarches/1867?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=8a933f17a9df32bb39598522e6d48688"
            rel="noopener noreferrer"
            target="_blank"
            @click="logMonAvisImage"
          >
            <img
              class="fr-responsive-img"
              style="height: 5rem;"
              src="https://voxusagers.numerique.gouv.fr/static/bouton-blanc.svg"
              alt="Lien vers un formulaire permettant de donner son avis sur la démarche HistoVec"
              title="Je donne mon avis sur cette démarche"
            />
          </a>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="flags.outdatedData"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-3w"
  >
    <div class="fr-col-12  fr-col-lg-8  fr-col-xl-8">
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
    v-if="flags.outdatedData && isRapportVendeur"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w"
  >
    <div class="fr-col-12  fr-col-md-5  fr-col-lg-4  fr-col-xl-4  text-center">
      <HistoVecButtonLink
        label="Obtenir le CSA à jour via l'ANTS"
        to="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
      />
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-6w">
    <div class="fr-col-12  fr-col-lg-5  fr-col-xl-5">
      <DsfrTiles
        :tiles="tilesVehiculeLinks"
        :horizontal="true"
      />
    </div>
    <div class="fr-col-12  fr-col-lg-5  fr-col-xl-5">
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
    <div class="fr-col-12  fr-col-lg-11  fr-col-xl-11">
      <!-- @todo @reportAccordeon : pour la vue mobile sm et xs : utiliser un accordeon ? -->
      <DsfrTabs
        tab-list-name="Liste d'onglets du rapport du véhicule"
        :tab-titles="tabTitles"
        @select-tab="selectTab"
      >
        <DsfrTabContent
          panel-id="report-tab-content-0"
          tab-id="report-tab-0"
          :selected="tabs.selectedTabIndex === 0"
          :asc="tabs.asc"
        >
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-pb-3w">
              <h5 class="fr-mb-0">
                Résumé
              </h5>
            </div>

            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <div class="fr-pb-3w  fr-pt-0">
                <h6 class="fr-mb-0  fr-pb-2w">
                  Modèle
                </h6>

                <p class="fr-text--md  fr-blue-text  fr-mb-1v">
                  {{ caracteristiquesTechniques.marque }} {{ caracteristiquesTechniques.modele }}
                </p>

                <p
                  v-if="caracteristiquesTechniques.puissance.cv"
                  class="fr-text--md  fr-mb-1v"
                >
                  Puissance fiscale : <span class="fr-blue-text">{{ caracteristiquesTechniques.puissance.cv }} ch</span>
                </p>

                <p
                  v-if="isRapportAcheteur"
                  class="fr-text--md  fr-mb-1v"
                >
                  Calculez le montant de votre certificat d'immatriculation
                  <br/>
                  <a
                    class="fr-link"
                    href="https://siv.interieur.gouv.fr/map-usg-ui/do/simtax_accueil"
                    rel="noopener noreferrer"
                    target="_blank"
                    title="Simulateur"
                  >
                    Accédez au simulateur de calcul
                  </a>
                </p>
              </div>

              <div
                v-if="processedVehiculeData.usage.vehiculeDeCollection || processedVehiculeData.usage.vehiculeAgricole"
                class="fr-pb-3w  fr-pt-0"
              >
                <h6 class="fr-mb-0  fr-pb-2w">
                  Usage
                </h6>

                <p class="fr-text--md  fr-mb-2w">
                  <span class="fr-blue-text">
                    <VIcon
                      :name="constants.USAGE_COLLECTION.icon"
                    />
                  </span>
                  {{ constants.USAGE_COLLECTION.text }}
                  <br/>
                  <span
                    v-if="constants.USAGE_COLLECTION.adv"
                    class="fr-text--md  fr-mb-1w"
                  >
                    <a
                      class="fr-link"
                      :href="constants.USAGE_COLLECTION.link"
                      rel="noopener noreferrer"
                      target="_blank"
                      :title="constants.USAGE_COLLECTION.adv"
                    >
                      {{ constants.USAGE_COLLECTION.adv }}
                    </a>
                  </span>
                </p>

                <p class="fr-text--md  fr-mb-0">
                  <span class="fr-blue-text">
                    <VIcon
                      :name="constants.USAGE_AGRICOLE.icon"
                    />
                  </span>
                  {{ constants.USAGE_AGRICOLE.text }}
                  <br/>
                  <!-- @todo @agricoleLink2: décommenter cette section -->
                  <!-- <span
                    v-if="constants.USAGE_AGRICOLE.adv"
                    class="fr-text--md  fr-mb-1w"
                  >
                    <a
                      class="fr-link"
                      :href="constants.USAGE_AGRICOLE.link"
                      rel="noopener noreferrer"
                      target="_blank"
                      :title="constants.USAGE_AGRICOLE.adv"
                    >
                      {{ constants.USAGE_AGRICOLE.adv }}
                    </a>
                  </span> -->
                </p>
              </div>

              <div class="fr-pb-0  fr-pt-0">
                <h6 class="fr-mb-0  fr-pb-0">
                  Propriétaire actuel
                </h6>

                <p class="fr-text--md  fr-mb-0">
                  <span class="fr-blue-text">{{ processedVehiculeData.titulaire.identite }}</span>
                  depuis
                  <span
                    v-if="certificat.nombreDeMoisDepuisDateEmissionCertificatImmatriculation"
                    class="fr-blue-text"
                  >
                    {{ certificat.nombreDeMoisDepuisDateEmissionCertificatImmatriculation }}
                  </span>
                  <span
                    v-if="!certificat.nombreDeMoisDepuisDateEmissionCertificatImmatriculation"
                    class="fr-blue-text"
                  >
                    une durée inconnue
                  </span>
                  <br/>
                  <template v-if="!certificat.isVehiculeImporteDepuisEtranger">
                    <template v-if="isRapportVendeur">
                      Vous êtes le
                      <span class="fr-blue-text">{{ processedVehiculeData.titulairesCount }}</span>
                      <sup class="fr-blue-text">{{ utils.getExposant(processedVehiculeData.titulairesCount) }}</sup>
                      titulaire de ce véhicule
                    </template>
                    <template v-if="isRapportAcheteur">
                      Ce véhicule a déjà eu
                      <span class="fr-blue-text">{{ processedVehiculeData.titulairesCount }}</span>
                      titulaire(s), en l'achetant vous serez le
                      <span class="fr-blue-text">{{ processedVehiculeData.titulairesCount + 1 }}</span>
                      <sup class="fr-blue-text">{{ utils.getExposant(processedVehiculeData.titulairesCount + 1) }}</sup>
                    </template>
                  </template>
                  <br/>
                  <template v-if="certificat.isVehiculeImporteDepuisEtranger">
                    Le nombre exact de titulaires ne peut être calculé avec précision
                    <br/>
                    (première immatriculation à l'étranger)
                  </template>
                </p>
              </div>
            </div>

            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <div class="fr-pb-3w  fr-pt-0">
                <h6 class="fr-mb-0  fr-pb-2w">
                  Immatriculation
                </h6>

                <p class="fr-text--md  fr-mb-1v">
                  <template v-if="datePremiereImmatriculationFR">
                    Première immatriculation le
                    <span class="fr-blue-text">{{ datePremiereImmatriculationFR }}</span>
                  </template>

                  <template v-if="!datePremiereImmatriculationFR">
                    Date de première immatriculation <span class="fr-blue-text">inconnue</span>
                  </template>
                </p>

                <template v-if="certificat.isVehiculeImporteDepuisEtranger">
                  <p class="fr-text--md  fr-blue-text  fr-mb-1v">
                    <span class="fr-blue-text">
                      <VIcon
                        name="ri-earth-line"
                      />
                    </span>
                    Ce véhicule a été <span class="fr-blue-text">importé</span>
                    <span
                      v-if="isRapportAcheteur"
                      class="fr-blue-text"
                    >
                      Vérifier les options incluses qui peuvent être différentes
                    </span>
                  </p>
                </template>
              </div>

              <div class="fr-pb-3w  fr-pt-0">
                <h6 class="fr-mb-0  fr-pb-2w">
                  Situation administrative
                </h6>

                <p
                  v-if="processedVehiculeData.hasSinistre || hasProcedureVEEnCours"
                  class="fr-text--md  fr-mb-1v"
                >
                  <span class="fr-blue-text">
                    <VIcon
                      :name="processedVehiculeData.isApte ? 'ri-thumb-up-line' : 'ri-error-warning-fill'"
                    />
                  </span>
                  <!-- état - un seul sinistre !-->
                  <template
                    v-if="processedVehiculeData.sinistresCount === 1 || (processedVehiculeData.sinistresCount === 0 && hasProcedureVEEnCours)">
                    Ce véhicule a eu <span class="fr-blue-text">un sinistre déclaré</span>
                    <span
                      v-if="processedVehiculeData.sinistresCount === 1"
                      class="fr-blue-text"
                    >
                      en {{ processedVehiculeData.lastSinistreYear }}
                    </span>
                    <br/>
                    <template v-if="processedVehiculeData.isApte">
                      et
                      <span class="fr-blue-text"> déclaré apte à circuler</span>
                      <span
                        v-if="!processedVehiculeData.isApte"
                        class="fr-blue-text"
                      >
                        en {{ processedVehiculeData.lastResolutionYear }}
                      </span>
                    </template>
                  </template>
                  <!-- état - plusieurs sinistres !-->
                  <template v-if="processedVehiculeData.sinistresCount > 1">
                    Ce véhicule a eu
                    <span class="fr-blue-text">plusieurs sinistres</span>
                    , dont le dernier déclaré en <span class="fr-blue-text">{{
                      processedVehiculeData.lastSinistreYear
                    }}</span>
                    <br/>
                    <template v-if="processedVehiculeData.isApte">
                      Le véhicule a été
                      <span class="fr-blue-text"> déclaré apte à circuler</span>
                      <span
                        v-if="!processedVehiculeData.isApte"
                        class="fr-blue-text"
                      >
                        en {{ processedVehiculeData.lastResolutionYear }}
                      </span>
                    </template>
                  </template>
                  <!-- @todo @redirectTab: Voir avec la DSR s'il est utile de rediriger vers l'ongler "Historique" ? -->
                  <br/>
                  <!-- Commentaire: un ou plusieurs sinistres -->
                  <span
                    v-if="processedVehiculeData.isApte"
                    class="fr-blue-text"
                  >
                    {{ assets.syntheseMapping[(isRapportVendeur ? 'fin_ove_vendeur' : 'fin_ove_acheteur')].adv }}
                  </span>
                  <span
                    v-else
                    class="fr-blue-text"
                  >
                    {{ assets.syntheseMapping['ove'].adv }}
                  </span>

                  <br/>
                  <span
                    v-if="processedVehiculeData.hasSinistre && processedVehiculeData.sinistresCount > 1"
                    class="fr-blue-text"
                  >
                    {{ assets.syntheseMapping['multi_ove'].adv }}
                  </span>
                </p>

                <p
                  v-if="synthese.length === 0 && !processedVehiculeData.lastSinistreYear"
                  class="fr-text--md  fr-mb-1v"
                >
                  <span class="fr-blue-text">
                    <VIcon
                      name="ri-check-line"
                    />
                  </span>
                  <span class="fr-blue-text">Rien à signaler </span>
                  <br/>
                  (gages, opposition, vol,...)
                </p>

                <p
                  v-for="(entry, index) in synthese"
                  :key="index"
                >
                  <span class="fr-blue-text">
                    <VIcon
                      :name="assets.syntheseMapping[entry].icon"
                    />
                  </span>
                  {{ assets.syntheseMapping[entry].text }}
                  <!-- @todo: Voir avec la DSR s'il est utile de rediriger vers l'ongler "Situation administrative" ? -->
                  <br/>
                  {{ assets.syntheseMapping[entry].adv }}
                  <br/>
                  <a
                    v-if="assets.syntheseMapping[entry].link"
                    class="fr-link"
                    :href="assets.syntheseMapping[entry].link"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    En savoir plus
                  </a>
                </p>
              </div>

              <div class="fr-pb-3w  fr-pt-0">
                <h6 class="fr-mb-0  fr-pb-2w">
                  Crit'Air
                  <img
                    v-if="vignetteCritair !== constants.VIGNETTE.NON_CLASSE"
                    class="fr-img-responsive"
                    style="height: 1.5rem;"
                    :src="getVignetteCritairImage(vignetteCritair)"
                    alt="Vignette Critair"
                    title="Vignette Critair"
                  >
                </h6>
                <p
                  v-if="vignetteCritair"
                  class="fr-text--md  fr-mb-1v"
                >
                  <span
                    v-if="vignetteCritair === constants.VIGNETTE.NON_CLASSE"
                    class="fr-blue-text"
                  >
                    <VIcon
                      name="ri-question-line"
                    />
                  </span>

                  <span
                    v-if="vignetteCritair !== constants.VIGNETTE.NON_CLASSE"
                    class="fr-blue-text"
                  >
                    {{ assets.syntheseMapping['critair'].text }} {{ vignetteCritair }}
                  </span>
                  <span
                    v-if="vignetteCritair === constants.VIGNETTE.NON_CLASSE"
                    class="fr-blue-text"
                  >
                    {{ assets.syntheseMapping['critair_non_classe'].text }}
                  </span>
                  <br/>

                  {{ assets.syntheseMapping['critair'].adv }}
                  <br/>
                  <a
                    v-if="assets.syntheseMapping['critair'].link"
                    class="fr-link"
                    :href="assets.syntheseMapping['critair'].link"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    En savoir plus
                  </a>
                </p>

                <p
                  v-if="!vignetteCritair && !processedVehiculeData.usage.vehiculeDeCollection"
                  class="fr-text--md  fr-mb-1v"
                >
                  <span
                    class="fr-blue-text"
                  >
                    <VIcon
                      name="ri-indeterminate-circle-fill"
                    />
                  </span>
                  Votre véhicule ne répond pas aux critères retenus pour l'attribution d'une vignette Crit'air ou les
                  informations dont nous disposons sont insuffisantes

                  {{ assets.syntheseMapping['critair'].adv }}
                  <br/>
                  <a
                    v-if="assets.syntheseMapping['critair'].link"
                    class="fr-link"
                    :href="assets.syntheseMapping['critair'].link"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    En savoir plus
                  </a>
                </p>
              </div>
            </div>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="report-tab-content-1"
          tab-id="report-tab-1"
          :selected="tabs.selectedTabIndex === 1"
          :asc="tabs.asc"
        >
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-pb-2w">
              <h6 class="fr-mb-0">
                Caractéristiques techniques
              </h6>
            </div>

            <div class="fr-col-6  fr-pt-0  fr-pb-1w">
              Marque
            </div>
            <div class="fr-col-2  fr-pt-0  fr-pb-1w">
              D.1
            </div>
            <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
              {{ caracteristiquesTechniques.marque }}
            </div>

            <div class="fr-col-6  fr-pt-0  fr-pb-1w">
              Type variante version
            </div>
            <div class="fr-col-2  fr-pt-0  fr-pb-1w">
              D.2
            </div>
            <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
              {{ caracteristiquesTechniques.tvv }}
            </div>

            <div class="fr-col-6  fr-pt-0  fr-pb-1w">
              Numéro CNIT
            </div>
            <div class="fr-col-2  fr-pt-0  fr-pb-1w">
              D.2.1
            </div>
            <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
              {{ caracteristiquesTechniques.cnit }}
            </div>

            <div class="fr-col-6  fr-pt-0  fr-pb-1w">
              Nom commercial
            </div>
            <div class="fr-col-2  fr-pt-0  fr-pb-1w">
              D.3
            </div>
            <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
              {{ caracteristiquesTechniques.modele }}
            </div>

            <div class="fr-col-6  fr-pt-0  fr-pb-1w">
              Couleur
            </div>
            <div class="fr-col-2  fr-pt-0  fr-pb-1w">
            </div>
            <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
              {{ caracteristiquesTechniques.couleur }}
            </div>

            <div class="fr-col-6  fr-pt-0  fr-pb-1w">
              Type de réception
            </div>
            <div class="fr-col-2  fr-pt-0  fr-pb-1w">
            </div>
            <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
              {{ caracteristiquesTechniques.reception.type }}
            </div>

            <div class="fr-col-6  fr-pt-0  fr-pb-1w">
              Numéro d'identification véhicule
            </div>
            <div class="fr-col-2  fr-pt-0  fr-pb-1w">
              E
            </div>
            <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
              {{ caracteristiquesTechniques.vin }}
            </div>

            <template v-if="caracteristiquesTechniques.PT.admissible">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                PT techniquement admissible (kg)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                F.1
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.PT.admissible }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.AC">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                PTAC (kg)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                F.2
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.PT.AC }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.RA">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                PTRA (kg)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                F.3
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.PT.RA }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.service">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                PT en service (kg)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                G
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.PT.service }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.AV">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                PTAV (kg)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                G.1
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.PT.AV }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.categorie">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Catégorie (CE)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                J
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.categorie }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.genre">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Genre (National)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                J.1
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.genre }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.carrosserie.ce">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Carrosserie (CE)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                J.2
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.carrosserie.ce }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.carrosserie.national">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Carrosserie (National)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                J.3
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.carrosserie.national }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.reception.numero">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Numéro de réception
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                K
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.reception.numero }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.cylindres">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Cylindrée (cm3)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                P.1
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.puissance.cylindres }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.nette">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Puissance nette max (kW)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                P.2
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.puissance.nette }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.energie">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Energie
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                P.3
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.energie }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.cv">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Puissance CV
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                P.6
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.puissance.cv }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.norm">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Puissance / masse (kW/kg)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                Q
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.puissance.norm }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.places.assis">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Places assises
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                S.1
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.places.assis }}
              </div>
            </template>

            <div class="fr-col-6  fr-pt-0  fr-pb-1w">
              Places debout
            </div>
            <div class="fr-col-2  fr-pt-0  fr-pb-1w">
              S.2
            </div>
            <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
              <template v-if="caracteristiquesTechniques.places.debout">
                {{ caracteristiquesTechniques.places.debout }}
              </template>
            </div>

            <template v-if="caracteristiquesTechniques.db">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Niveau sonore (db(A))
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                U.1
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.db }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.moteur">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Vitesse moteur (min-1)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                U.2
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.moteur }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.co2">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                CO2 (g/km)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                V.7
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.co2 }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.environnement">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Classe environnement (CE)
              </div>
              <div class="fr-col-2  fr-pt-0  fr-pb-1w">
                V.9
              </div>
              <div class="fr-col-4  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ caracteristiquesTechniques.environnement }}
              </div>
            </template>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="report-tab-content-2"
          tab-id="report-tab-2"
          :selected="tabs.selectedTabIndex === 2"
          :asc="tabs.asc"
        >
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-pb-2w">
              <h6 class="fr-mb-0">
                Titulaire & Titre
              </h6>
            </div>

            <template v-if="titulaire.nature">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Nature
              </div>
              <div class="fr-col-6  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ titulaire.nature }}
              </div>
            </template>

            <div class="fr-col-6  fr-pt-0  fr-pb-1w">
              Identité
            </div>
            <div class="fr-col-6  fr-pt-0  fr-pb-1w  fr-blue-text">
              {{ titulaire.identite }}
            </div>

            <div class="fr-col-6  fr-pt-0  fr-pb-0">
              Code postal
            </div>
            <div class="fr-col-6  fr-pt-0  fr-pb-0  fr-blue-text">
              {{ titulaire.adresse }}
            </div>

            <div class="fr-col-12  fr-pt-3w  fr-pb-2w">
              <h6 class="fr-mb-0">
                Certificat d'immatriculation
              </h6>
            </div>

            <div class="fr-col-6  fr-pt-0  fr-pb-1w">
              Date de première immatriculation
              <span v-if="certificat.isVehiculeImporteDepuisEtranger">
                à l'étranger
              </span>
            </div>
            <div class="fr-col-6  fr-pt-0  fr-pb-1w  fr-blue-text">
              {{ datePremiereImmatriculationFR }}
            </div>

            <template v-if="certificat.isVehiculeImporteDepuisEtranger">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Date de première immatriculation en France
              </div>
              <div class="fr-col-6  fr-pt-0  fr-pb-1w  fr-blue-text">
                {{ datePremiereImmatriculationEnFranceFR }}
              </div>
            </template>

            <div class="fr-col-6  fr-pt-0  fr-pb-0">
              Date du certificat d'immatriculation actuel
            </div>
            <div class="fr-col-6  fr-pt-0  fr-pb-0  fr-blue-text">
              {{ dateEmissionCIFR }}
            </div>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="report-tab-content-3"
          tab-id="report-tab-3"
          :selected="tabs.selectedTabIndex === 3"
          :asc="tabs.asc"
        >
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-col-md-6  fr-col-lg-6  fr-col-xl-6">
              <div class="fr-grid-row  fr-grid-row--gutters">
                <div class="fr-col-12  fr-pb-2w">
                  <h6 class="fr-mb-0">
                    Gages
                    <span>
                      <a
                        class="fr-link"
                        :href="assets.syntheseMapping['otci'].link"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                      </a>
                    </span>
                  </h6>
                </div>
                <div class="fr-col-12  fr-pb-0  fr-pt-0">
                  <p class="fr-text--md">
                    <span
                      v-for="(gageInfos, index) in reportLabels.gagesInfos"
                      :key="index"
                    >
                      <span v-if="gageInfos.date">{{ gageInfos.date }} - </span>
                      <span class="fr-blue-text">{{ gageInfos.label }}</span>
                    </span>
                  </p>
                </div>

                <div class="fr-col-12  fr-pb-2w  fr-pt-0">
                  <h6 class="fr-mb-0">
                    Oppositions
                    <span>
                      <a
                        class="fr-link"
                        :href="assets.syntheseMapping['otci'].link"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                      </a>
                    </span>
                  </h6>
                </div>
                <div class="fr-col-12  fr-pb-0  fr-pt-0">
                  <p class="fr-text--md">
                    <span
                      v-for="(oppositionInfos, index) in reportLabels.oppositionsInfos"
                      :key="index"
                    >
                      <span v-if="oppositionInfos.date">{{ oppositionInfos.date }} - </span>
                      <span class="fr-blue-text">{{ oppositionInfos.label }}</span>
                      <span
                        v-if="isRapportVendeur && oppositionInfos.label.includes('PV') && oppositionSection.hasOtciPV"
                      >
                        ( Appelez le 08 21 08 00 31 )
                      </span>
                    </span>
                  </p>
                </div>

                <div class="fr-col-12  fr-pb-2w  fr-pt-0">
                  <h6 class="fr-mb-0">
                    Véhicule
                  </h6>
                </div>
                <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-3w  fr-pt-0">
                  Déclaré volé
                </div>
                <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-3w  fr-pt-0  fr-blue-text">
                  {{ reportLabels.vol }}
                </div>
              </div>
            </div>

            <div class="fr-col-12  fr-col-md-6  fr-col-lg-6  fr-col-xl-6">
              <div class="fr-grid-row  fr-grid-row--gutters">
                <div class="fr-col-12  fr-pb-2w">
                  <h6 class="fr-mb-0">
                    Déclarations valant saisie
                  </h6>
                </div>
                <div class="fr-col-12  fr-pb-0  fr-pt-0">
                  <p class="fr-text--md">
                    <span
                      v-for="(dvs, index) in reportLabels.dvsInfos"
                      :key="index"
                    >
                      <span v-if="dvs.date">{{ dvs.date }} - </span>
                      <span class="fr-blue-text">{{ dvs.label }}</span>
                    </span>
                  </p>
                </div>

                <div class="fr-col-12  fr-pb-2w  fr-pt-0">
                  <h6 class="fr-mb-0">
                    Suspensions
                  </h6>
                </div>
                <div class="fr-col-12  fr-pb-0  fr-pt-0">
                  <p class="fr-text--md">
                    <span
                      v-for="(suspensionInfos, index) in reportLabels.suspensionsInfos"
                      :key="index"
                    >
                      <span v-if="suspensionInfos.date">{{ suspensionInfos.date }} - </span>
                      <span class="fr-blue-text">{{ suspensionInfos.label }}</span>
                    </span>
                  </p>
                </div>

                <div class="fr-col-12  fr-pb-2w  fr-pt-0">
                  <h6 class="fr-mb-0">
                    Certificat d'immatriculation
                  </h6>
                </div>
                <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-0  fr-pt-0">
                  Déclaré volée
                </div>
                <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-0  fr-pt-0  fr-blue-text">
                  {{ reportLabels.titre.vol }}
                </div>
                <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-0  fr-pt-0">
                  Déclaré perdue
                </div>
                <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-0  fr-pt-0  fr-blue-text">
                  {{ reportLabels.titre.perte }}
                </div>
                <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-3w  fr-pt-0">
                  Duplicata
                </div>
                <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-3w  fr-pt-0  fr-blue-text">
                  {{ reportLabels.titre.duplicata }}
                </div>
              </div>
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
            <template v-if="certificat.isVehiculeImporteDepuisEtranger">
              <div class="fr-col-12  fr-pb-3w">
                <h5 class="fr-mb-0">
                  Historique des opérations à l'étranger
                </h5>
              </div>
              <div class="fr-col-2  fr-pb-2w  fr-pt-0">
                <h6 class="fr-mb-0">
                  Date
                </h6>
              </div>
              <div class="fr-col-10  fr-pb-2w  fr-pt-0">
                <h6 class="fr-mb-0">
                  Opération
                </h6>
              </div>
              <div class="fr-col-12  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-pt-0">
                {{ datePremiereImmatriculationFR }}
              </div>
              <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pb-4w  fr-pt-0  fr-blue-text">
                <!-- @todo:
                  Il serait plus sûr de créer un enum HISTORIQUE_OPERATION_TYPE pour l'utiliser ici
                  et dans le fichier assets/js/operations.json afin de tokenizer les opérations et réduire les erreurs liées à une typo
                  Pas urgent : en pratique, on ne se sert que très peu de ces HISTORIQUE_OPERATION_TYPE (appelé opa_type dans le SIV)
                -->
                {{ assets.operationsMapping['IMMAT_NORMALE_PREM_ETRANGER'] }}
              </div>
            </template>

            <div class="fr-col-12  fr-pb-3w">
              <h5 class="fr-mb-0">
                Historique des opérations en France
              </h5>
            </div>
            <div class="fr-col-2  fr-pb-2w  fr-pt-0">
              <h6 class="fr-mb-0">
                Date
              </h6>
            </div>
            <div class="fr-col-10  fr-pb-2w  fr-pt-0">
              <h6 class="fr-mb-0">
                Opération
              </h6>
            </div>

            <template
              v-for="(entry, index) in processedVehiculeData.historique"
              :key="index"
            >
              <div class="fr-col-12  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-pt-0">
                <span class="txt-small-12">{{ entry.date }}</span>
              </div>
              <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pb-2w  fr-pt-0  fr-blue-text">
                <span class="info_red txt-small-12">
                  {{ entry.nature }}
                  <!-- @todo @numAgree3
                  <span
                    v-if="entry.numAgree"
                  >
                    n° d'agrément <b>{{ entry.numAgree }}</b> -

                    @todo @numAgree4: brancher une modale sur ce lien
                    <a class="fr-link">
                      En savoir plus
                    </a>
                  </span> -->
                </span>
              </div>
            </template>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="report-tab-content-5"
          tab-id="report-tab-5"
          :selected="tabs.selectedTabIndex === 5"
          :asc="tabs.asc"
        >
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div
              v-if="erreurControlesTechniques"
              class="fr-col-12"
            >
              <DsfrAlert
                type="error"
                title="Erreur lors de la récupération des contrôles techniques"
                :description="erreurControlesTechniques"
              />
            </div>
            <template v-if="!erreurControlesTechniques">
              <template v-if="normalizedControlesTechniquesHistorique.length > 0">
                <div class="fr-col-2  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0">
                  <h6 class="fr-mb-0">
                    Date
                  </h6>
                </div>
                <div class="fr-col-3  fr-col-md-6  fr-col-lg-5  fr-col-xl-5  fr-pb-0">
                  <h6 class="fr-mb-0">
                    Nature
                  </h6>
                </div>
                <div class="fr-col-3  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0">
                  <h6 class="fr-mb-0">
                    Résultat
                  </h6>
                </div>
                <div class="fr-col-2  fr-col-md-2  fr-col-lg-3  fr-col-xl-3  fr-pb-3w">
                  <h6 class="fr-mb-0">
                    Kilométrage
                  </h6>
                </div>
                <template
                  v-for="(entry, index) in normalizedControlesTechniquesHistorique"
                  :key="index"
                >
                  <div class="fr-col-12  fr-col-sm-2  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-blue-text">
                    {{ entry.date }}
                  </div>
                  <div class="fr-col-12  fr-col-sm-6  fr-col-md-6  fr-col-lg-5  fr-col-xl-5  fr-pb-0  fr-blue-text">
                    {{ entry.natureLibelle }}
                  </div>
                  <div class="fr-col-4  fr-col-sm-2  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-blue-text">
                    <DsfrBadge
                      :label="entry.resultatLibelle"
                      :type="getDsfrBadgeType(entry.resultat)"
                      :no-icon="true"
                    />
                  </div>
                  <div class="fr-col-8  fr-col-sm-2  fr-col-md-2  fr-col-lg-3  fr-col-xl-3  fr-pb-2w  fr-blue-text">
                    {{ entry.kmLibelle }} km
                  </div>
                </template>
              </template>
              <div
                v-if="normalizedControlesTechniquesHistorique === 0"
                class="fr-col-12"
              >
                Ce véhicule ne possède actuellement aucun contrôle technique.
              </div>
            </template>
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
            <div
              v-if="erreurControlesTechniques"
              class="fr-col-12"
            >
              <DsfrAlert
                type="error"
                title="Erreur lors de la récupération des contrôles techniques"
                :description="erreurControlesTechniques"
              />
            </div>
            <template
              v-if="!erreurControlesTechniques"
            >
              <controles-techniques-line-chart
                v-if="controlesTechniquesHistorique.length > 0"
                class="fr-col-12"
                :controles-techniques="controlesTechniquesHistorique"
              />
              <div
                v-if="controlesTechniquesHistorique === 0"
                class="fr-col-12"
              >
                Ce véhicule ne possède actuellement aucun contrôle technique.
              </div>
            </template>
          </div>
        </DsfrTabContent>
      </DsfrTabs>
    </div>
  </div>

  <div
    v-if="isRapportVendeur"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w"
  >
    <div class="fr-col-12  fr-col-md-4  fr-col-lg-3  fr-col-xl-3  text-center">
      <DsfrButton
        label="Imprimer le CSA"
        icon="ri-printer-line"
        @click="generatePdf"
      />
    </div>
    <div
      v-if="!isCIAnnule"
      class="fr-col-12  fr-col-md-4  fr-col-lg-3  fr-col-xl-3  text-center"
    >
      <DsfrButton
        ref="modalPartagerRapport"
        label="Envoyer le rapport"
        icon="ri-send-plane-fill"
        secondary
        @click="onOpenModalPartagerRapport()"
      />

      <DsfrModal
        ref="modal"
        :opened="modalPartagerRapport.opened"
        :actions="modaleActions"
        title="Envoyer le rapport"
        :origin="$refs.modalPartagerRapport"
        @close="onCloseModalPartagerRapport()"
      >
        <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
          <div class="fr-col-12">
            <p>
              Vous pouvez transmettre le lien du rapport à votre acheteur potentiel.
              Ce lien est valide jusqu'au 8 du mois suivant.
              Ex: un lien transmis le 18/01/2022 sera accessible jusqu'au 08/02/2022.
            </p>
          </div>

          <div class="fr-col-12  text-center">
            <qrcode-vue
              :value="url"
              :size="150"
              level="L"
            />
          </div>
        </div>
      </DsfrModal>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div class="fr-col-12  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  text-center">
      <a
        id="simplimmatImage"
        class="fr-link"
        href="https://urldefense.com/v3/__https://www.securite-routiere.gouv.fr/reglementation-liee-aux-modes-de-deplacements/immatriculation-des-vehicules/lapplication-simplimmat__;!!AaIhyw!402trV61GnNGBOc6PZbaQq5BpJ9ZCyPe0Cpqc92evWW2ur8CuVl7aVhUfwsvF5Q$"
        rel="noopener noreferrer"
        target="_blank"
        @click="logSimplimmatImage"
      >
        <img
          class="fr-responsive-img"
          style="hieght: 5rem;"
          :src="images.logoSimplimmat"
          alt="Lien vers l'application Simplimmat"
          title="Logo de l'application Simplimmat"
        >
      </a>
    </div>
    <div class="fr-col-12  fr-col-md-8  fr-col-lg-8  fr-col-xl-8  text-center">
      <div class="fr-ml-4w">
        Utilisez maintenant l’application officielle
        <a
          class="fr-link"
          href="https://urldefense.com/v3/__https://www.securite-routiere.gouv.fr/reglementation-liee-aux-modes-de-deplacements/immatriculation-des-vehicules/lapplication-simplimmat__;!!AaIhyw!402trV61GnNGBOc6PZbaQq5BpJ9ZCyPe0Cpqc92evWW2ur8CuVl7aVhUfwsvF5Q$"
          rel="noopener noreferrer"
          target="_blank"
          @click="logSimplimmatLink"
        >
          Simplimmat
        </a>.
        <br/>
        Elle <b>simplifiera</b> et <b>sécurisera</b> vos formalités administratives pour la <b>cession</b> ou <b>l'immatriculation</b>
        de votre véhicule.
      </div>

      <!-- @todo @numAgree: Si la DSR souhaite de nouveau afficher le numéro d'expert (numAgree), il faut :
       0 - Demander à l'ingé data de faire de nouveau remonter le champs num_agree dans les opération d'historique : DEC_VE, PREM_RAP_VE, SEC_RAP_VE
       1 - Autoriser le champs numAgree à remonter dans le backend (cf: rechercher @numAgree1)
       2 - Autoriser le champs numAgree à remonter dans le frontend (cf: rechercher @numAgree2)
       3 - L'afficher dans l'historique lorsqu'il est disponible (cf: rechercher @numAgree3)
       4 - Ajouter un lien vers une modale explicative (cf: rechercher @numAgree4)
       5 - Implémenter la modale (cf: rechercher @numAgree5)

      @todo @numAgree5: adapter à l'interface de DsfrModal
        <DsfrModal
          title="Plus d'infos à propos du numéro d'expert agréé"
        >
          <p>
            HistoVec ne délivre pas les détails des rapports d’experts en automobile.
          </p>
          <p>
            Pour davantage de précisions sur un rapport, vous pouvez rechercher les coordonnées d’un expert en automobile sur la
            <a
              href="https://www.securite-routiere.gouv.fr/sites/default/files/2019-10/liste_nationale_des_experts_en_automobile.pdf"
              rel="noopener noreferrer"
              target="_blank"
            >
              liste nationale
              <b><i class="fa fa-file-pdf-o"></i></b>
            </a>
            mise à jour par le ministère chargé des transports.
          </p>
        </DsfrModal>
      -->
    </div>
  </div>
</template>

<style scoped>
/* @todo centralize these rules in common CSS file as a .histovec-fr-blue-title class */
[href] {
  background-image: none;
}

#simplimmatImage[target=_blank]:after {
  content: '';
}

#monAvisImage[target=_blank]:after {
  content: '';
}

.fr-blue-text {
  color: var(--blue-france-sun-113-625);
}

.text-center {
  text-align: center;
}
</style>
