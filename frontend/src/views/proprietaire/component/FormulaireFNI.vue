<script>
import {defineComponent} from 'vue'
import { sleep } from '@Utils/sleep';

import { useRapportStore } from '@Stores/rapport'
import { mentionChampObligatoire } from '@Constants/proprietaireConstantes'
import { CHAMP_MODIFIE, collerPressePapierEtDistribuerDansFormulaire } from '@Utils/collerPressePapierEtDistribuerDansFormulaire.js'
import { DATE_FR_REGEX, NUMERO_IMMATRICULATION_FNI_REGEX, NUMERO_SIREN_REGEX } from '@Constants/regex.js'
import { TYPE_PERSONNE } from '@Constants/type.js'

import imageNomEtPrenomsFNI from '@Assets/img/aide/fni_nom_et_prenoms.jpg'
import imagePlaqueImmatriculationFNI from '@Assets/img/aide/fni_plaque_immatriculation.jpg'
import imageDateEmissionCertificatImmatriculationFNI from '@Assets/img/aide/fni_date_emission_certificat_immatriculation.jpg'

export default defineComponent({
  name: 'FormulaireFNI',
  props:{
    formulaireData: {
      type: Object,
      default: null,
    },
  },
  data () {
    const tabFniTitles = [{ title: 'Particulier', panelId: 'fni-tab-content-0', tabId:'fni-tab-0'}, { title: 'Personne morale', panelId: 'fni-tab-content-1', tabId:'fni-tab-1'}]
    return {
      formData: this.formulaireData,
      store: useRapportStore(),
      tabFniTitles,
      mentionChampObligatoire,
      images: {
        aide: {
          imageNomEtPrenomsFNI,
          imagePlaqueImmatriculationFNI,
          imageDateEmissionCertificatImmatriculationFNI,
        },
      },
      collerPressePapierEtDistribuerDansFormulaire: collerPressePapierEtDistribuerDansFormulaire,
      CHAMP_MODIFIE: CHAMP_MODIFIE,
      fni: {
        selectedTabIndex: 0,
        tabsAsc: true,
      },
      modals: {
        common: {
          numeroSiren: {
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
    }
  },
  computed: {

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

    // ----- Error messages -----

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

  watch: {
    'fni.selectedTabIndex': function (val) {
      sleep(300).then(() => {
        if (val === 0) {
          document.getElementById('form-fni-particulier-nom-prenom').focus()
        }
        if (val === 1) {
          document.getElementById('form-fni-personne-morale-raison-sociale').focus()
        }
      })
    },
  },
  methods:{
    // Tabs
    onSelectTab (idx) {
      if (idx === 0) {
        // eslint-disable-next-line vue/no-mutating-props
        this.formData.typePersonne = TYPE_PERSONNE.PARTICULIER
        return
      }
      if (idx === 1) {
        // eslint-disable-next-line vue/no-mutating-props
        this.formData.typePersonne = TYPE_PERSONNE.PRO
        return
      }
    },
    selectFniTab(idx) {
      this.onSelectTab(idx)
      this.asc = this.fni.selectedTabIndex < idx
      this.fni.selectedTabIndex = idx
    },
    // Modales communes (SIV et FNI)
    onOpenModalNumeroSiren () {
      this.modals.common.numeroSiren.opened = true
    },
    onCloseModalNumeroSiren () {
      this.modals.common.numeroSiren.opened = false
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

  },
})
</script>

<template>
  <!-- Modals -->
  <DsfrModal
    ref="modalNumeroSiren"
    :opened="modals.common.numeroSiren.opened"
    title="Où trouver le numéro de S&#8203;I&#8203;R&#8203;E&#8203;N ?"
    :origin="$refs.buttonNumeroSiren"
    @close="onCloseModalNumeroSiren()"
  >
    <div class="fr-grid-row  fr-grid-row--gutters  fr-mb-4w">
      <div class="fr-col-12">
        <p class="fr-text--md">
          Le <span class="fr-text--bleu">numéro S&#8203;I&#8203;R&#8203;E&#8203;N</span> correspond au <span class="fr-text--bleu">9 premiers caractères du numéro SIRET</span>
          de votre société.
        </p>
        <p class="fr-text--md">
          Il figure sur le <span class="fr-text--bleu">K&#8203;B&#8203;I&#8203;S&#8203;</span> de votre société.
        </p>
        <p class="fr-text--md">
          Vous pouvez aussi l'obtenir sur le site
          <a
            class="fr-link"
            title="Le site de societe.com"
            href="https://www.societe.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            societe.com
          </a>
          en effectuant une <span class="fr-text--bleu">recherche avec le nom de votre société</span>.
        </p>
        <p class="fr-text--md">
          En tant qu'association ou collectivité locale, il se peut que vous n'ayez <span class="fr-text--bleu">pas de numéro de S&#8203;I&#8203;R&#8203;E&#8203;N</span>.
        </p>
        <p class="fr-text--md">
          Dans ce cas, <span class="fr-text--bleu">laissez le champs S&#8203;I&#8203;R&#8203;E&#8203;N vide</span>.
        </p>
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

  <DsfrTabs
    tab-list-name="Liste d'onglets pour un véhicule avec un numéro d'immatriculation au format FNI"
    :tab-titles="tabFniTitles"
    @select-tab="selectFniTab"
  >
    <DsfrTabContent
      class="background-default-white"
      panel-id="fni-tab-content-0"
      tab-id="fni-tab-0"
      :selected="fni.selectedTabIndex === 0"
      :asc="fni.tabsAsc"
    >
      <p class="fr-text--xs">
        {{ mentionChampObligatoire }}
      </p>
      <p class="fr-text--md  histovec-input-group-title">
        Titulaire
      </p>
      <div
        class="fr-grid-row  fr-grid-row--gutters"
      >
        <div class="fr-col-12">
          <DsfrInputGroup
            :is-valid="isNomEtPrenomsFniValid"
          >
            <DsfrInput
              id="form-fni-particulier-nom-prenom"
              v-model="formData.fni.titulaire.particulier.nomEtPrenoms"
              label="Nom de naissance et prénom(s)"
              label-visible
              autocomplete="name"
              hint="Tel qu'indiqué sur le certificat d'immatriculation."
              required
              aria-required="true"
              :aria-invalid="!isNomEtPrenomsFniValid"
              aria-errormessage="nom-et-prenom-particulier-FNI-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.FNI_NOM_PRENOM, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonFniNomEtPrenoms"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le nom et le(s) prénom(s) sur le certificat d'immatriculation au format FNI"
                  @click="onOpenModalFniNomEtPrenoms()"
                  @keydown.enter="onOpenModalFniNomEtPrenoms()"
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
            :is-valid="isNumeroImmatriculationFniValid"
            :error-message="numeroImmatriculationFniErrorMessage"
            description-id="numero-immatriculation-particulier-FNI-erreur-message"
          >
            <DsfrInput
              id="form-fni-particulier-numero-immatriculation"
              v-model="formData.fni.numeroImmatriculation"
              label="Numéro d'immatriculation"
              label-visible
              hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 123-ABC-45."
              required
              aria-required="true"
              :aria-invalid="!isNumeroImmatriculationFniValid"
              aria-errormessage="numero-immatriculation-particulier-FNI-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.FNI_IMMATRICULATION, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonFniNumeroImmatriculation"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le numéro d'immatriculation sur le certificat d'immatriculation au format FNI"
                  @click="onOpenModalFniNumeroImmatriculation()"
                  @keydown.enter="onOpenModalFniNumeroImmatriculation()"
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
            description-id="date-emission-certificat-immatriculation-particulier-FNI-erreur-message"
          >
            <DsfrInput
              id="form-fni-particulier-date-emission"
              v-model="formData.fni.dateEmissionCertificatImmatriculation"
              label="Date d'émission du certificat d'immatriculation"
              label-visible
              hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 31/12/2020."
              required
              aria-required="true"
              :aria-invalid="!isDateEmissionCertificatImmatriculationFniValid"
              aria-errormessage="date-emission-certificat-immatriculation-particulier-FNI-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.FNI_DATE_CERTIFICAT, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonFniDateEmissionCertificatImmatriculation"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver la date d'émission du certificat d'immatriculation sur le certificat d'immatriculation au format FNI"
                  @click="onOpenModalFniDateEmissionCertificatImmatriculation()"
                  @keydown.enter="onOpenModalFniDateEmissionCertificatImmatriculation()"
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
      class="background-default-white"
      panel-id="fni-tab-content-1"
      tab-id="fni-tab-1"
      :selected="fni.selectedTabIndex === 1"
      :asc="fni.tabsAsc"
    >
      <p class="fr-text--xs">
        {{ mentionChampObligatoire }}
      </p>
      <p class="fr-text--md  histovec-input-group-title">
        Titulaire
      </p>
      <div
        class="fr-grid-row  fr-grid-row--gutters"
      >
        <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
          <DsfrInputGroup
            :is-valid="isRaisonSocialeFniValid"
          >
            <DsfrInput
              id="form-fni-personne-morale-raison-sociale"
              v-model="formData.fni.titulaire.personneMorale.raisonSociale"
              label="Raison sociale"
              label-visible
              hint="Tel qu'indiqué sur le k&#8203;b&#8203;i&#8203;s&#8203;."
              required
              aria-required="true"
              :aria-invalid="!isRaisonSocialeFniValid"
              aria-errormessage="raison-sociale-personne-morale-FNI-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.FNI_RAISON_SOCIALE, $event)"
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
            :error-message="!isNumeroSirenFniValid?&quot;Le numéro S&#8203;I&#8203;R&#8203;E&#8203;N doit comporter 9 chiffres ou être vide. Format : 1&#8203;2&#8203;3&#8203;4&#8203;5&#8203;6&#8203;7&#8203;8&#8203;9.&quot;:&quot;&quot;"
            description-id="numero-siren-personne-morale-FNI-erreur-message"
          >
            <DsfrInput
              id="form-fni-personne-morale-numero-siren"
              v-model="formData.fni.titulaire.personneMorale.numeroSiren"
              label="Numéro S&#8203;I&#8203;R&#8203;E&#8203;N"
              label-visible
              hint="Tel qu'indiqué sur le k&#8203;b&#8203;i&#8203;s&#8203;. Format: 1&#8203;2&#8203;3&#8203;4&#8203;5&#8203;6&#8203;7&#8203;8&#8203;9 ou vide si vous n'en avez pas."
              :aria-invalid="!isNumeroSirenFniValid"
              aria-errormessage="numero-siren-personne-morale-FNI-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.FNI_SIREN, $event)"
            >
              <template #required-tip>
                <span
                  ref="buttonNumeroSiren"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le numéro de S&#8203;I&#8203;R&#8203;E&#8203;N de votre société ?"
                  @click="onOpenModalNumeroSiren()"
                  @keydown.enter="onOpenModalNumeroSiren()"
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
            description-id="numero-immatriculation-personne-morale-FNI-erreur-message"
          >
            <DsfrInput
              id="form-fni-personne-morale-numero-immatriculation"
              v-model="formData.fni.numeroImmatriculation"
              label="Numéro d'immatriculation"
              label-visible
              hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 123-ABC-45."
              required
              aria-required="true"
              :aria-invalid="!isNumeroImmatriculationFniValid"
              aria-errormessage="numero-immatriculation-personne-morale-FNI-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.FNI_IMMATRICULATION, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonFniNumeroImmatriculation"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le numéro d'immatriculation sur le certificat d'immatriculation au format FNI"
                  @click="onOpenModalFniNumeroImmatriculation()"
                  @keydown.enter="onOpenModalFniNumeroImmatriculation()"
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
            description-id="date-emission-certificat-immatriculation-personne-morale-FNI-erreur-message"
          >
            <DsfrInput
              id="form-fni-personne-morale-date-emission"
              v-model="formData.fni.dateEmissionCertificatImmatriculation"
              label="Date d'émission du certificat d'immatriculation"
              label-visible
              hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 31/12/2020."
              required
              aria-required="true"
              :aria-invalid="!isDateEmissionCertificatImmatriculationFniValid"
              aria-errormessage="date-emission-certificat-immatriculation-personne-morale-FNI-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.FNI_DATE_CERTIFICAT, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonFniDateEmissionCertificatImmatriculation"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver la date d'émission du certificat d'immatriculation sur le certificat d'immatriculation au format FNI"
                  @click="onOpenModalFniDateEmissionCertificatImmatriculation()"
                  @keydown.enter="onOpenModalFniDateEmissionCertificatImmatriculation()"
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
  </DsfrTabs>
</template>
<style scoped>
.histovec-input-group-title {
  font-weight: bold !important;
}

.required-label {
  color: var(--red-marianne-main-472);
}

.text-center {
  text-align: center;
}

.help-link {
  margin-left: 1rem;
  cursor: pointer;
}

.help-icon {
  margin-left: 0.2rem;
}

</style>
