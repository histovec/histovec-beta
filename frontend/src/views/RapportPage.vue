<script>
import { defineComponent } from 'vue'
import dayjs from 'dayjs'
import QrcodeVue from 'qrcode.vue'

import orderBy from 'lodash.orderby'
import { toClipboard } from '@soerenmartius/vue3-clipboard'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'
import ControlesTechniquesLineChart from '@/components/ControlesTechniquesLineChart.vue'


import { hash } from '@/utils/crypto.js'
import { generateCsa } from '@/utils/csaAsPdf/index.js'
import { RAPPORT_FILENAME } from '@/utils/csaAsPdf/constants.js'
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
import { VIGNETTE } from '@/constants/vehicle/critair.js'
import { DEFAULT_NUMERO_SIREN } from '@/constants/vehicle/numeroSiren.js'
import { USAGE_AGRICOLE, USAGE_COLLECTION } from '@/constants/usagesSynthese.js'

import RapportAcheteurSvg from '@/assets/img/acheteur.svg'
import RapportVendeurSvg from '@/assets/img/rapport.svg'
import logoSimplimmat from '@/assets/img/simplimmat.png'
import logoHistoVec from '@/assets/img/deprecated/logo_histovec_avec_titre.png'
import logoMI from '@/assets/img/deprecated/logo_ministere_interieur.png'


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

  components: {
    ControlesTechniquesLineChart,
    RapportAcheteurSvg, RapportVendeurSvg,
    HistoVecButtonLink, QrcodeVue,
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

      },
      // formData: null,

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
        toClipboard,
      },

      // @todo: FLAGs à centraliser au niveau de la création de l'application Vue et à configurer via des variables d'environnement
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
      sessionStorage,
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
      return this.typeRapport === TYPE_RAPPORT.ACHETEUR
    },

    isRapportVendeur () {
      return this.typeRapport === TYPE_RAPPORT.VENDEUR
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
    controlesTechniquesHistorique () {
      return this.controlesTechniques.historique || []
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
    vignetteCritair () {
      return this.processedVehiculeData.vignetteCritair
    },





    // ----------------------------------------------
  },

  beforeMount: async function () {
    console.log('-- beforeMount --')

    const formDataParams = this.$route.params.formData && JSON.parse(this.$route.params.formData)
    console.log('-- formDataParams --', formDataParams)

    if (formDataParams) {
      // 1er accès au rapport vendeur (suite au remplissage du formulaire de recherche)
      this.formData = formDataParams
    } else {
      // accès suivant via l'url /rapport-vendeur (rafraîchissement de la page du rapport)
      const cachedFormData = sessionStorage.getItem('formData') && JSON.parse(sessionStorage.getItem('formData'))
      console.log('-- cachedFormData --', cachedFormData)

      this.formData = cachedFormData
    }

    console.log('-- formData --', this.formData)

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

    if (this.isBuyer) {
      if (this.isValidBuyer) {
        const buyerReportResponse = await this.getBuyerReport()

        if (buyerReportResponse.status === 404) {
          // Cas: véhicule non trouvé

          this.$router.push({
            name: 'erreur',
            params: {
              errorMessages: [
                'Ce véhicule est inconnu d\'HistoVec.',
                'Vos noms et prénoms sont susceptibles d\'avoir fait l\'objet d\'erreurs lors de la saisie de votre dossier.',
                'Recopiez exactement les données de votre carte grise. La carte grise que vous utilisez n\'est peut-être pas la dernière en cours de validité (perte, vol, ...).',
              ],
              actions: [
                // @todo : pass this data to a HistoVecButtonLink in ErreurPage
                {
                  label: 'Revenir au formulaire de recherche',
                  to: '/proprietaire',
                },
              ],
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
          name: 'erreur',
          params: {
            errorMessages: [
              'Ce lien de partage HistoVec est invalide.',
              'Veuillez demander un lien au vendeur.',
            ],
            actions: [
              // @todo : pass this data to a HistoVecButtonLink in ErreurPage
              {
                label: 'Demander le rapport à un vendeur',
                to: '/acheteur',
              },
            ],
          },
        })
        return
      }
    } else if (this.isHolder) {
      if (this.formData) {
        const holderReportResponse = await this.getHolderReport()

        if (holderReportResponse.status === 404) {
          // Cas: véhicule non trouvé
          console.log('-- véhicule non trouvé --')

          this.$router.push({
            name: 'erreur',
            params: {
              errorMessages: [
                'Ce véhicule est inconnu d\'HistoVec.',
                'Vos noms et prénoms sont susceptibles d\'avoir fait l\'objet d\'erreurs lors de la saisie de votre dossier.',
                'Recopiez exactement les données de votre carte grise. La carte grise que vous utilisez n\'est peut-être pas la dernière en cours de validité (perte, vol, ...).',
              ],
              actions: [
                // @todo : pass this data to a HistoVecButtonLink in ErreurPage
                {
                  label: 'Revenir au formulaire de recherche',
                  to: '/proprietaire',
                },
              ],
            },
          })
          return
        }

        if (holderReportResponse.status !== 200) {
          // Cas: erreur lors de la récupération du rapport (hors contrôles techniques)
          console.log('-- erreur lors de la récupération du rapport (hors contrôles techniques) --')

          this.$router.push({
            name: 'serviceIndisponible',
          })
          return
        }

        report = holderReportResponse.report
      } else {
        // Cas: Accès à l'url du rapport vendeur sans avoir rempli le formulaire au moins une fois
        console.log('-- holder - Accès à l\'url du rapport vendeur sans avoir rempli le formulaire au moins une fois --')

        this.$router.push({
          name: 'proprietaire',
        })
        return
      }
    } else {
      // Cas: Accès à l'url du rapport vendeur sans avoir rempli le formulaire au moins une fois
      console.log('-- Accès à l\'url du rapport vendeur sans avoir rempli le formulaire au moins une fois --')

      this.$router.push({
        name: 'proprietaire',
      })
      return
    }
    console.log('-- Before - Process report --', report)

    const { vehicule: vehiculeData, controlesTechniques } = report

    this.processedVehiculeData = siv.processVehiculeData(vehiculeData)
    this.controlesTechniques = controlesTechniques

    const SHARE_REPORT_EMAIL = getShareReportEmail({reportUrl: this.url})
    this.shareReportEmail = mailTo(SHARE_REPORT_EMAIL)
  },

  methods: {
    // ModalPartagerRapport
    onCloseModalPartagerRapport () {
      this.modalPartagerRapport.opened = false
    },
    onOpenModalPartagerRapport () {
      this.modalPartagerRapport.opened = true
    },

    // Tabs
    async onTabSelected () {
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
    async selectTab (idx) {
      console.log('-- selectTab --')

      this.tabs.asc = this.tabs.selectedTabIndex < idx
      this.tabs.selectedTabIndex = idx

      await this.onTabSelected(idx)
    },

    async computeHolderId () {
      console.log('-- computeHolderId --')
      if (!this.formData) {
        return null
      }

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
      if (!this.formData) {
        return null
      }

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
    async generatePdf () {
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
        dateDonnees: this.showDataDate ? dateMiseAJour : null,
        histoVecLogoBytes: this.images.csa.logoHistoVecBytes,
        marianneImageBytes: this.images.csa.logoMIBytes,
        marque,
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
      // RESULTAT.X or undefined => undefined
    },

    /** logs **/
    async logSimplimmatImage () {
      await api.log(`${this.$route.path}/simplimmat/image`)
    },
    async logSimplimmatLink () {
      await api.log(`${this.$route.path}/simplimmat/link`)
    },
    async logCopieLienPartage () {
      await api.log(`${this.$route.path}/share/copy`)
    },
    async logMailLienPartage () {
      await api.log(`${this.$route.path}/share/mail`)
    },

    async onClickCopyLienPartage () {
      console.log('-- onClickCopyLienPartage --')
      this.utils.toClipboard(this.url)
      await this.logCopieLienPartage()
      this.onCloseModalPartagerRapport()
    },

    async onClickMailLienPartage () {
      console.log('-- onClickMailLienPartage --')
      this.utils.toClipboard(this.url)
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

    <div class="fr-col-lg-4 fr-col-xl-4">
      <DsfrPicture src="">
        <RapportVendeurSvg
          v-if="isRapportVendeur"
          title="Illustration de la page du rapport vendeur HistoVec"
        />
        <RapportAcheteurSvg
          v-if="isRapportAcheteur"
          title="Illustration de la page du rapport acheteur HistoVec"
        />
      </DsfrPicture>
    </div>

    <div
      v-if="isRapportVendeur"
      class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v"
    >
      <h1>Rapport de votre véhicule</h1>
      <h2>Consultez et partagez l'historique du véhicule</h2>
    </div>

    <div
      v-if="isRapportAcheteur"
      class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v"
    >
      <h1>Rapport du véhicule</h1>
      <h2>Consultez l'historique du véhicule</h2>
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
        :tab-titles="[
          { title: 'Synthèse'},
          { title: 'Véhicule'},
          { title: 'Titulaire & Titre'},
          { title: 'Situation administrative'},
          { title: 'Historique'},
          { title: 'Contrôles techniques'},
          { title: 'Kilométrage'}
        ]"
        @select-tab="selectTab"
      >
        <DsfrTabContent
          panel-id="report-tab-content-0"
          tab-id="report-tab-0"
          :selected="tabs.selectedTabIndex === 0"
          :asc="tabs.asc"
        >
          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-6">
              <h5>Résumé</h5>

              processedVehiculeData {{ processedVehiculeData }}

              <h6>{{ caracteristiquesTechniques.marque }} {{ caracteristiquesTechniques.modele }}</h6>
              <p
                v-if="caracteristiquesTechniques.puissance.cv"
                class="fr-text--md"
              >
                Puissance fiscale : {{ caracteristiquesTechniques.puissance.cv }}
              </p>

              <!-- <h6>Propriétaire actuel</h6>
              <p class="fr-text--md">
                {{ processedVehiculeData.titulaire.identite }} depuis {{ certificat.nombreDeMoisDepuisDateEmissionCertificatImmatriculation || 'une durée inconnue' }}
              </p>

              <p
                v-if="!certificat.isVehiculeImporteDepuisEtranger && isRapportVendeur"
                class="fr-text--md"
              >
                Vous êtes le {{ processedVehiculeData.titulairesCount }}{{ utils.getExposant(processedVehiculeData.titulairesCount) }} titulaire de ce véhicule
              </p>
              <p
                v-if="!certificat.isVehiculeImporteDepuisEtranger && isRapportAcheteur"
                class="fr-text--md"
              >
                En achetant ce véhicule, vous serez le {{ processedVehiculeData.titulairesCount + 1 }} titulaire
              </p>
              <p
                v-if="certificat.isVehiculeImporteDepuisEtranger"
                class="fr-text-md"
              >
                Le nombre exact de titulaires ne peut être calculé avec précision (première immatriculation à l'étranger)
              </p> -->
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
                PT technique admissible (kg)
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
            <div class="fr-col-6">
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
                      class="fr-blue-text"
                    >
                      <span v-if="gageInfos.date">{{ gageInfos.date }} - </span>{{ gageInfos.label }}
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
                      class="fr-blue-text"
                    >
                      <span v-if="oppositionInfos.date">{{ oppositionInfos.date }} - </span>{{ oppositionInfos.label }}
                      <span
                        v-if="isHolder && oppositionInfos.label.includes('PV') && oppositionSection.hasOtciPV"
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
                <div class="fr-col-4  fr-pb-0  fr-pt-0">
                  Déclaré volé
                </div>
                <div class="fr-col-8  fr-pb-0  fr-pt-0 fr-blue-text">
                  {{ reportLabels.vol }}
                </div>
              </div>
            </div>

            <div class="fr-col-6">
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
                      class="fr-blue-text"
                    >
                      <span v-if="dvs.date">{{ dvs.date }} - </span>{{ dvs.label }}
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
                      class="fr-blue-text"
                    >
                      <span v-if="suspensionInfos.date">{{ suspensionInfos.date }} - </span>{{ suspensionInfos.label }}
                    </span>
                  </p>
                </div>

                <div class="fr-col-12  fr-pb-2w  fr-pt-0">
                  <h6 class="fr-mb-0">
                    Certificat d'immatriculation
                  </h6>
                </div>
                <div class="fr-col-4  fr-pb-0  fr-pt-0">
                  Déclaré volée
                </div>
                <div class="fr-col-8  fr-pb-0  fr-pt-0 fr-blue-text">
                  {{ reportLabels.titre.vol }}
                </div>
                <div class="fr-col-4  fr-pb-0  fr-pt-0">
                  Déclaré perdue
                </div>
                <div class="fr-col-8  fr-pb-0  fr-pt-0 fr-blue-text">
                  {{ reportLabels.titre.perte }}
                </div>
                <div class="fr-col-4  fr-pb-0  fr-pt-0">
                  Duplicata
                </div>
                <div class="fr-col-8  fr-pb-0  fr-pt-0 fr-blue-text">
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
            <template v-if="datePremiereImmatriculationFR">
              <!-- v-if="certificat.isVehiculeImporteDepuisEtranger"> -->
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
              <div class="fr-col-2  fr-pb-4w  fr-pt-0 fr-blue-text">
                {{ datePremiereImmatriculationFR }}
              </div>
              <div class="fr-col-10  fr-pb-4w  fr-pt-0 fr-blue-text">
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
              <div class="fr-col-2  fr-pb-0  fr-pt-0 fr-blue-text">
                <span class="txt-small-12">{{ entry.date }}</span>
              </div>
              <div class="fr-col-10  fr-pb-0  fr-pt-0 fr-blue-text">
                <span class="info_red txt-small-12">
                  {{ entry.nature }}
                  <!-- @numAgree3
                  <span
                    v-if="entry.numAgree"
                  >
                    n° d'agrément <b>{{ entry.numAgree }}</b> -

                    @numAgree4: brancher une modale sur ce lien
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
              <template
                v-if="
                  normalizedControlesTechniquesHistorique.length
                    >
                    0"
              >
                <div class="fr-col-2  fr-pb-3w">
                  <h6 class="fr-mb-0">
                    Date
                  </h6>
                </div>
                <div class="fr-col-4  fr-pb-3w">
                  <h6 class="fr-mb-0">
                    Nature
                  </h6>
                </div>
                <div class="fr-col-2  fr-pb-3w">
                  <h6 class="fr-mb-0">
                    Résultat
                  </h6>
                </div>
                <div class="fr-col-4  fr-pb-3w">
                  <h6 class="fr-mb-0">
                    Kilométrage
                  </h6>
                </div>
                <template
                  v-for="(entry, index) in normalizedControlesTechniquesHistorique"
                  :key="index"
                >
                  <div class="fr-col-2  fr-pb-2w  fr-blue-text">
                    {{ entry.date }}
                  </div>
                  <div class="fr-col-4  fr-pb-2w  fr-blue-text">
                    {{ entry.natureLibelle }}
                  </div>
                  <div class="fr-col-2  fr-pb-2w  fr-blue-text">
                    <DsfrBadge
                      :label="entry.resultatLibelle"
                      :type="getDsfrBadgeType(entry.resultat)"
                      :no-icon="true"
                    />
                  </div>
                  <div class="fr-col-4  fr-pb-2w  fr-blue-text">
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
    <div
      class="fr-col-6"
      style="text-align: right"
    >
      <DsfrButton
        label="Imprimer le CSA"
        :href="shareReportEmail"
      />
    </div>
    <div
      v-if="!isCIAnnule"
      class="fr-col-6"
      style="text-align: left"
    >
      <DsfrButton
        ref="modalPartagerRapport"
        label="Envoyer le rapport"
        secondary
        @click="open()"
      />
      <DsfrModal
        ref="modal"
        :opened="modalPartagerRapport.opened"
        :actions="[
          {
            label: 'Copier le lien',
            onClick: onClickCopyLienPartage,
          },
          {
            label: 'Envoyer le lien par mail',
            href: shareReportEmail,
            onClick: onClickMailLienPartage,
          },
        ]"
        title="Envoyer le rapport"
        :origin="$refs.modalPartagerRapport"
        @open="onOpenModalPartagerRapport()"
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

          <div
            class="fr-col-12"
            style="float: none; margin: 0 auto;"
          >
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
    <!-- @todo: implémenter simplimmat
      <div class="col-3 col-sm-5">
      <DsfrPicture src="">
        <RapportVendeurSvg
          title="Illustration de la page du rapport vendeur HistoVec"
        />
      </DsfrPicture>
    </div>
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
      </div> -->

    <!-- @todo: Si la DSR souhaite de nouveau afficher le numéro d'expert (numAgree), il faut :
     0 - Demander à l'ingé data de faire de nouveau remonter le champs num_agree dans les opération d'historique : DEC_VE, PREM_RAP_VE, SEC_RAP_VE
     1 - Autoriser le champs numAgree à remonter dans le backend (cf: rechercher @numAgree1)
     2 - Autoriser le champs numAgree à remonter dans le frontend (cf: rechercher @numAgree2)
     3 - L'afficher dans l'historique lorsqu'il est disponible (cf: rechercher @numAgree3)
     4 - Ajouter un lien vers une modale explicative (cf: rechercher @numAgree4)
     5 - Implémenter la modale (cf: rechercher @numAgree5)

    @numAgree5: @todo: adapter à l'interface de DsfrModal
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
  <!-- @todo: branch logs
    OPEN MODAL =>  await api.log(`${this.$route.path}/share`)

    SEND MAIL lien acheteur =>  await api.log(`${this.$route.path}/share/mail`)

    COPY LINK lien acheteur =>  await api.log(`${this.$route.path}/share/copy`)

    SEND MAIL code partage HistoVec =>  await api.log(`${this.$route.path}/share-code-partage/mail`)

    COPY LINK code partage HistoVec =>  await api.log(`${this.$route.path}/share-code-partage/copy`)


    API UTAC ERROR => await api.log(`${this.$route.path}/share/kilometers-error`)


  -->
</template>

<style scoped>
/* @todo centralize these rules in common CSS file as a .histovec-fr-blue-title class */
[href] {
  background-image: none;
}

.fr-blue-text {
  color: var(--blue-france-sun-113-625);
}
</style>
