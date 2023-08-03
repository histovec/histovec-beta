<script>
import { defineComponent } from 'vue'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'
import TuileDsfrNonCliquable from '@/components/TuileDsfrNonCliquable.vue'
import LoaderComponent from '@/components/LoaderComponent.vue';
import ImagePresentation from '@/components/ImagePresentation.vue';
import HistoVecModale from '@/components/HistoVecModale.vue';
import AlerteComponent from '@/components/AlerteComponent.vue';
import OngletSynthese from '@/views/rapportPage/component/OngletSynthese.vue';
import OngletVehicule from '@/views/rapportPage/component/OngletVehicule.vue';
import OngletTitulaire from '@/views/rapportPage/component/OngletTitulaire.vue';
import OngletSituationAdministrative from '@/views/rapportPage/component/OngletSituationAdministrative.vue';
import OngletHistorique from '@/views/rapportPage/component/OngletHistorique.vue';
import OngletControlesTechniques from '@/views/rapportPage/component/OngletControlesTechniques.vue';
import OngletKilometrage from '@/views/rapportPage/component/OngletKilometrage.vue';

import { generateCsa } from '@Utils/csaAsPdf/index.js'
import { RAPPORT_FILENAME } from '@Constants/csaAsPdf.js'
import { base64Encode, urlSafeBase64Decode } from '@Utils/encoding.js'
import { downloadBlob } from '@Utils/file.js'
import { getExposant } from '@Utils/format.js'
import { mailTo } from '@Utils/email.js'
import { getShareReportEmail } from '@Utils/dynamicEmail.js'

import api from '@Api/index.js'

import reportService from '@/services/report.js'

import operationsMapping from '@Assets/json/operations.json'
import syntheseMapping from '@Assets/json/synthese.json'

import { REPORT_TABS } from '@Constants/reportTabs.js'
import { TYPE_IMMATRICULATION, TYPE_RAPPORT } from '@Constants/type.js'
import { DEFAULT_DATE_UPDATE } from '@Constants/v.js'
import { USAGE_AGRICOLE, USAGE_COLLECTION } from '@Constants/usagesSynthese.js'

import rapportAcheteurSvg from '@Assets/img/acheteur.svg?url'
import rapportVendeurSvg from '@Assets/img/rapport.svg?url'
import logoSimplimmat from '@Assets/img/simplimmat.png'

import '@/assets/stylesheets/globale.css'

// CSA
import logoHistoVec from '@Assets/img/deprecated/logo_histovec_avec_titre.png'
import logoMI from '@Assets/img/deprecated/logo_ministere_interieur.png'

import genererId from '@Services/genererId'
import genererCle from '@Services/genererCle'
import gestionAppelApi from '@Services/api/gestionAppelApi'
import { useRapportStore } from '@Stores/rapport'
import { apiUrl } from '@/config.js'

