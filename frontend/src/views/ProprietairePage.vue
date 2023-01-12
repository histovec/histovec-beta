<script>
import { defineComponent } from 'vue'

import HistoVecButtonLink from '@/components/HistoVecButtonLink.vue'
import ImagePresentation from '@/components/ImagePresentation.vue'

import { mailTo } from '@/utils/email.js'

import { ANTS_PERSONAL_DATA_EMAIL, READ_OR_UPDATE_ANTS_PERSONAL_DATA_EMAIL } from '@/constants/email.js'
import { DATE_FR_REGEX, NUMERO_FORMULE_REGEX, NUMERO_IMMATRICULATION_FNI_REGEX, NUMERO_IMMATRICULATION_SIV_REGEX, NUMERO_SIREN_REGEX } from '@/constants/regex.js'
import { OLD_IMMATRICULATION_TYPE, TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@/constants/type.js'

import plaqueNonSupporteeSvg from '@/assets/img/plaque_non_supportee.svg?url'
import plaqueFniSvg from '@/assets/img/plaque_fni.svg?url'
import plaqueSivSvg from '@/assets/img/plaque_siv.svg?url'
import proprietaireSVG from '@/assets/img/proprietaire.svg?url'

import imageNomEtPrenomsFNI from '@/assets/img/aide/fni_nom_et_prenoms.jpg'
import imagePlaqueImmatriculationFNI from '@/assets/img/aide/fni_plaque_immatriculation.jpg'
import imageDateEmissionCertificatImmatriculationFNI from '@/assets/img/aide/fni_date_emission_certificat_immatriculation.jpg'

import imageNomSIV from '@/assets/img/aide/siv_nom.jpg'
import imagePrenomsSIV from '@/assets/img/aide/siv_prenoms.jpg'
import imagePlaqueImmatriculationSIV from '@/assets/img/aide/siv_plaque_immatriculation.jpg'
import imageNumeroFormuleSIV from '@/assets/img/aide/siv_numero_formule.jpg'


export default defineComponent({
  name: 'ProprietairePage',

  components: {HistoVecButtonLink, ImagePresentation},

  data () {
    const cachedFormData = JSON.parse(sessionStorage.getItem('formData'))
    const formData = (
      cachedFormData ||
      {
        typeImmatriculation: null,
        typePersonne: TYPE_PERSONNE.PARTICULIER,
        siv: {
          titulaire: {
            particulier: {
              nom: '',
              prenoms: '',
            },
            personneMorale : {
              raisonSociale: '',
              numeroSiren: '',
            },
          },
          numeroImmatriculation: '',
          numeroFormule: '',
        },
        fni: {
          titulaire: {
            particulier: {
              nomEtPrenoms: '',
            },
            personneMorale: {
              raisonSociale: '',
              numeroSiren: '',
            },
          },
          numeroImmatriculation: '',
          dateEmissionCertificatImmatriculation: '',
        },
      }
    )

    return {
      formData,

      modals: {
        common: {
          numeroSiren: {
            opened: false,
          },
        },
        siv: {
          nom: {
            opened: false,
          },
          prenoms: {
            opened: false,
          },
          numeroImmatriculation: {
            opened: false,
          },
          numeroFormule: {
            opened: false,
          },
        },
        fni: {
          nomEtPrenoms: {
            opened: false,
          },
          numeroImmatriculation: {
            opened: false,
          },
          dateEmissionCertificatImmatriculation: {
            opened: false,
          },
        },
      },

      tabs: {
        siv: {
          selectedTabIndex: 0,
          tabsAsc: true,
        },
        fni: {
          selectedTabIndex: 0,
          tabsAsc: true,
        },
      },

      // types
      TYPE_IMMATRICULATION,
      OLD_IMMATRICULATION_TYPE,

      // email
      ANTS_PERSONAL_DATA_EMAIL,

      images: {
        plaqueNonSupporteeSvg,
        plaqueFniSvg,
        plaqueSivSvg,
        proprietaireSVG,

        aide: {
          imageNomEtPrenomsFNI,
          imagePlaqueImmatriculationFNI,
          imageDateEmissionCertificatImmatriculationFNI,

          imageNomSIV,
          imagePrenomsSIV,
          imagePlaqueImmatriculationSIV,
          imageNumeroFormuleSIV,
        },
      },
    }
  },

  computed: {
    // @todo @focusTrap:
    // Implémenter un focus automatique sur le 1er élément du formulaire (en haut à gauche) lors de la sélection d’un format de plaque (SIV ou FNI) pour que l’usager n’ait pas à scroller sur le formulaire suite à la sélection.
    // (probablement via la dépendance 'focus-trap-vue')

    // @todo @csvCopy: Réimplementer le copier coller des data du CSV dans le formulaire en utilisant vue3-shortkey
    // onPaste (evt) {
    //   const data = evt.clipboardData.getData('Text').replace(/\s*$/, '').split(/\t+/)

    //   if (data.length > 1) {
    //     if (evt.target.name === 'nom') {
    //       if (this.formData.typeImmatriculation === this.TYPE_IMMATRICULATION.SIV) {
    //         // 1st element has already been pasted on current target name : 'nom'
    //         // It is equivalent to :
    //         // this.nom = data[0]
    //         this.prenom = data[1]
    //         this.plaque = data[2]
    //         this.formule = data[3]
    //       }
    //       if (this.formData.typeImmatriculation === this.TYPE_IMMATRICULATION.FNI) {
    //         // 1st element has already been pasted on current target name : 'nom'
    //         // It is equivalent to :
    //         // this.nom = data[0]
    //         this.plaque = data[1]
    //         this.dateCertificat = data[2]
    //       }
    //     }
    //     if (evt.target.name === 'raisonSociale') {
    //       // 1st element has already been pasted on current target name : 'raisonSociale'
    //       // It is equivalent to :
    //       // this.raisonSociale = data[0]
    //       this.siren = data[1]
    //       this.plaque = data[2]
    //       if (this.formData.typeImmatriculation === this.TYPE_IMMATRICULATION.SIV) {
    //         this.formule = data[3]
    //       }
    //       if (this.formData.typeImmatriculation === this.TYPE_IMMATRICULATION.FNI) {
    //         this.dateCertificat = data[3]
    //       }
    //     }
    //   }
    // },

    // ----- Validation -----

    isNomSivValid () {
      return this.formData.siv.titulaire.particulier.nom.length > 0
    },
    isPrenomsSivValid () {
      return this.formData.siv.titulaire.particulier.prenoms.length > 0
    },
    isRaisonSocialeSivValid () {
      return this.formData.siv.titulaire.personneMorale.raisonSociale.length > 0
    },
    isNumeroSirenSivValid () {
      return (
        !this.formData.siv.titulaire.personneMorale.numeroSiren ||
        this.formData.siv.titulaire.personneMorale.numeroSiren.match(NUMERO_SIREN_REGEX)
      )
    },
    isNumeroImmatriculationSivValid () {
      return this.formData.siv.numeroImmatriculation.match(NUMERO_IMMATRICULATION_SIV_REGEX)
    },
    isNumeroFormuleSivValid () {
      return this.formData.siv.numeroFormule.match(NUMERO_FORMULE_REGEX)
    },

    isNomEtPrenomsFniValid () {
      return this.formData.fni.titulaire.particulier.nomEtPrenoms.length > 0
    },
    isRaisonSocialeFniValid () {
      return this.formData.fni.titulaire.personneMorale.raisonSociale.length > 0
    },
    isNumeroSirenFniValid () {
      return (
        !this.formData.fni.titulaire.personneMorale.numeroSiren ||
        this.formData.fni.titulaire.personneMorale.numeroSiren.match(NUMERO_SIREN_REGEX)
      )
    },
    isNumeroImmatriculationFniValid () {
      return this.formData.fni.numeroImmatriculation.match(NUMERO_IMMATRICULATION_FNI_REGEX)
    },
    isDateEmissionCertificatImmatriculationFniValid() {
      return this.formData.fni.dateEmissionCertificatImmatriculation.match(DATE_FR_REGEX)
    },

    isFormSivParticulierValid () {
      return (
        this.isNomSivValid &&
        this.isPrenomsSivValid &&
        this.isNumeroImmatriculationSivValid &&
        this.isNumeroFormuleSivValid
      )
    },
    isFormSivPersonneMoraleValid () {
      return (
        this.isRaisonSocialeSivValid &&
        this.isNumeroSirenSivValid &&
        this.isNumeroImmatriculationSivValid &&
        this.isNumeroFormuleSivValid
      )
    },
    isFormFniParticulierValid () {
      return (
        this.isNomEtPrenomsFniValid &&
        this.isNumeroImmatriculationFniValid &&
        this.isDateEmissionCertificatImmatriculationFniValid
      )
    },
    isFormFniPersonneMoraleValid () {
      return (
        this.isRaisonSocialeFniValid &&
        this.isNumeroSirenFniValid &&
        this.isNumeroImmatriculationFniValid &&
        this.isDateEmissionCertificatImmatriculationFniValid
      )
    },

    isFormValid () {
      if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
        if (this.formData.typePersonne === TYPE_PERSONNE.PARTICULIER) {
          return this.isFormSivParticulierValid
        }
        if (this.formData.typePersonne === TYPE_PERSONNE.PRO) {
          return this.isFormSivPersonneMoraleValid
        }
      }

      if (this.formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
        if (this.formData.typePersonne === TYPE_PERSONNE.PARTICULIER) {
          return this.isFormFniParticulierValid
        }
        if (this.formData.typePersonne === TYPE_PERSONNE.PRO) {
          return this.isFormFniPersonneMoraleValid
        }
      }

      return false
    },

    // ----- Error messages -----

    nomSivErrorMessage () {
      return (
        this.formData.siv.titulaire.particulier.nom && !this.isNomSivValid ?
          'Le nom doit être renseigné tel qu\'indiqué sur le certificat d\'immatriculation.' :
          ''
      )
    },
    prenomsSivErrorMessage () {
      return (
        this.formData.siv.titulaire.particulier.prenoms && !this.isPrenomsSivValid ?
          'Le ou les prénoms doivent être renseignés tel(s) qu\'indiqué(s) sur le certificat d\'immatriculation.' :
          ''
      )
    },
    raisonSocialeSivErrorMessage () {
      return (
        this.formData.siv.titulaire.personneMorale.raisonSociale && !this.isRaisonSocialeSivValid ?
          'La raison sociale doit être renseignée telle qu\'indiquée sur le kbis.' :
          ''
      )
    },
    numeroSirenSivErrorMessage () {
      return (
        !this.isNumeroSirenSivValid ?
          'Le numéro SIREN doit comporter 9 chiffres ou être vide. Format : 123456789.' :
          ''
      )
    },
    numeroImmatriculationSivErrorMessage () {
      return (
        this.formData.siv.numeroImmatriculation && !this.isNumeroImmatriculationSivValid ?
          'Le numéro d\'immatriculation doit respecter le format "AA-123-AA" ou "AA 123 AA" ou "AA123AA".' :
          ''
      )
    },
    numeroFormuleSivErrorMessage () {
      return (
        this.formData.siv.numeroFormule && !this.isNumeroFormuleSivValid ?
          'Le numéro de formule doit respecter le format "2013BZ80335".' :
          ''
      )
    },

    nomEtPrenomsFniErrorMessage () {
      return (
        this.formData.fni.titulaire.particulier.nomEtPrenoms && !this.isNomEtPrenomsFniValid ?
          'Le nom et le ou les prénoms doivent être renseignés tel(s) qu\'indiqué(s) sur le certificat d\'immatriculation.' :
          ''
      )
    },
    raisonSocialeFniErrorMessage () {
      return (
        this.formData.fni.titulaire.personneMorale.raisonSociale && !this.isRaisonSocialeFniValid ?
          'La raison sociale doit être renseignée telle qu\'indiquée sur le kbis.' :
          ''
      )
    },
    numeroSirenFniErrorMessage () {
      return (
        !this.isNumeroSirenFniValid ?
          'Le numéro SIREN doit comporter 9 chiffres ou être vide. Format : 123456789.' :
          ''
      )
    },
    numeroImmatriculationFniErrorMessage () {
      return (
        this.formData.fni.numeroImmatriculation && !this.isNumeroImmatriculationFniValid ?
          'Le numéro d\'immatriculation doit respecter le format "123-ABC-45" ou "123 ABC 45" ou "123ABC45".' :
          ''
      )
    },
    dateEmissionCertificatImmatriculationFniErrorMessage () {
      return (
        this.formData.fni.dateEmissionCertificatImmatriculation && !this.isDateEmissionCertificatImmatriculationFniValid ?
          'La date d\'émission du certificat d\'immatriculation doit respecter le format "31/12/2020".' :
          ''
      )
    },
  },

  created () {
    this.readOrUpdateAntsPersonalDataEmail = mailTo(READ_OR_UPDATE_ANTS_PERSONAL_DATA_EMAIL)
  },

  methods: {
    selectTypeImmatriculation (typeImmatriculation) {
      this.formData.typeImmatriculation = typeImmatriculation
      if (typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
        this.selectSivTab(0)
        this.formData.typePersonne = TYPE_PERSONNE.PARTICULIER
      }
      if (typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
        this.selectFniTab(0)
        this.formData.typePersonne = TYPE_PERSONNE.PARTICULIER
      }
    },

    // Modales communes (SIV et FNI)
    onOpenModalNumeroSiren () {
      this.modals.common.numeroSiren.opened = true
    },
    onCloseModalNumeroSiren () {
      this.modals.common.numeroSiren.opened = false
    },

    // Modales SIV
    onOpenModalSivNom () {
      this.modals.siv.nom.opened = true
    },
    onCloseModalSivNom () {
      this.modals.siv.nom.opened = false
    },

    onOpenModalSivPrenoms () {
      this.modals.siv.prenoms.opened = true
    },
    onCloseModalSivPrenoms () {
      this.modals.siv.prenoms.opened = false
    },

    onOpenModalSivNumeroImmatriculation () {
      this.modals.siv.numeroImmatriculation.opened = true
    },
    onCloseModalSivNumeroImmatriculation () {
      this.modals.siv.numeroImmatriculation.opened = false
    },

    onOpenModalSivNumeroFormule () {
      this.modals.siv.numeroFormule.opened = true
    },
    onCloseModalSivNumeroFormule () {
      this.modals.siv.numeroFormule.opened = false
    },

    // Modales FNI
    onOpenModalFniNomEtPrenoms () {
      this.modals.fni.nomEtPrenoms.opened = true
    },
    onCloseModalFniNomEtPrenoms () {
      this.modals.fni.nomEtPrenoms.opened = false
    },

    onOpenModalFniNumeroImmatriculation () {
      this.modals.fni.numeroImmatriculation.opened = true
    },
    onCloseModalFniNumeroImmatriculation () {
      this.modals.fni.numeroImmatriculation.opened = false
    },

    onOpenModalFniDateEmissionCertificatImmatriculation () {
      this.modals.fni.dateEmissionCertificatImmatriculation.opened = true
    },
    onCloseModalFniDateEmissionCertificatImmatriculation () {
      this.modals.fni.dateEmissionCertificatImmatriculation.opened = false
    },

    // Tabs
    onSelectTab (idx) {
      if (idx === 0) {
        this.formData.typePersonne = TYPE_PERSONNE.PARTICULIER
        return
      }
      if (idx === 1) {
        this.formData.typePersonne = TYPE_PERSONNE.PRO
        return
      }
    },
    selectSivTab (idx) {
      this.onSelectTab(idx)
      this.asc = this.tabs.siv.selectedTabIndex < idx
      this.tabs.siv.selectedTabIndex = idx
    },
    selectFniTab (idx) {
      this.onSelectTab(idx)
      this.asc = this.tabs.fni.selectedTabIndex < idx
      this.tabs.fni.selectedTabIndex = idx
    },

    // Form
    persistFormData () {
      // Mise en cache pour :
      // - pouvoir rafraîchir la page du rapport vendeur sans repasser par le formulaire
      // - pré-remplir les entrées utilisateur sur le formulaire avec la précédente recherche validée
      // - pouvoir envoyer les entrées utilisateur lors de l'envoi d'un message via la rubrique "Contact"
      sessionStorage.setItem('formData', JSON.stringify(this.formData))
    },

    async onSubmit () {
      this.persistFormData()

      this.$router.push({
        name: 'rapportVendeur',
        params: {
          formData: JSON.stringify(this.formData),
        },
      })
    },

    onClear () {
      this.formData = {
        typeImmatriculation: this.formData.typeImmatriculation,
        typePersonne: TYPE_PERSONNE.PARTICULIER,
        siv: {
          titulaire: {
            particulier: {
              nom: '',
              prenoms: '',
            },
            personneMorale : {
              raisonSociale: '',
              numeroSiren: '',
            },
          },
          numeroImmatriculation: '',
          numeroFormule: '',
        },
        fni: {
          titulaire: {
            particulier: {
              nomEtPrenoms: '',
            },
            personneMorale: {
              raisonSociale: '',
              numeroSiren: '',
            },
          },
          numeroImmatriculation: '',
          dateEmissionCertificatImmatriculation: '',
        },
      }
    },
  },
})
</script>

