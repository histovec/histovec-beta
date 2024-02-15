<script>
import { defineComponent } from 'vue'
import dayjs from 'dayjs'
import QrcodeVue from 'qrcode.vue'

import orderBy from 'lodash.orderby'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'
import ControlesTechniquesLineChart from '@/components/ControlesTechniquesLineChart.vue'
import TuileDsfrNonCliquable from '@/components/TuileDsfrNonCliquable.vue'
import LoaderComponent from '@/components/LoaderComponent.vue';
import ImagePresentation from '@/components/ImagePresentation.vue';
import HistoVecModale from '@/components/HistoVecModale.vue';
import AlerteComponent from '@/components/AlerteComponent.vue';

import { hash } from '@/utils/crypto.js'
import { generateCsa } from '@/utils/csaAsPdf/index.js'
import { RAPPORT_FILENAME } from '@/constants/csaAsPdf.js'
import { normalizeIdvAsDataPreparation, normalizeKeyAsDataPreparation } from '@/utils/dataPreparationFormat.js'
import { base64Encode, urlSafeBase64Encode, base64Decode, urlSafeBase64Decode } from '@/utils/encoding.js'
import { downloadBlob } from '@/utils/file.js'
import { getExposant } from '@/utils/format.js'
import { mailTo } from '@/utils/email.js'
import { getShareReportEmail } from '@/utils/dynamicEmail.js'

import api from '@/api/index.js'

import reportService from '@/services/report.js'

import { formatIsoToFrDate } from '@/assets/js/format.js'
import siv from '@/assets/js/siv.js'
import operationsMapping from '@/assets/json/operations.json'
import syntheseMapping from '@/assets/json/synthese.json'

import { RESULTAT } from '@/constants/controlesTechniques.js'
import { REPORT_TABS } from '@/constants/reportTabs.js'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE, TYPE_RAPPORT } from '@/constants/type.js'
import { DEFAULT_DATE_UPDATE } from '@/constants/v.js'
import { DEFAULT_NUMERO_SIREN } from '@/constants/vehicle/numeroSiren.js'
import { USAGE_AGRICOLE, USAGE_COLLECTION } from '@/constants/usagesSynthese.js'

import rapportAcheteurSvg from '@/assets/img/acheteur.svg?url'
import rapportVendeurSvg from '@/assets/img/rapport.svg?url'
import logoSimplimmat from '@/assets/img/simplimmat.png'

import '@/assets/stylesheets/globale.css'

// CSA
import logoHistoVec from '@/assets/img/deprecated/logo_histovec_avec_titre.png'
import logoMI from '@/assets/img/deprecated/logo_ministere_interieur.png'