export default defineComponent({
  name: 'RapportVendeurPage',

  components: {
    OngletKilometrage,
    OngletControlesTechniques,
    OngletHistorique,
    OngletSituationAdministrative,
    OngletTitulaire,
    OngletVehicule,
    OngletSynthese,
    LoaderComponent,
    TuileDsfrNonCliquable,
    HistoVecModale,
    AlerteComponent,
    HistoVecButtonLink,
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
      uuid: localStorage.getItem('userId'),
      apiUrl,
      // Initialized beforeMount
      holderId: null,
      holderKey: null,
      rapportData: {
        administratif: {},
        vehicule: {
          caracteristiqueTechnique: {},
          infosImport: {},
        },
      },
      formData: null,
      tabTitles: [
        { title: 'Synthèse', panelId: 'report-tab-content-0', tabId:'report-tab-0'},
        { title: 'Véhicule', panelId: 'report-tab-content-1', tabId:'report-tab-1'},
        { title: 'Titulaire et Titre', panelId: 'report-tab-content-2', tabId:'report-tab-2'},
        { title: 'Situation administrative', panelId: 'report-tab-content-3', tabId:'report-tab-3'},
        { title: 'Historique', panelId: 'report-tab-content-4', tabId:'report-tab-4'},
      ],
      modaleActions: [
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
      ],

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
        qrcode: null,

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

        // @flag @ignoreUtacCache
        // Outil de debug (doublé par côté backend pour empêcher son usage en PROD)
        ignoreUtacCache: false,
      },
      sessionStorage,
      isNotificationOpened: false,
      texteNotification: '',
      typeNotification: 'success',
      isLoading: false,
      store: useRapportStore(),

      // data triés
      isRapportAcheteur: this.typeRapport === TYPE_RAPPORT.ACHETEUR,
      isRapportVendeur: this.typeRapport === TYPE_RAPPORT.VENDEUR,
    }
  },

  computed: {
    getVehiculeDescription () {
      return (
        this.isCIAnnule ?
          `Le certificat demandé a été annulé : ${ this.rapportData?.vehicule?.infos?.plaqueImmatriculation }` :
          `Numéro d'immatriculation : ${ this.rapportData?.vehicule?.infos?.plaqueImmatriculation }`
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

    currentTab () {
      return this.tabs.mapping[this.tabs.selectedTabIndex]
    },

    codePartageHistoVec () {
      return `${this.holderId}-${this.holderKey}`
    },
    baseUrl () {
      // Equivalent to 'https://histovec.interieur.gouv.fr' for production
      return window.location.protocol + '//' + window.location.host
    },
    url () {
      return `${this.baseUrl}/histovec/rapport-acheteur?key=${this.rapportData.clefAcheteur}`
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

    dateMiseAJourFR () {
      // todo : modifier la date récupérer pour être conforme à la date récupéré de l'api data
      return this.rapportData?.dateMiseAJour? this.rapportData.dateMiseAJour: '01/01/1900'
    },
    isCIAnnule () {
      return Boolean(
        this.rapportData && this.rapportData?.vehicule &&
        this.rapportData?.vehicule.situationAdmin &&
        this.rapportData?.vehicule.situationAdmin.isCiAnnule,
      )
    },
    isDefaultDataDate () {
      return this.rapportData?.dateMiseAJour === DEFAULT_DATE_UPDATE
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

    // ------------------ email ---------------------

    shareReportEmail () {
      const SHARE_REPORT_EMAIL = getShareReportEmail({ reportUrl: this.url })
      return mailTo(SHARE_REPORT_EMAIL)
    },
    // ----------------------------------------------

  },

  beforeMount: async function () {
    this.isLoading = true
    // Préparation des images pour la génération du CSA
    if (!this.images.csa.logoHistoVecBytes) {
      this.images.csa.logoHistoVecBytes = await fetch(logoHistoVec).then((res) => res.arrayBuffer())
    }

    if (!this.images.csa.logoMIBytes) {
      this.images.csa.logoMIBytes = await fetch(logoMI).then((res) => res.arrayBuffer())
    }

    if (this.typeRapport === TYPE_RAPPORT.VENDEUR) {
      this.formData = sessionStorage.getItem('formData') && JSON.parse(sessionStorage.getItem('formData'))

      if (!this.formData) {
        this.$router.push({
          name: 'proprietaire',
        })
        return
      }

      // Récupération de la donnée du rapport HistoVec
      await gestionAppelApi.fetchRapportProprietaire(this.formData)
      this.rapportData = this.store.getRapport

      // récupère le qrcode
      try {
        const qrcodeResponse = await api.getQrCode(this.rapportData.clefAcheteur)
        const myBlob = new Blob([qrcodeResponse.data], {type: 'image/png'});

        const fileReader = new FileReader();
        fileReader.onload = () => {
          this.images.qrcode = fileReader.result;
        };
        fileReader.readAsDataURL(myBlob);
      } catch (error) {
        api.log('/qrcode-ko')
      }

      if (this.store.getStatus === 200) {
        api.log('/holder/ok')
      }
    }

    if (this.typeRapport === TYPE_RAPPORT.ACHETEUR) {
      const { key, qr_code } = this.$route.query

      if (qr_code) api.log(`/qrcode/${qr_code}`)

      await gestionAppelApi.fetchRapportAcheteur(key)
      this.rapportData = this.store.getRapport

      if (this.store.getStatus === 200) {
        api.log('/buyer/ok')
      }
    }

    // Calcul des informations du propriétaire pour pouvoir créer un lien acheteur et le code Partage HistoVec
    this.holderId = await genererId.proprietaireId(this.formData)
    this.holderKey = await genererCle.cleProprietaire(this.formData)

    this.tabTitles = (
      (this.store.getControlesTechniques && this.store.getControlesTechniques.status === 200 ) ?
        this.tabTitles.concat([
          { title: 'Contrôles techniques', panelId: 'report-tab-content-5', tabId:'report-tab-5'},
          { title: 'Kilométrage', panelId: 'report-tab-content-6', tabId:'report-tab-6'},
        ]) :
        this.tabTitles
    )

    this.isLoading = false;
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
      } = this.rapportData

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
          historyItems: this.rapportData.historique.map((item) => `${item.date} ${item.nature}`),
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
      <img
        :src="images.qrcode"
        alt="QR code de redirection vers le lien acheteur."
        class="image-qrcode"
      >
    </div>
  </HistoVecModale>
  <AlerteComponent
    v-if="isNotificationOpened"
    :description="texteNotification"
    :type="typeNotification"
    small
    @close="fermerAlerte"
  />
  <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
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
      class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v"
    >
      <h1>Rapport de votre véhicule</h1>
      <h2>Consultez et partagez l'historique du véhicule</h2>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-6 fr-mt-2w  text-center">
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
      class="fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v"
    >
      <h1>Rapport du véhicule</h1>
      <h2>Consultez l'historique du véhicule</h2>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-lg-6 fr-col-xl-6 fr-mt-2w  text-center">
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
    class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mb-3w"
  >
    <div class="fr-col-12 fr-col-lg-8 fr-col-xl-8">
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
    class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mb-4w"
  >
    <div class="fr-col-12 fr-col-md-5 fr-col-lg-4 fr-col-xl-4  text-center">
      <HistoVecButtonLink
        label="Obtenir le CSA à jour via l'ANTS"
        to="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
      />
    </div>
  </div>

  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mb-6w">
    <div class="fr-col-12 fr-col-lg-5 fr-col-xl-5">
      <TuileDsfrNonCliquable
        :is-loading="isLoading || store.getChargement"
        titre="Le véhicule"
      >
        {{ getVehiculeDescription }}
      </TuileDsfrNonCliquable>
    </div>
    <div class="fr-col-12 fr-col-lg-5 fr-col-xl-5">
      <TuileDsfrNonCliquable
        :is-loading="isLoading || store.getChargement"
        titre="Informations du Ministère de l'Intérieur"
      >
        {{ getMiDescription }}
      </TuileDsfrNonCliquable>
    </div>
  </div>

  <div
    v-if="!isCIAnnule && store.getRapport"
    class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mb-4w"
  >
    <div class="fr-col-12 fr-col-lg-11 fr-col-xl-11">
      <!-- @todo @reportAccordeon : pour la vue mobile sm et xs : utiliser un accordeon ? -->
      <DsfrTabs
        tab-list-name="Liste d'onglets du rapport du véhicule"
        :tab-titles="tabTitles"
        @select-tab="selectTab"
      >
        <LoaderComponent
          v-if="isLoading || store.getChargement"
          taille="md"
        />
        <DsfrTabContent
          class="background-default-white"
          panel-id="report-tab-content-0"
          tab-id="report-tab-0"
          :selected="tabs.selectedTabIndex === 0"
          :asc="tabs.asc"
        >
          <OngletSynthese
            :is-rapport-vendeur="isRapportVendeur"
            :rapport-data="rapportData"
          />
        </DsfrTabContent>

        <DsfrTabContent
          class="background-default-white"
          panel-id="report-tab-content-1"
          tab-id="report-tab-1"
          :selected="tabs.selectedTabIndex === 1"
          :asc="tabs.asc"
        >
          <OngletVehicule
            :caracteristiques-techniques="rapportData?.vehicule?.caracteristiques"
          />
        </DsfrTabContent>

        <DsfrTabContent
          class="background-default-white"
          panel-id="report-tab-content-2"
          tab-id="report-tab-2"
          :selected="tabs.selectedTabIndex === 2"
          :asc="tabs.asc"
        >
          <OngletTitulaire
            :titulaires="rapportData?.proprietaire"
            :infos-import="rapportData?.vehicule?.infosImport"
            :infos="rapportData?.vehicule?.infos"
            :certificat-immatriculation="rapportData?.certificatImmatriculation"
          />
        </DsfrTabContent>

        <DsfrTabContent
          class="background-default-white"
          panel-id="report-tab-content-3"
          tab-id="report-tab-3"
          :selected="tabs.selectedTabIndex === 3"
          :asc="tabs.asc"
        >
          <OngletSituationAdministrative
            :is-rapport-vendeur="isRapportVendeur"
            :situation-administrative="rapportData?.vehicule?.situationAdmin"
            :infos="rapportData?.vehicule?.infos"
            :certificat-immatriculation="rapportData?.certificatImmatriculation"
          />
        </DsfrTabContent>

        <DsfrTabContent
          class="background-default-white"
          panel-id="report-tab-content-4"
          tab-id="report-tab-4"
          :selected="tabs.selectedTabIndex === 4"
          :asc="tabs.asc"
        >
          <OngletHistorique
            :historique-data="rapportData?.vehicule?.historique"
            :vehicule-importe="rapportData?.vehicule?.infosImport?.isImported"
            :date-premiere-immatriculation-etranger="rapportData?.vehicule?.infosImport?.datePremiereImmatEtranger"
          />
        </DsfrTabContent>

        <DsfrTabContent
          class="background-default-white"
          panel-id="report-tab-content-5"
          tab-id="report-tab-5"
          :selected="tabs.selectedTabIndex === 5"
          :asc="tabs.asc"
        >
          <OngletControlesTechniques
            :controles-techniques-historique="rapportData?.utac?.ct"
          />
        </DsfrTabContent>

        <DsfrTabContent
          class="background-default-white"
          panel-id="report-tab-content-6"
          tab-id="report-tab-6"
          :selected="tabs.selectedTabIndex === 6"
          :asc="tabs.asc"
        >
          <OngletKilometrage
            :controles-techniques-historique="rapportData?.utac?.ct"
          />
        </DsfrTabContent>
      </DsfrTabs>
    </div>
  </div>

  <div
    v-if="isRapportVendeur"
    class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mb-4w"
  >
    <div class="fr-col-12 fr-col-md-4 fr-col-lg-3 fr-col-xl-3  text-center">
      <DsfrButton
        label="Imprimer le CSA"
        icon="ri-printer-line"
        @click="generatePdf"
      />
    </div>
    <div
      v-if="!isCIAnnule"
      class="fr-col-12 fr-col-md-4 fr-col-lg-3 fr-col-xl-3  text-center"
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

  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mb-4w">
    <div class="fr-col-12 fr-col-md-2 fr-col-lg-2 fr-col-xl-2  text-center">
      <img
        class="fr-responsive-img"
        :src="images.logoSimplimmat"
        alt=""
      >
    </div>
    <div class="fr-col-12 fr-col-md-8 fr-col-lg-8 fr-col-xl-8  text-center">
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
  .image-qrcode {
    height: 170px;
    width: 170px;
  }
</style>