<template>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="[
          {
            to: '/accueil',
            text: 'Accueil',
          },
          {
            text: 'Propriétaire',
          },
        ]"
      />
    </div>
    <div class="fr-col-lg-4 fr-col-xl-4">
      <ImagePresentation :src="images.proprietaireSVG" alt="Illustration de la page du propriétaire" />
    </div>
    <div class="fr-col-12  fr-col-lg-8  fr-col-xl-8  fr-mt-10v">
      <h1>Rassurez vos acheteurs potentiels</h1>
      <h2>Partagez l'historique de votre véhicule</h2>
      <p class="fr-text--xl">
        Vous souhaitez vendre votre véhicule et rassurer le futur acheteur ?
        Un acheteur potentiel vous demande le rapport ?
        Partagez-leur l'historique de votre véhicule.
      </p>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <p class="fr-text--md">
        HistoVec permet de consulter l'historique administratif de votre véhicule enregistré dans le Système
        d'Immatriculation des Véhicules (SIV).
      </p>
      <p class="fr-text--md">
        Pour toute demande de renseignements sur votre dossier ou de correction des informations,
        adressez-vous à l'Agence Nationale Des Titres Sécurisés (ANTS) par voie électronique (
        <a
          class="fr-link"
          :href="readOrUpdateAntsPersonalDataEmail"
        >
          {{ ANTS_PERSONAL_DATA_EMAIL }}
        </a>).
      </p>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center">
    <div class="fr-col-11  fr-col-lg-8  fr-col-xl-8  text-center">
      <h6>Veuillez sélectionner le format d'immatriculation de votre véhicule</h6>
    </div>
  </div>

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
    <div class="fr-col-12  fr-col-md-3 fr-col-lg-3  fr-col-xl-3  text-center">
      <img
        class="histovec-numero-immatriculation"
        :class="{ 'histovec-numero-immatriculation-opacity': formData.typeImmatriculation !== TYPE_IMMATRICULATION.SIV }"
        :src="images.plaqueSivSvg"
        @click="() => selectTypeImmatriculation(TYPE_IMMATRICULATION.SIV)"
      />
      <p class="fr-text--xs">
        Immatriculation depuis 2009
      </p>
    </div>

    <div class="fr-col-12  fr-col-md-3 fr-col-lg-3  fr-col-xl-3  text-center">
      <img
        class="histovec-numero-immatriculation"
        :class="{ 'histovec-numero-immatriculation-opacity': formData.typeImmatriculation !== TYPE_IMMATRICULATION.FNI }"
        :src="images.plaqueFniSvg"
        @click="() => selectTypeImmatriculation(TYPE_IMMATRICULATION.FNI)"
      />
      <p class="fr-text--xs">
        Immatriculation avant 2009
      </p>
    </div>

    <div class="fr-col-12  fr-col-md-3 fr-col-lg-3  fr-col-xl-3  text-center">
      <img
        class="histovec-numero-immatriculation"
        :class="{ 'histovec-numero-immatriculation-opacity': formData.typeImmatriculation !== OLD_IMMATRICULATION_TYPE }"
        :src="images.plaqueNonSupporteeSvg"
        @click="() => selectTypeImmatriculation(OLD_IMMATRICULATION_TYPE)"
      />
      <p class="fr-text--xs">
        Immatriculation avant 1995
      </p>
    </div>
  </div>

  <!-- Modals -->
  <DsfrModal
    ref="modalNumeroSiren"
    :opened="modals.common.numeroSiren.opened"
    title="Où trouver le numéro de SIREN ?"
    :origin="$refs.buttonNumeroSiren"
    @close="onCloseModalNumeroSiren()"
  >
    <div class="fr-grid-row  fr-grid-row--gutters  fr-mb-4w">
      <div class="fr-col-12">
        <p class="fr-text--md">
          Le <span class="fr-blue-text">numéro SIREN</span> correspond au <span class="fr-blue-text">9 premiers caractères du numéro SIRET</span>
          de votre société.
        </p>
        <p class="fr-text--md">
          Il figure sur le <span class="fr-blue-text">KBIS</span> de votre société.
        </p>
        <p class="fr-text--md">
          Vous pouvez aussi l'obtenir sur ce
          <a
            class="fr-link"
            href="https://www.societe.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            site
          </a>
          en effectuant une <span class="fr-blue-text">recherche avec le nom de votre société</span>.
        </p>
        <p class="fr-text--md">
          En tant qu'association ou collectivité locale, il se peut que vous n'ayez <span class="fr-blue-text">pas de numéro de SIREN</span>.
        </p>
        <p class="fr-text--md">
          Dans ce cas, <span class="fr-blue-text">laissez le champs SIREN vide</span>.
        </p>
      </div>
    </div>
  </DsfrModal>

  <DsfrModal
    ref="modalSivNom"
    :opened="modals.siv.nom.opened"
    title="Où trouver le nom ?"
    :origin="$refs.buttonSivNom"
    @close="onCloseModalSivNom()"
  >
    <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
      <div class="fr-col-12  text-center">
        <img
          alt="Indication localisation nom : au dessus du prénom"
          :src="images.aide.imageNomSIV"
          class="fr-responsive-img"
        />
      </div>
    </div>
  </DsfrModal>

  <DsfrModal
    ref="modalSivPrenoms"
    :opened="modals.siv.prenoms.opened"
    title="Où trouver le(s) prénom(s) ?"
    :origin="$refs.buttonSivPrenoms"
    @close="onCloseModalSivPrenoms()"
  >
    <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
      <div class="fr-col-12  text-center">
        <img
          alt="Indication localisation prenom(s) : en dessous du nom"
          :src="images.aide.imagePrenomsSIV"
          class="fr-responsive-img"
        />
      </div>
    </div>
  </DsfrModal>

  <DsfrModal
    ref="modalSivNumeroImmatriculation"
    :opened="modals.siv.numeroImmatriculation.opened"
    title="Où trouver le numéro d'immatriculation ?"
    :origin="$refs.buttonSivNumeroImmatriculation"
    @close="onCloseModalSivNumeroImmatriculation()"
  >
    <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
      <div class="fr-col-12  text-center">
        <img
          alt="Indication localisation numéro d'immatriculation : au dessus du numéro de formule"
          :src="images.aide.imagePlaqueImmatriculationSIV"
          class="fr-responsive-img"
        />
      </div>
    </div>
  </DsfrModal>

  <DsfrModal
    ref="modalSivNumeroFormule"
    :opened="modals.siv.numeroFormule.opened"
    title="Où trouver le numéro de formule ?"
    :origin="$refs.buttonSivNumeroImmatriculation"
    @close="onCloseModalSivNumeroFormule()"
  >
    <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
      <div class="fr-col-12  text-center">
        <img
          alt="Indication localisation numéro de formule : sous le numéro d'immatriculation ou dans la bande MRZ ou sur la première page du certificat d'immatriculation"
          :src="images.aide.imageNumeroFormuleSIV"
          class="fr-responsive-img"
        />
      </div>
    </div>
  </DsfrModal>


  <DsfrModal
    ref="modalFniNomEtPrenoms"
    :opened="modals.fni.nomEtPrenoms.opened"
    title="Où trouver le nom et le(s) prénom(s) ?"
    :origin="$refs.buttonFniNomEtPrenoms"
    @close="onCloseModalFniNomEtPrenoms()"
  >
    <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
      <div class="fr-col-12  text-center">
        <img
          alt="Indication localisation nom et prénom(s) : sous le numéro d'immatriculation"
          :src="images.aide.imageNomEtPrenomsFNI"
          class="fr-responsive-img"
        />
      </div>
    </div>
  </DsfrModal>

  <DsfrModal
    ref="modalFniNumeroImmatriculation"
    :opened="modals.fni.numeroImmatriculation.opened"
    title="Où trouver le numéro d'immatriculation ?"
    :origin="$refs.buttonFniNumeroImmatriculation"
    @close="onCloseModalFniNumeroImmatriculation()"
  >
    <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
      <div class="fr-col-12  text-center">
        <img
          alt="Indication localisation numéro d'immatriculation : au dessus du nom et prénom"
          :src="images.aide.imagePlaqueImmatriculationFNI"
          class="fr-responsive-img"
        />
      </div>
    </div>
  </DsfrModal>

  <DsfrModal
    ref="modalFniDateEmissionCertificatImmatriculation"
    :opened="modals.fni.dateEmissionCertificatImmatriculation.opened"
    title="Où trouver la date d'émission du certificat d'immatriculation ?"
    :origin="$refs.buttonFniDateEmissionCertificatImmatriculation"
    @close="onCloseModalFniDateEmissionCertificatImmatriculation()"
  >
    <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w">
      <div class="fr-col-12  text-center">
        <img
          alt="Indication localisation date du certificat d'immatriculation : à droite du numéro d'immatriculation"
          :src="images.aide.imageDateEmissionCertificatImmatriculationFNI"
          class="fr-responsive-img"
        />
      </div>
    </div>
  </DsfrModal>

  <!-- ----------------- -->

  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-2w">
    <div
      v-if="formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV"
      class="fr-col-12"
    >
      <DsfrTabs
        tab-list-name="Liste d'onglets pour un véhicule avec un numéro d'immatriculation au format SIV"
        :tab-titles="[{ title: 'Particulier'}, { title: 'Personne morale'}]"
        @select-tab="selectSivTab"
      >
        <DsfrTabContent
          panel-id="siv-tab-content-0"
          tab-id="siv-tab-0"
          :selected="tabs.siv.selectedTabIndex === 0"
          :asc="tabs.siv.tabsAsc"
        >
          <p class="fr-text--md  histovec-input-group-title">
            Titulaire
          </p>
          <div class="fr-grid-row  fr-grid-row--gutters ">
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isNomSivValid"
                :error-message="nomSivErrorMessage"
              >
                <DsfrInput
                  v-model="formData.siv.titulaire.particulier.nom"
                  label="Nom de naissance"
                  label-visible
                  hint="Tel qu'indiqué sur le certificat d'immatriculation."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonSivNom"
                      class="fr-link  help-link"
                      title="Où trouver le nom sur le certificat d'immatriculation au format SIV"
                      @click="onOpenModalSivNom()"
                    >
                      Où le trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isPrenomsSivValid"
                :error-message="prenomsSivErrorMessage"
              >
                <DsfrInput
                  v-model="formData.siv.titulaire.particulier.prenoms"
                  label="Prénom(s)"
                  label-visible
                  hint="Tel(s) qu'indiqué(s) sur le certificat d'immatriculation."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonSivPrenoms"
                      class="fr-link  help-link"
                      title="Où trouver le(s) prénom(s) sur le certificat d'immatriculation au format SIV"
                      @click="onOpenModalSivPrenoms()"
                    >
                      Où le(s) trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
          </div>
          <p class="fr-text--md  histovec-input-group-title  fr-mt-4w">
            Certificat d'immatriculation
          </p>

          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isNumeroImmatriculationSivValid"
                :error-message="numeroImmatriculationSivErrorMessage"
              >
                <DsfrInput
                  v-model="formData.siv.numeroImmatriculation"
                  label="Numéro d'immatriculation"
                  label-visible
                  hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : AA-123-AA."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonSivNumeroImmatriculation"
                      class="fr-link  help-link"
                      title="Où trouver le numéro d'immatriculation sur le certificat d'immatriculation au format SIV"
                      @click="onOpenModalSivNumeroImmatriculation()"
                    >
                      Où le trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isNumeroFormuleSivValid"
                :error-message="numeroFormuleSivErrorMessage"
              >
                <DsfrInput
                  v-model="formData.siv.numeroFormule"
                  label="Numéro de formule"
                  label-visible
                  hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 2013BZ80335."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonSivNumeroFormule"
                      class="fr-link  help-link"
                      title="Où trouver le numéro de formule sur le certificat d'immatriculation au format SIV"
                      @click="onOpenModalSivNumeroFormule()"
                    >
                      Où le trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="siv-tab-content-1"
          tab-id="siv-tab-1"
          :selected="tabs.siv.selectedTabIndex === 1"
          :asc="tabs.siv.tabsAsc"
        >
          <p class="fr-text--md  histovec-input-group-title">
            Titulaire
          </p>
          <div
            class="fr-grid-row  fr-grid-row--gutters"
          >
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isRaisonSocialeSivValid"
                :error-message="raisonSocialeSivErrorMessage"
              >
                <DsfrInput
                  v-model="formData.siv.titulaire.personneMorale.raisonSociale"
                  label="Raison sociale"
                  label-visible
                  hint="Tel qu'indiqué sur le kbis."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isNumeroSirenSivValid"
                :error-message="numeroSirenSivErrorMessage"
              >
                <DsfrInput
                  v-model="formData.siv.titulaire.personneMorale.numeroSiren"
                  label="Numéro SIREN"
                  label-visible
                  hint="Tel qu'indiqué sur le kbis. Format: 123456789 ou vide si vous n'en avez pas."
                >
                  <template #required-tip>
                    <span
                      ref="buttonNumeroSiren"
                      class="fr-link  help-link"
                      title="Où trouver le numéro de SIREN de votre société ?"
                      @click="onOpenModalNumeroSiren()"
                    >
                      Où le trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
          </div>
          <p class="fr-text--md  histovec-input-group-title  fr-mt-4w">
            Certificat d'immatriculation
          </p>

          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isNumeroImmatriculationSivValid"
                :error-message="numeroImmatriculationSivErrorMessage"
              >
                <DsfrInput
                  v-model="formData.siv.numeroImmatriculation"
                  label="Numéro d'immatriculation"
                  label-visible
                  hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : AA-123-AA."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonSivNumeroImmatriculation"
                      class="fr-link  help-link"
                      title="Où trouver le numéro d'immatriculation sur le certificat d'immatriculation au format SIV"
                      @click="onOpenModalSivNumeroImmatriculation()"
                    >
                      Où le trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isNumeroFormuleSivValid"
                :error-message="numeroFormuleSivErrorMessage"
              >
                <DsfrInput
                  v-model="formData.siv.numeroFormule"
                  label="Numéro de formule"
                  label-visible
                  hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 2013BZ80335."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonSivNumeroFormule"
                      class="fr-link  help-link"
                      title="Où trouver le numéro de formule sur le certificat d'immatriculation au format SIV"
                      @click="onOpenModalSivNumeroFormule()"
                    >
                      Où le trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
          </div>
        </DsfrTabContent>
      </DsfrTabs>
    </div>
    <div
      v-if="formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI"
      class="fr-col-12"
    >
      <DsfrTabs
        tab-list-name="Liste d'onglets pour un véhicule avec un numéro d'immatriculation au format FNI"
        :tab-titles="[{ title: 'Particulier'}, { title: 'Personne morale'}]"
        @select-tab="selectFniTab"
      >
        <DsfrTabContent
          panel-id="fni-tab-content-0"
          tab-id="fni-tab-0"
          :selected="tabs.fni.selectedTabIndex === 0"
          :asc="tabs.fni.tabsAsc"
        >
          <p class="fr-text--md  histovec-input-group-title">
            Titulaire
          </p>
          <div
            class="fr-grid-row  fr-grid-row--gutters"
          >
            <div class="fr-col-12">
              <DsfrInputGroup
                :is-valid="isNomEtPrenomsFniValid"
                :error-message="nomEtPrenomsFniErrorMessage"
              >
                <DsfrInput
                  v-model="formData.fni.titulaire.particulier.nomEtPrenoms"
                  label="Nom de naissance et prénom(s)"
                  label-visible
                  hint="Tel qu'indiqué sur le certificat d'immatriculation."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonFniNomEtPrenoms"
                      class="fr-link  help-link"
                      title="Où trouver le nom et le(s) prénom(s) sur le certificat d'immatriculation au format FNI"
                      @click="onOpenModalFniNomEtPrenoms()"
                    >
                      Où les trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
          </div>

          <p class="fr-text--md  histovec-input-group-title  fr-mt-4w">
            Certificat d'immatriculation
          </p>

          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :error-message="numeroImmatriculationFniErrorMessage"
              >
                <DsfrInput
                  v-model="formData.fni.numeroImmatriculation"
                  label="Numéro d'immatriculation"
                  label-visible
                  hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 123-ABC-45."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonFniNumeroImmatriculation"
                      class="fr-link  help-link"
                      title="Où trouver le numéro d'immatriculation sur le certificat d'immatriculation au format FNI"
                      @click="onOpenModalFniNumeroImmatriculation()"
                    >
                      Où le trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isDateEmissionCertificatImmatriculationFniValid"
                :error-message="dateEmissionCertificatImmatriculationFniErrorMessage"
              >
                <DsfrInput
                  v-model="formData.fni.dateEmissionCertificatImmatriculation"
                  label="Date d'émission du certificat d'immatriculation"
                  label-visible
                  hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 31/12/2020."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonFniDateEmissionCertificatImmatriculation"
                      class="fr-link  help-link"
                      title="Où trouver la date d'émission du certificat d'immatriculation sur le certificat d'immatriculation au format FNI"
                      @click="onOpenModalFniDateEmissionCertificatImmatriculation()"
                    >
                      Où la trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="fni-tab-content-1"
          tab-id="fni-tab-1"
          :selected="tabs.fni.selectedTabIndex === 1"
          :asc="tabs.fni.tabsAsc"
        >
          <p class="fr-text--md  histovec-input-group-title">
            Titulaire
          </p>
          <div
            class="fr-grid-row  fr-grid-row--gutters"
          >
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isRaisonSocialeFniValid"
                :error-message="raisonSocialeFniErrorMessage"
              >
                <DsfrInput
                  v-model="formData.fni.titulaire.personneMorale.raisonSociale"
                  label="Raison sociale"
                  label-visible
                  hint="Tel qu'indiqué sur le kbis."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isNumeroSirenFniValid"
                :error-message="numeroSirenFniErrorMessage"
              >
                <DsfrInput
                  v-model="formData.fni.titulaire.personneMorale.numeroSiren"
                  label="Numéro SIREN"
                  label-visible
                  hint="Tel qu'indiqué sur le kbis. Format: 123456789 ou vide si vous n'en avez pas."
                >
                  <template #required-tip>
                    <span
                      ref="buttonNumeroSiren"
                      class="fr-link  help-link"
                      title="Où trouver le numéro de SIREN de votre société ?"
                      @click="onOpenModalNumeroSiren()"
                    >
                      Où le trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
          </div>

          <p class="fr-text--md  histovec-input-group-title  fr-mt-4w">
            Certificat d'immatriculation
          </p>

          <div class="fr-grid-row  fr-grid-row--gutters">
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isNumeroImmatriculationFniValid"
                :error-message="numeroImmatriculationFniErrorMessage"
              >
                <DsfrInput
                  v-model="formData.fni.numeroImmatriculation"
                  label="Numéro d'immatriculation"
                  label-visible
                  hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 123-ABC-45."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonFniNumeroImmatriculation"
                      class="fr-link  help-link"
                      title="Où trouver le numéro d'immatriculation sur le certificat d'immatriculation au format FNI"
                      @click="onOpenModalFniNumeroImmatriculation()"
                    >
                      Où le trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </DsfrInputGroup>
            </div>
            <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
              <DsfrInputGroup
                :is-valid="isDateEmissionCertificatImmatriculationFniValid"
                :error-message="dateEmissionCertificatImmatriculationFniErrorMessage"
              >
                <DsfrInput
                  v-model="formData.fni.dateEmissionCertificatImmatriculation"
                  label="Date d'émission du certificat d'immatriculation"
                  label-visible
                  hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 31/12/2020."
                  required
                >
                  <template #required-tip>
                    <em class="required-label"> *</em>
                    <span
                      ref="buttonFniDateEmissionCertificatImmatriculation"
                      class="fr-link  help-link"
                      title="Où trouver la date d'émission du certificat d'immatriculation sur le certificat d'immatriculation au format FNI"
                      @click="onOpenModalFniDateEmissionCertificatImmatriculation()"
                    >
                      Où la trouver
                      <VIcon
                        class="help-icon"
                        name="ri-information-line"
                      />
                    </span>
                  </template>
                </DsfrInput>
              </dsfrinputgroup>
            </div>
          </div>
        </DsfrTabContent>
      </DsfrTabs>
    </div>
  </div>
  <div
    v-if="formData.typeImmatriculation === OLD_IMMATRICULATION_TYPE"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w"
  >
    <div class="fr-col-12  fr-col-lg-8  fr-col-xl-8">
      <DsfrAlert
        type="info"
        title="Historique indisponible à ce jour"
        description="
          L'historique de ce véhicule n'est pas disponible sur HistoVec à ce jour.
          Nous vous invitons à télécharger le Certificat de Situation Administrative détaille (CSA) sur le site de l'ANTS.
        "
      />
    </div>
  </div>
  <div
    v-if="formData.typeImmatriculation === OLD_IMMATRICULATION_TYPE"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w"
  >
    <div class="fr-col-12  fr-col-lg-3  fr-col-xl-3  text-center">
      <HistoVecButtonLink
        label="Obtenir le CSA via l'ANTS"
        to="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
      />
    </div>
  </div>

  <div
    v-if="formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI || formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV"
    class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center  fr-mb-4w"
  >
    <div
      class="fr-col-6  fr-col-lg-3  fr-col-xl-3"
      style="text-align: right"
    >
      <DsfrButton
        label="Rechercher"
        icon="ri-search-line"
        :disabled="!isFormValid"
        @click="onSubmit"
      />
    </div>
    <div
      class="fr-col-6  fr-col-lg-3  fr-col-xl-3"
      style="text-align: left"
    >
      <DsfrButton
        label="Effacer"
        icon="ri-close-line"
        secondary
        @click="onClear"
      />
    </div>
  </div>
</template>

<style scoped>
.histovec-input-group-title {
  font-weight: bold !important;
}

.histovec-numero-immatriculation {
  cursor: pointer;
  height: 2.5rem;
}

.histovec-numero-immatriculation-opacity {
  opacity: 0.2;
}

.required-label {
  color: red;
}

.text-center {
  text-align: center;
}

.fr-blue-text {
  color: var(--blue-france-sun-113-625);
}

.help-link {
  margin-left: 1rem;
  cursor: pointer;
}

.help-icon {
  margin-left: 0.2rem;
}
</style>