export default defineComponent({
  name: 'RapportVendeurPage',

  components: {
    LoaderComponent,
    TuileDsfrNonCliquable,
    HistoVecModale,
    AlerteComponent,
    ControlesTechniquesLineChart,
    HistoVecButtonLink, QrcodeVue,
    ImagePresentation,
  },

  props: {
    typeRapport: {
      type: String,
      default: null,
    },
  },

  data () {
    return  {
      // Initialized beforeMount
      holderId: null,
      holderKey: null,
      processedVehiculeData: {
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
        rapportAcheteurSvg,
        rapportVendeurSvg,

        csa: {
          logoHistoVecBytes: '',
          logoMIBytes: '',
        },
      },

      constants: {
        REPORT_TABS,
        USAGE_AGRICOLE,
        USAGE_COLLECTION,
      },

      assets: {
        syntheseMapping,
        operationsMapping,
      },

      utils: {
        api,
        getExposant,
      },

      // @todo: @featureFlags
      // Feature flags à centraliser au niveau de la création de l'application Vue et à configurer via des variables d'environnement
      // Actuellement la construction des builds de PROD ne permet pas d'injecter de variable d'environnement, pour que cela fonctionne en PROD, il faudrait revoir le mode de build du front.
      // Pour pouvoir changer les feature flags en PROD, il est actuellement nécessaire de faire un commit en modifiant les flags ci-dessous, et donc un nouveau build.
      // En local, il suffit de modifier les flags ci-dessous et sauvergarder: le hot module reload (HMR) de Vite actualisera le code en temps réel dans la navigateur web.

      // @shortCutConfig1: brancher ces features flags sur un raccourci clavier si besoin
      flags: {
        // Gestion de la fraîcheur des données
        outdatedData: true,  // @flag @outdatedData : A activer quand la DSR juge que la donnée n'est pas assez fraîche
        showDataDate: true,  // @feature @showDataDate : Permet d'afficher la vraie date des données dans le CSA et le rapport HTML HistoVec - Devrait toujours rester à true
        codePartage: false,  // @todo @feature @codePartage1: A activer quand on aura ouvert l'API grand public et qu'on communiquera dessus et que le bug clipboard sera résolu

        // Flag du 8
        usePreviousMonthForData: false, // @flag @usePreviousMonthForData
        previousMonthShift: 1, // @flag @previousMonthShift

        // @flag @ignoreUtacCache
        // Outil de debug (doublé par côté backend pour empêcher son usage en PROD)
        ignoreUtacCache: false,
        csaActivated: false, // activer / desactiver le téléchargement du csa
      },
      sessionStorage,
      isNotificationOpened: false,
      texteNotification: '',
      typeNotification: 'success',
      isLoading: false,
    }
  },

  computed: {
    getVehiculeDescription () {
      return (
        this.isCIAnnule ?
          `Le certificat demandé a été annulé : ${ this.processedVehiculeData.plaque }` :
          `Numéro d'immatriculation : ${ this.processedVehiculeData.plaque }`
      )
    },
    getMiDescription () {
      return (
        this.flags.showDataDate ? (
            this.isDefaultDataDate ?
            'Non à jour' :
            `Datant du ${this.dateMiseAJourFR}`
          ) :
        'Connues d\'HistoVec à ce jour'
      )
    },

    breadcrumbLinks () {
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

    isRapportAcheteur () {
      return (
        this.typeRapport === TYPE_RAPPORT.ACHETEUR ||
        (this.typeRapport !== TYPE_RAPPORT.VENDEUR && this.isBuyer)
      )
    },

    isRapportVendeur () {
      return (
        this.typeRapport === TYPE_RAPPORT.VENDEUR ||
        (this.typeRapport !== TYPE_RAPPORT.ACHETEUR && this.isHolder)
      )
    },

    currentTab () {
      return this.tabs.mapping[this.tabs.selectedTabIndex]
    },

    // ----- Partage du rapport acheteur par le vendeur -----

    currentMonthNumber () {
      let date = dayjs().add(-7, 'day')

      if (this.flags.usePreviousMonthForData) {
        date = date.add(-this.flags.previousMonthShift, 'month')
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

    buyerId () {
      const { id: buyerId, urlUnsafe } = this.$route.query

      /* ----- @todo @urlUnsafe3 : Supprimer ce bloc de code  ------- */
      if (!urlUnsafe && buyerId) {  // old buyer report link
        return base64Encode(urlSafeBase64Decode(buyerId))
      }
      /* -------------------------------------------------------- */

      return buyerId
    },
    buyerKey () {
      const { key: buyerKey, urlUnsafe } = this.$route.query

      /* ----- @todo @urlUnsafe4 : Supprimer ce bloc de code  ------- */
      if (!urlUnsafe && buyerKey) {  // old buyer report link
        return base64Encode(urlSafeBase64Decode(buyerKey))
      }
      /* -------------------------------------------------------- */

      return buyerKey
    },
    // -----------------------------------------------------------

    // ----- Accès rapide aux données du rapport -----

    caracteristiquesTechniques () {
      return this.processedVehiculeData.caracteristiquesTechniques
    },
    certificat () {
      return this.processedVehiculeData.certificat
    },
    controlesTechniquesHistorique () {
      return this.controlesTechniques.historique || []
    },
    controlesTechniquesHistoriqueAriaLabel () {
      let ariaLabel = 'Graphique représentant l\'évolution du kilométrage relevé lors des controles techniques en fonction des années. '
      if(this.normalizedControlesTechniquesHistorique && this.normalizedControlesTechniquesHistorique.length >0){
        for (const controleTechnique of this.normalizedControlesTechniquesHistorique) {
          ariaLabel = ariaLabel + controleTechnique.date + ': ' + controleTechnique.km + ' km ' + controleTechnique.resultatLibelle + '. '
        }
        return ariaLabel
      }
      return ariaLabel + 'Ce véhicule ne possède actuellement aucun contrôle technique.'

    },
    dateEmissionCIFR () {
      return formatIsoToFrDate(this.certificat.dateEmissionCI)
    },
    dateMiseAJourFR () {
      return formatIsoToFrDate(this.processedVehiculeData.dateMiseAJour)
    },
    datePremiereImmatriculationFR () {
      return formatIsoToFrDate(this.certificat.datePremiereImmatriculation)
    },
    datePremiereImmatriculationEnFranceFR () {
      return formatIsoToFrDate(this.certificat.datePremiereImmatriculationEnFrance)
    },
    erreurControlesTechniques () {
      return this.controlesTechniques.erreur
      // return 'Un problème est survenu lors de la récupération des contrôles techniques. Veuillez réessayer plus tard.'
    },
    hasProcedureVEEnCours () {
      return this.processedVehiculeData.administratif.hasProcedureVEEnCours
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
    isBuyer () {
      return Boolean(this.buyerId || this.buyerKey)
    },
    isHolder () {
      return Boolean(!this.buyerId && this.holderId)
    },
    isValidBuyer () {
      return Boolean(this.buyerId && this.buyerKey)
    },
    normalizedControlesTechniquesHistorique () {
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
    oppositionSection () {
      return this.processedVehiculeData.administratif.opposition
    },
    reportLabels () {
      return this.processedVehiculeData.administratif.reportLabels
    },
    synthese () {
      return this.processedVehiculeData.administratif.reportLabels.synthese
    },
    titulaire () {
      return this.processedVehiculeData.titulaire
    },

    // ------------------ email ---------------------

    shareReportEmail () {
      const SHARE_REPORT_EMAIL = getShareReportEmail({ reportUrl: this.url })
      return mailTo(SHARE_REPORT_EMAIL)
    },
    // ----------------------------------------------
  },

  beforeMount: async function () {
    this.isLoading = true
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

        if (buyerReportResponse === null || buyerReportResponse.status === 500) {
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
        api.log('/buyer/invalid')

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

        if (holderReportResponse === null || holderReportResponse.status === 500) {
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
        api.log('/holder/invalid')
        this.$router.push({
          name: 'proprietaire',
        })
        return
      }
    } else {
      // Cas: Accès à l'url du rapport vendeur sans avoir rempli le formulaire au moins une fois
      api.log('/holder/invalid')
      this.$router.push({
        name: 'proprietaire',
      })
      return
    }

    const { vehicule: vehiculeData, controlesTechniques } = report

    this.processedVehiculeData = siv.processVehiculeData(vehiculeData)
    this.controlesTechniques = controlesTechniques

    const { isDonneeDisponible: areControlesTechinquesDisponibles, historique } = this.controlesTechniques

    const defaultTabTitles = [
      { title: 'Synthèse', panelId: 'report-tab-content-0', tabId:'report-tab-0'},
      { title: 'Véhicule', panelId: 'report-tab-content-1', tabId:'report-tab-1'},
      { title: 'Titulaire et Titre', panelId: 'report-tab-content-2', tabId:'report-tab-2'},
      { title: 'Situation administrative', panelId: 'report-tab-content-3', tabId:'report-tab-3'},
      { title: 'Historique', panelId: 'report-tab-content-4', tabId:'report-tab-4'},
    ]

    this.tabTitles = (
      (areControlesTechinquesDisponibles && historique.length > 0) ?
        defaultTabTitles.concat([
          { title: 'Contrôles techniques', panelId: 'report-tab-content-5', tabId:'report-tab-5'},
          { title: 'Kilométrage', panelId: 'report-tab-content-6', tabId:'report-tab-6'},
        ]) :
        defaultTabTitles
    )

    // @todo: Implémenter un mécanisme de notification dans la DsfrModal
    // pour confirmer visuellement la prise en compte des actions
    this.modaleActions = [
      {
        label: 'Copier le lien',
        icon: 'ri-clipboard-line',
        onClick: this.onClickCopyLienPartage,
      },
      {
        label: 'Envoyer le lien par mail',
        icon: 'ri-send-plane-fill',
        secondary: true,
        onClick: this.onClickMailLienPartage,
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

    this.isLoading = false;

    if (this.isRapportAcheteur) {
      api.log('/buyer/ok')
    }
    if (this.isRapportVendeur) {
      api.log('/holder/ok')
    }
  },

  methods: {

    // ModalPartagerRapport
    onCloseModalPartagerRapport () {
      this.modalPartagerRapport.opened = false
    },
    async onOpenModalPartagerRapport () {
      await this.logPartageDuRapport()
      this.modalPartagerRapport.opened = true
    },

    // Tabs
    async onTabSelected () {
      switch (this.currentTab) {
        case (this.constants.REPORT_TABS.SYNTHESE):
          await api.log('/synthesis')
          break;
        case (this.constants.REPORT_TABS.VEHICULE):
          await api.log('/vehicle')
          break;
        case (this.constants.REPORT_TABS.TITULAIRE_ET_TITRE):
          await api.log('/holder')
          break
        case (this.constants.REPORT_TABS.SITUATION_ADMINISTRATIVE):
          await api.log('/administrative-status')
          break
        case (this.constants.REPORT_TABS.HISTORIQUE):
          await api.log('/history')
          break
        case (this.constants.REPORT_TABS.CONTROLES_TECHNIQUES):
          await api.log('/technical-control')
          break
        case (this.constants.REPORT_TABS.KILOMETRAGE):
          await api.log('/kilometers')
          break
        default:
          break
      }
    },
    async selectTab (idx) {
      this.tabs.asc = this.tabs.selectedTabIndex < idx
      this.tabs.selectedTabIndex = idx

      await this.onTabSelected(idx)
    },

    async computeHolderId () {
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

    async computeHolderKey () {
      if (!this.formData) {
        return null
      }

      const normalizedKey = normalizeKeyAsDataPreparation(this.vehicleId)
      const hashedKeyBuffer = await hash(normalizedKey)
      return base64Encode(hashedKeyBuffer)
    },

    async getBuyerReport () {
      const data = {
        id: this.buyerId,
        key: this.buyerKey,
      }

      return await reportService.getBuyerReport(data, { ignoreUtacCache: this.flags.ignoreUtacCache })
    },

    async getHolderReport () {
      const data = {
        id: this.holderId,
        formData: this.formData,
      }

      return await reportService.getHolderReport(data, { ignoreUtacCache: this.flags.ignoreUtacCache })
    },
    async generatePdf () {
      await api.log('/csa/download')

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

      const numeroImmatriculation = this.formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV ? this.formData.siv.numeroImmatriculation : this.formData.fni.numeroImmatriculation

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
        new Blob([csaPdfBytes], { type: 'application/pdf' }),
        `${RAPPORT_FILENAME}.pdf`,
      )
    },

    /** DsfrBadge **/
    getDsfrBadgeType (resultatControleTechnique) {
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
    async logSimplimmatImage () {
      await api.log('/simplimmat/image')
    },
    async logSimplimmatLink () {
      await api.log('/simplimmat/link')
    },
    async logPartageDuRapport () {
      await api.log('/share')
    },
    async logCopieLienPartage () {
      await api.log('/share/copy')
    },
    async logCopieCodePartage () {
      await api.log('/share/code-partage')
    },
    async logMailLienPartage () {
      await api.log('/share/mail')
    },
    async logMonAvisImage () {
      await api.log('/mon-avis/image')
    },

    async onClickCopyLienPartage () {
      this.copierTexteAvecAlerte(this.url, 'lien')
      await this.logCopieLienPartage()
      this.onCloseModalPartagerRapport()
    },

    async onClickCopyCodePartage () {
      this.copierTexteAvecAlerte(this.codePartageHistoVec, 'code')
      await this.logCopieCodePartage()
      this.onCloseModalPartagerRapport()
    },

    async onClickMailLienPartage () {
      window.location = this.shareReportEmail

      await this.logMailLienPartage()
      this.onCloseModalPartagerRapport()
    },
    copierTexteAvecAlerte (texteACopier, typeText) {
      try {
        navigator.clipboard.writeText(texteACopier)
        this.ouvrirAlerte('Le ' + typeText + ' de partage du rapport est copié dans le presse papier.', 'success')
      } catch (e) {
        this.ouvrirAlerte('Une erreur est survenue lors de la copie du ' + typeText + ' de partage.', 'error')
      }
    },
    ouvrirAlerte(texteNotification, typeNotification) {
      this.texteNotification = texteNotification
      this.typeNotification = typeNotification
      this.isNotificationOpened = true
    },
    fermerAlerte() {
      this.isNotificationOpened = false
      this.texteNotification = ''
    },
  },
})
</script>

<template>
  <HistoVecModale
    titre="Envoyer le rapport"
    :opened="modalPartagerRapport.opened"
    :actions="modaleActions"
    @close="onCloseModalPartagerRapport()"
  >
    <p>
      Vous pouvez transmettre le lien du rapport à votre acheteur potentiel.
      Ce lien est valide jusqu'au 8 du mois suivant.
      Ex: un lien transmis le 18/01/2022 sera accessible jusqu'au 08/02/2022.
    </p>
    <div class="text-center">
      <qrcode-vue
        :value="url"
        :size="150"
        level="L"
      />
    </div>
  </HistoVecModale>
  <AlerteComponent
    v-if="isNotificationOpened"
    :description="texteNotification"
    :type="typeNotification"
    small
    @close="fermerAlerte"
  />
  <div class="fr-grid-row  fr-grid-row--gutters  fr-mb-4w">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="breadcrumbLinks"
      />
    </div>
    <div class="fr-col-lg-4 fr-col-xl-4">
      <ImagePresentation
        v-if="isRapportVendeur"
        :src="images.rapportVendeurSvg"
      />

      <ImagePresentation
        v-if="isRapportAcheteur"
        :src="images.rapportAcheteurSvg"
      />
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
            title="Lien vers jedonnemonavis.numerique.gouv.fr pour donner son avis sur la démarche HistoVec"
            target="_blank"
            @click="logMonAvisImage"
          >
            <img
              class="fr-responsive-img image-avis"
              src="https://voxusagers.numerique.gouv.fr/static/bouton-blanc.svg"
              alt=""
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
            title="Lien vers jedonnemonavis.numerique.gouv.fr pour donner son avis sur la démarche HistoVec"
            target="_blank"
            @click="logMonAvisImage"
          >
            <img
              class="fr-responsive-img image-avis"
              src="https://voxusagers.numerique.gouv.fr/static/bouton-blanc.svg"
              alt=""
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
        role="alert"
        title="Fraîcheur des données"
        description="
          HistoVec rencontre actuellement des difficultés techniques dans la mise à jour des données relatives aux véhicules qu'il vous permet de consulter.
          Seul le certificat de situation administrative disponible sur le site de l'A&#8203;N&#8203;T&#8203;S fait foi.
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
      <TuileDsfrNonCliquable
        :is-loading="isLoading"
        titre="Le véhicule"
      >
        {{ getVehiculeDescription }}
      </TuileDsfrNonCliquable>
    </div>
    <div class="fr-col-12  fr-col-lg-5  fr-col-xl-5">
      <TuileDsfrNonCliquable
        :is-loading="isLoading"
        titre="Informations du Ministère de l'Intérieur"
      >
        {{ getMiDescription }}
      </TuileDsfrNonCliquable>
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
        <LoaderComponent
          v-if="isLoading"
          taille="md"
        />
        <DsfrTabContent
          class="background-default-white"
          panel-id="report-tab-content-0"
          tab-id="report-tab-0"
          :selected="tabs.selectedTabIndex === 0"
          :asc="tabs.asc"
        >
          <div class="fr-highlight">
            <p>Les informations relatives au vol ne sont actuellement pas disponibles.</p>
          </div>
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-pb-3w">
              <h3 class="fr-mb-0 fr-h5">
                Résumé
              </h3>
            </div>

            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <div class="fr-pb-3w  fr-pt-0">
                <h4 class="fr-mb-0  fr-pb-2w fr-h6">
                  Modèle
                </h4>

                <p class="fr-text--md  fr-text--bleu  fr-mb-1v">
                  {{ caracteristiquesTechniques.marque }} {{ caracteristiquesTechniques.modele }}
                </p>

                <p
                  v-if="caracteristiquesTechniques.puissance.cv"
                  class="fr-text--md  fr-mb-1v"
                >
                  Puissance fiscale : <span class="fr-text--bleu">{{ caracteristiquesTechniques.puissance.cv }} ch</span>
                </p>

                <p
                  v-if="isRapportAcheteur"
                  class="fr-text--md  fr-mb-1v"
                >
                  Calculez le montant de votre certificat d'immatriculation
                  <br />
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
                <h4 class="fr-mb-0  fr-pb-2w fr-h6">
                  Usage
                </h4>
                <div
                  v-if="processedVehiculeData.usage.vehiculeDeCollection "
                >
                  <p class="fr-text--md  fr-mb-2w">
                    <span class="fr-text--bleu">
                      <VIcon
                        :name="constants.USAGE_COLLECTION.icon"
                      />
                    </span>
                    {{ constants.USAGE_COLLECTION.text }}
                    <br />
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
                </div>
                <div
                  v-if="processedVehiculeData.usage.vehiculeAgricole"
                >
                  <p class="fr-text--md  fr-mb-0">
                    <span class="fr-text--bleu">
                      <VIcon
                        :name="constants.USAGE_AGRICOLE.icon"
                      />
                    </span>
                    {{ constants.USAGE_AGRICOLE.text }}
                    <br />
                    <span
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
                    </span>
                  </p>
                </div>
              </div>

              <div class="fr-pb-0  fr-pt-0">
                <h4 class="fr-mb-0  fr-pb-0 fr-h6">
                  Propriétaire actuel
                </h4>

                <p class="fr-text--md  fr-mb-0">
                  <span class="fr-text--bleu">{{ processedVehiculeData.titulaire.identite }}</span>
                  depuis
                  <span
                    v-if="certificat.nombreDeMoisDepuisDateEmissionCertificatImmatriculation"
                    class="fr-text--bleu"
                  >
                    {{ certificat.nombreDeMoisDepuisDateEmissionCertificatImmatriculation }}
                  </span>
                  <span
                    v-if="!certificat.nombreDeMoisDepuisDateEmissionCertificatImmatriculation"
                    class="fr-text--bleu"
                  >
                    une durée inconnue
                  </span>
                  <br />
                  <template v-if="!certificat.isVehiculeImporteDepuisEtranger">
                    <template v-if="isRapportVendeur">
                      Vous êtes le
                      <span class="fr-text--bleu">{{ processedVehiculeData.titulairesCount }}</span>
                      <sup class="fr-text--bleu">{{ utils.getExposant(processedVehiculeData.titulairesCount) }}</sup>
                      titulaire de ce véhicule
                    </template>
                    <template v-if="isRapportAcheteur">
                      Ce véhicule a déjà eu
                      <span class="fr-text--bleu">{{ processedVehiculeData.titulairesCount }}</span>
                      titulaire(s), en l'achetant vous serez le
                      <span class="fr-text--bleu">{{ Number(processedVehiculeData.titulairesCount) + 1 }}</span>
                      <sup class="fr-text--bleu">{{ utils.getExposant(Number(processedVehiculeData.titulairesCount) + 1) }}</sup>
                    </template>
                  </template>
                  <br />
                  <template v-if="certificat.isVehiculeImporteDepuisEtranger">
                    Le nombre exact de titulaires ne peut être calculé avec précision
                    <br />
                    (première immatriculation à l'étranger)
                  </template>
                </p>
              </div>
            </div>

            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <div class="fr-pb-3w  fr-pt-0">
                <h4 class="fr-mb-0  fr-pb-2w fr-h6">
                  Immatriculation
                </h4>

                <p class="fr-text--md  fr-mb-1v">
                  <template v-if="datePremiereImmatriculationFR">
                    Première immatriculation le
                    <span class="fr-text--bleu">{{ datePremiereImmatriculationFR }}</span>
                  </template>

                  <template v-if="!datePremiereImmatriculationFR">
                    Date de première immatriculation <span class="fr-text--bleu">inconnue</span>
                  </template>
                </p>

                <template v-if="certificat.isVehiculeImporteDepuisEtranger">
                  <p class="fr-text--md  fr-text--bleu  fr-mb-1v">
                    <span class="fr-text--bleu">
                      <VIcon
                        name="ri-earth-line"
                      />
                    </span>
                    Ce véhicule a été <span class="fr-text--bleu">importé</span>
                    <span
                      v-if="isRapportAcheteur"
                      class="fr-text--bleu"
                    >
                      Vérifier les options incluses qui peuvent être différentes
                    </span>
                  </p>
                </template>
              </div>

              <div class="fr-pb-3w  fr-pt-0">
                <h4 class="fr-mb-0  fr-pb-2w fr-h6">
                  Situation administrative
                </h4>

                <p
                  v-if="processedVehiculeData.hasSinistre || hasProcedureVEEnCours"
                  class="fr-text--md  fr-mb-1v"
                >
                  <span class="fr-text--bleu">
                    <VIcon
                      :name="processedVehiculeData.isApte ? 'ri-thumb-up-line' : 'ri-error-warning-fill'"
                    />
                  </span>
                  <!-- état - un seul sinistre !-->
                  <template v-if="processedVehiculeData.sinistresCount === 1 || (processedVehiculeData.sinistresCount === 0 && hasProcedureVEEnCours)">
                    Ce véhicule a eu <span class="fr-text--bleu">un sinistre déclaré</span>
                    <span
                      v-if="processedVehiculeData.sinistresCount === 1"
                      class="fr-text--bleu"
                    >
                      en {{ processedVehiculeData.lastSinistreYear }}
                    </span>
                    <br />
                    <template v-if="processedVehiculeData.isApte">
                      et
                      <span class="fr-text--bleu"> déclaré apte à circuler</span>
                      <span
                        v-if="processedVehiculeData.lastResolutionYear"
                        class="fr-text--bleu"
                      >
                        en {{ processedVehiculeData.lastResolutionYear }}
                      </span>
                    </template>
                  </template>
                  <!-- état - plusieurs sinistres !-->
                  <template v-if="processedVehiculeData.sinistresCount > 1">
                    Ce véhicule a eu
                    <span class="fr-text--bleu">plusieurs sinistres</span>
                    , dont le dernier déclaré en <span class="fr-text--bleu">{{ processedVehiculeData.lastSinistreYear }}</span>
                    <br />
                    <template v-if="processedVehiculeData.isApte">
                      Le véhicule a été
                      <span class="fr-text--bleu"> déclaré apte à circuler</span>
                      <span
                        v-if="!processedVehiculeData.isApte"
                        class="fr-text--bleu"
                      >
                        en {{ processedVehiculeData.lastResolutionYear }}
                      </span>
                    </template>
                  </template>
                  <!-- @todo @redirectTab: Voir avec la DSR s'il est utile de rediriger vers l'ongler "Historique" ? -->
                  <br />
                  <!-- Commentaire: un ou plusieurs sinistres -->
                  <span
                    v-if="processedVehiculeData.isApte"
                    class="fr-text--bleu"
                  >
                    {{ assets.syntheseMapping[(isRapportVendeur ? 'fin_ove_vendeur' : 'fin_ove_acheteur')].adv }}
                  </span>
                  <span
                    v-else
                    class="fr-text--bleu"
                  >
                    {{ assets.syntheseMapping['ove'].adv }}
                  </span>

                  <br />
                  <span
                    v-if="processedVehiculeData.hasSinistre && processedVehiculeData.sinistresCount > 1"
                    class="fr-text--bleu"
                  >
                    {{ assets.syntheseMapping['multi_ove'].adv }}
                  </span>
                </p>

                <p
                  v-if="synthese.length === 0 && !processedVehiculeData.lastSinistreYear"
                  class="fr-text--md  fr-mb-1v"
                >
                  <span class="fr-text--bleu">
                    <VIcon
                      name="ri-check-line"
                    />
                  </span>
                  <span class="fr-text--bleu">Rien à signaler </span>
                  <br />
                  (gages, opposition, vol,...)
                </p>

                <p
                  v-for="(entry, index) in synthese"
                  :key="index"
                >
                  <span class="fr-text--bleu">
                    <VIcon
                      :name="assets.syntheseMapping[entry].icon"
                    />
                  </span>
                  {{ assets.syntheseMapping[entry].text }}
                  <!-- @todo: Voir avec la DSR s'il est utile de rediriger vers l'ongler "Situation administrative" ? -->
                  <br />
                  {{ assets.syntheseMapping[entry].adv }}
                  <br />
                  <a
                    v-if="assets.syntheseMapping[entry].link"
                    class="fr-link"
                    title="Lien vers service-public.fr"
                    :href="assets.syntheseMapping[entry].link"
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
          class="background-default-white"
          panel-id="report-tab-content-1"
          tab-id="report-tab-1"
          :selected="tabs.selectedTabIndex === 1"
          :asc="tabs.asc"
        >
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-pb-2w">
              <h3 class="fr-mb-0 fr-h5">
                Caractéristiques techniques
              </h3>
            </div>

            <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6 fr-pt-0  fr-pb-1w">
              Marque
            </div>
            <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pt-0  fr-pb-1w">
              D.1
            </div>
            <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4 fr-pt-0  fr-pb-1w  fr-text--bleu">
              {{ caracteristiquesTechniques.marque }}
            </div>

            <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
              Type variante version
            </div>
            <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
              D.2
            </div>
            <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
              {{ caracteristiquesTechniques.tvv }}
            </div>

            <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
              Numéro CNIT
            </div>
            <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
              D.2.1
            </div>
            <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
              {{ caracteristiquesTechniques.cnit }}
            </div>

            <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
              Nom commercial
            </div>
            <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
              D.3
            </div>
            <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
              {{ caracteristiquesTechniques.modele }}
            </div>

            <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
              Couleur
            </div>
            <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
            </div>
            <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
              {{ caracteristiquesTechniques.couleur }}
            </div>

            <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
              Type de réception
            </div>
            <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
            </div>
            <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
              {{ caracteristiquesTechniques.reception.type }}
            </div>

            <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
              Numéro d'identification véhicule
            </div>
            <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
              E
            </div>
            <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
              {{ caracteristiquesTechniques.vin }}
            </div>

            <template v-if="caracteristiquesTechniques.PT.admissible">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                PT techniquement admissible (kg)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                F.1
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.PT.admissible }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.AC">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                PTAC (kg)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                F.2
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.PT.AC }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.RA">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                PTRA (kg)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                F.3
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.PT.RA }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.service">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                PT en service (kg)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                G
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.PT.service }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.PT.AV">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                PTAV (kg)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                G.1
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.PT.AV }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.categorie">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Catégorie (CE)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                J
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.categorie }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.genre">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Genre (National)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                J.1
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.genre }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.carrosserie.ce">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Carrosserie (CE)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                J.2
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.carrosserie.ce }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.carrosserie.national">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Carrosserie (National)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                J.3
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.carrosserie.national }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.reception.numero">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Numéro de réception
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                K
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.reception.numero }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.cylindres">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Cylindrée (cm3)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                P.1
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.puissance.cylindres }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.nette">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Puissance nette max (kW)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                P.2
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.puissance.nette }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.energie">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Energie
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                P.3
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.energie }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.cv">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Puissance CV
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                P.6
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.puissance.cv }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.puissance.norm">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Puissance / masse (kW/kg)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                Q
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.puissance.norm }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.places.assis">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Places assises
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                S.1
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.places.assis }}
              </div>
            </template>

            <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
              Places debout
            </div>
            <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
              S.2
            </div>
            <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
              <template v-if="caracteristiquesTechniques.places.debout">
                {{ caracteristiquesTechniques.places.debout }}
              </template>
            </div>

            <template v-if="caracteristiquesTechniques.db">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Niveau sonore (db(A))
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                U.1
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.db }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.moteur">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Vitesse moteur (min-1)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                U.2
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.moteur }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.co2">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                CO2 (g/km)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                V.7
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.co2 }}
              </div>
            </template>

            <template v-if="caracteristiquesTechniques.environnement">
              <div class="fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6  fr-pt-0  fr-pb-1w">
                Classe environnement (CE)
              </div>
              <div class="fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  fr-pt-0  fr-pb-1w">
                V.9
              </div>
              <div class="fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ caracteristiquesTechniques.environnement }}
              </div>
            </template>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          class="background-default-white"
          panel-id="report-tab-content-2"
          tab-id="report-tab-2"
          :selected="tabs.selectedTabIndex === 2"
          :asc="tabs.asc"
        >
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-pb-2w">
              <h3 class="fr-mb-0 fr-h5">
                Titulaire et Titre
              </h3>
            </div>

            <template v-if="titulaire.nature">
              <div class="fr-col-6  fr-pt-0  fr-pb-1w">
                Nature
              </div>
              <div class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ titulaire.nature }}
              </div>
            </template>

            <div id="titre-identite" class="fr-col-6  fr-pt-0  fr-pb-1w">
              Identité
            </div>
            <div id="valeur-identite" class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
              {{ titulaire.identite }}
            </div>

            <div id="titre-code-postal" class="fr-col-6  fr-pt-0  fr-pb-0">
              Code postal
            </div>
            <div id="valeur-code-postal" class="fr-col-6  fr-pt-0  fr-pb-0  fr-text--bleu">
              {{ titulaire.adresse }}
            </div>

            <div class="fr-col-12  fr-pt-3w  fr-pb-2w">
              <h3 class="fr-mb-0 fr-h5">
                Certificat d'immatriculation
              </h3>
            </div>

            <div id="titre-date-immatriculation" class="fr-col-6  fr-pt-0  fr-pb-1w">
              Date de première immatriculation
              <span v-if="certificat.isVehiculeImporteDepuisEtranger">
                à l'étranger
              </span>
            </div>
            <div id="valeur-date-immatriculation" class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
              {{ datePremiereImmatriculationFR }}
            </div>

            <template v-if="certificat.isVehiculeImporteDepuisEtranger">
              <div id="titre-date-immatriculation-france" class="fr-col-6  fr-pt-0  fr-pb-1w">
                Date de première immatriculation en France
              </div>
              <div id="valeur-date-immatriculation-france" class="fr-col-6  fr-pt-0  fr-pb-1w  fr-text--bleu">
                {{ datePremiereImmatriculationEnFranceFR }}
              </div>
            </template>

            <div id="titre-date-certificat" class="fr-col-6  fr-pt-0  fr-pb-0">
              Date du certificat d'immatriculation actuel
            </div>
            <div id="valeur-date-certificat" class="fr-col-6  fr-pt-0  fr-pb-0  fr-text--bleu">
              {{ dateEmissionCIFR }}
            </div>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          class="background-default-white"
          panel-id="report-tab-content-3"
          tab-id="report-tab-3"
          :selected="tabs.selectedTabIndex === 3"
          :asc="tabs.asc"
        >
          <div class="fr-highlight">
            <p>Les informations relatives au vol ne sont actuellement pas disponibles.</p>
          </div>
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-col-md-6  fr-col-lg-6  fr-col-xl-6">
              <div class="fr-grid-row  fr-grid-row--gutters">
                <div class="fr-col-12  fr-pb-2w">
                  <h3 class="fr-mb-0 fr-h5">
                    Gages
                    <span>
                      <a
                        class="fr-link"
                        title="En savoir plus sur les gages - Lien vers service-public.fr"
                        :href="assets.syntheseMapping['otci'].link"
                        rel="noopener noreferrer"
                        target="_blank"
                      > En savoir plus
                      </a>
                    </span>
                  </h3>
                </div>
                <div class="fr-col-12  fr-pb-0  fr-pt-0">
                  <ul class="fr-text--md fr-raw-list">
                    <li
                      v-for="(gageInfos, index) in reportLabels.gagesInfos"
                      :key="index"
                    >
                      <span v-if="gageInfos.date">{{ gageInfos.date }} - </span>
                      <span class="fr-text--bleu">{{ gageInfos.label }}</span>
                    </li>
                  </ul>
                </div>

                <div class="fr-col-12  fr-pb-2w  fr-pt-0">
                  <h3 class="fr-mb-0 fr-h5">
                    Oppositions
                    <span>
                      <a
                        class="fr-link"
                        title="En savoir plus sur les oppositions - Lien vers service-public.fr"
                        :href="assets.syntheseMapping['otci'].link"
                        rel="noopener noreferrer"
                        target="_blank"
                      > En savoir plus
                      </a>
                    </span>
                  </h3>
                </div>
                <div class="fr-col-12  fr-pb-0  fr-pt-0">
                  <ul class="fr-text--md fr-raw-list">
                    <li
                      v-for="(oppositionInfos, index) in reportLabels.oppositionsInfos"
                      :key="index"
                    >
                      <span v-if="oppositionInfos.date">{{ oppositionInfos.date }} - </span>
                      <span class="fr-text--bleu">{{ oppositionInfos.label }}</span>
                      <span
                        v-if="isRapportVendeur && oppositionInfos.label.includes('PV') && oppositionSection.hasOtciPV"
                      >
                        ( Appelez le 08 21 08 00 31 )
                      </span>
                    </li>
                  </ul>
                </div>

                <div class="fr-col-12  fr-pb-2w  fr-pt-0">
                  <h3 class="fr-mb-0 fr-h5">
                    Véhicule
                  </h3>
                </div>
                <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-3w  fr-pt-0">
                  Déclaré volé
                </div>
                <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-3w  fr-pt-0  fr-text--bleu">
                  {{ reportLabels.vol }}
                </div>
              </div>
            </div>

            <div class="fr-col-12  fr-col-md-6  fr-col-lg-6  fr-col-xl-6">
              <div class="fr-grid-row  fr-grid-row--gutters">
                <div class="fr-col-12  fr-pb-2w">
                  <h3 class="fr-mb-0 fr-h5">
                    Déclarations valant saisie
                  </h3>
                </div>
                <div class="fr-col-12  fr-pb-0  fr-pt-0">
                  <ul class="fr-text--md fr-raw-list">
                    <li
                      v-for="(dvs, index) in reportLabels.dvsInfos"
                      :key="index"
                    >
                      <span v-if="dvs.date">{{ dvs.date }} - </span>
                      <span class="fr-text--bleu">{{ dvs.label }}</span>
                    </li>
                  </ul>
                </div>

                <div class="fr-col-12  fr-pb-2w  fr-pt-0">
                  <h3 class="fr-mb-0 fr-h5">
                    Suspensions
                  </h3>
                </div>
                <div class="fr-col-12  fr-pb-0  fr-pt-0">
                  <div class="fr-text--md">
                    <div
                      v-for="(suspensionInfos, index) in reportLabels.suspensionsInfos"
                      :key="index"
                    >
                      <span v-if="suspensionInfos.date">{{ suspensionInfos.date }} - </span>
                      <span class="fr-text--bleu">{{ suspensionInfos.label }}</span>
                    </div>
                  </div>
                </div>

                <div class="fr-col-12  fr-pb-2w  fr-pt-0">
                  <h3 class="fr-mb-0 fr-h5">
                    Certificat d'immatriculation
                  </h3>
                </div>
                <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-0  fr-pt-0">
                  Déclaré volée
                </div>
                <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-0  fr-pt-0  fr-text--bleu">
                  {{ reportLabels.titre.vol }}
                </div>
                <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-0  fr-pt-0">
                  Déclaré perdue
                </div>
                <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-0  fr-pt-0  fr-text--bleu">
                  {{ reportLabels.titre.perte }}
                </div>
                <div class="fr-col-6  fr-col-lg-4  fr-col-xl-4  fr-pb-3w  fr-pt-0">
                  Duplicata
                </div>
                <div class="fr-col-6  fr-col-lg-8  fr-col-xl-8  fr-pb-3w  fr-pt-0  fr-text--bleu">
                  {{ reportLabels.titre.duplicata }}
                </div>
              </div>
            </div>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          class="background-default-white"
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
                <h3 class="fr-mb-0 fr-h5">
                  Historique des opérations à l'étranger
                </h3>
              </div>
              <div class="fr-col-2  fr-pb-2w  fr-pt-0">
                <h4 class="fr-mb-0 fr-h6">
                  Date
                </h4>
              </div>
              <div class="fr-col-10  fr-pb-2w  fr-pt-0">
                <h4 class="fr-mb-0 fr-h6">
                  Opération
                </h4>
              </div>
              <div class="fr-col-12  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-pt-0">
                {{ datePremiereImmatriculationFR }}
              </div>
              <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pb-4w  fr-pt-0  fr-text--bleu">
                <!-- @todo:
                  Il serait plus sûr de créer un enum HISTORIQUE_OPERATION_TYPE pour l'utiliser ici
                  et dans le fichier assets/js/operations.json afin de tokenizer les opérations et réduire les erreurs liées à une typo
                  Pas urgent : en pratique, on ne se sert que très peu de ces HISTORIQUE_OPERATION_TYPE (appelé opa_type dans le SIV)
                -->
                {{ assets.operationsMapping['IMMAT_NORMALE_PREM_ETRANGER'] }}
              </div>
            </template>

            <div class="fr-col-12  fr-pb-3w">
              <h3 class="fr-mb-0 fr-h5">
                Historique des opérations en France
              </h3>
            </div>
            <div class="fr-col-2  fr-pb-2w  fr-pt-0">
              <h4 class="fr-mb-0 fr-h6">
                Date
              </h4>
            </div>
            <div class="fr-col-10  fr-pb-2w  fr-pt-0">
              <h4 class="fr-mb-0 fr-h6">
                Opération
              </h4>
            </div>

            <template
              v-for="(entry, index) in processedVehiculeData.historique"
              :key="index"
            >
              <div class="fr-col-12  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-pt-0">
                <span class="txt-small-12">{{ entry.date }}</span>
              </div>
              <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10  fr-pb-2w  fr-pt-0  fr-text--bleu">
                <span class="info_red txt-small-12">
                  {{ entry.nature }}
                </span>
              </div>
            </template>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          class="background-default-white"
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
                role="alert"
                title="Erreur lors de la récupération des contrôles techniques"
                :description="erreurControlesTechniques"
              />
            </div>
            <template v-if="!erreurControlesTechniques">
              <template v-if="normalizedControlesTechniquesHistorique.length > 0">
                <div class="fr-col-6 fr-col-sm-2 fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0">
                  <h3 class="fr-mb-0 fr-h5">
                    Date
                  </h3>
                </div>
                <div class="fr-col-6 fr-col-sm-4 fr-col-md-4  fr-col-lg-4  fr-col-xl-4  fr-pb-0">
                  <h3 class="fr-mb-0 fr-h5">
                    Nature
                  </h3>
                </div>
                <div class="fr-col-6 fr-col-sm-3 fr-col-md-3  fr-col-lg-3  fr-col-xl-3  fr-pb-0">
                  <h3 class="fr-mb-0 fr-h5">
                    Résultat
                  </h3>
                </div>
                <div class="fr-col-6 fr-col-sm-3 fr-col-md-3  fr-col-lg-3  fr-col-xl-3  fr-pb-3w">
                  <h3 class="fr-mb-0 fr-h5">
                    Kilométrage
                  </h3>
                </div>
                <template
                  v-for="(entry, index) in normalizedControlesTechniquesHistorique"
                  :key="index"
                >
                  <div class="fr-col-6 fr-col-sm-2 fr-col-md-2  fr-col-lg-2  fr-col-xl-2  fr-pb-0  fr-text--bleu">
                    {{ entry.date }}
                  </div>
                  <div class="fr-col-6 fr-col-sm-4 fr-col-md-4  fr-col-lg-4  fr-col-xl-4  fr-pb-0  fr-text--bleu">
                    {{ entry.natureLibelle }}
                  </div>
                  <div class="fr-col-6 fr-col-sm-3 fr-col-md-3  fr-col-lg-3  fr-col-xl-3  fr-text--bleu">
                    <DsfrBadge
                      :label="entry.resultatLibelle"
                      :type="getDsfrBadgeType(entry.resultat)"
                      :no-icon="true"
                    />
                  </div>
                  <div class="fr-col-6 fr-col-sm-3 fr-col-md-3  fr-col-lg-3  fr-col-xl-3  fr-pb-2w  fr-text--bleu">
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
          class="background-default-white"
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
                role="alert"
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
                :aria-label="controlesTechniquesHistoriqueAriaLabel"
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
    <div v-if="flags.csaActivated" class="fr-col-12  fr-col-md-4  fr-col-lg-3  fr-col-xl-3  text-center">
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
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div class="fr-col-12  fr-col-md-2  fr-col-lg-2  fr-col-xl-2  text-center">
        <img
          class="fr-responsive-img"
          :src="images.logoSimplimmat"
          alt=""
        >
    </div>
    <div class="fr-col-12  fr-col-md-8  fr-col-lg-8  fr-col-xl-8  text-center">
      <div class="fr-ml-4w">
        Utilisez maintenant l’application officielle
        <a
          class="fr-link"
          title="Lien vers securite-routiere.gouv.fr"
          href="https://urldefense.com/v3/__https://www.securite-routiere.gouv.fr/reglementation-liee-aux-modes-de-deplacements/immatriculation-des-vehicules/lapplication-simplimmat__;!!AaIhyw!402trV61GnNGBOc6PZbaQq5BpJ9ZCyPe0Cpqc92evWW2ur8CuVl7aVhUfwsvF5Q$"
          rel="noopener noreferrer"
          target="_blank"
          @click="logSimplimmatLink"
        >
          Simplimmat
        </a>.
        <br />
        Elle <b>simplifiera</b> et <b>sécurisera</b> vos formalités administratives pour la <b>cession</b> ou <b>l'immatriculation</b> de votre véhicule.
      </div>
    </div>
  </div>
</template>

<style scoped>
  #monAvisImage[target=_blank]:after {
    content: '';
  }

  .text-center {
    text-align: center;
  }
  .image-avis {
    height: 5rem;
  }
  .fr-highlight {
    margin: 0;
  }
</style>
