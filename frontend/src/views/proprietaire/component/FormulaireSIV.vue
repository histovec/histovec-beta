<script>
/* eslint-disable vue/no-mutating-props */
import {defineComponent} from 'vue'
import LoaderComponent from '@Components/LoaderComponent.vue';

import { sleep } from '@Utils/sleep';

import { useRapportStore } from '@Stores/rapport'
import { mentionChampObligatoire } from '@Constants/proprietaireConstantes'
import { CHAMP_MODIFIE, collerPressePapierEtDistribuerDansFormulaire } from '@Utils/collerPressePapierEtDistribuerDansFormulaire.js'
import { NUMERO_FORMULE_REGEX, NUMERO_IMMATRICULATION_SIV_REGEX, NUMERO_SIREN_REGEX } from '@Constants/regex.js'
import { TYPE_PERSONNE } from '@Constants/type.js'
import { modalesTemplates } from '@Views/proprietaire/component/contenuModales'

export default defineComponent({
  name: 'FormulaireSIV',

  components:{
    LoaderComponent,
  },

  props:{
    formData: {
      type: Object,
      default: null,
    },
    actionModale: {
      type: Function,
      default: null,
    },
  },
  data () {
    const tabSivTitles = [{ title: 'Particulier', panelId: 'siv-tab-content-0', tabId:'siv-tab-0'}, { title: 'Personne morale', panelId: 'siv-tab-content-1', tabId:'siv-tab-1'}]
    return {
      store: useRapportStore(),
      tabSivTitles,
      mentionChampObligatoire,
      collerPressePapierEtDistribuerDansFormulaire: collerPressePapierEtDistribuerDansFormulaire,
      CHAMP_MODIFIE: CHAMP_MODIFIE,
      siv: {
        selectedTabIndex: 0,
        tabsAsc: true,
      },
      modalesTemplates,
    }
  },
  computed: {
    isNomSivValid() {
      return this.formData.siv.titulaire.particulier.nom.length > 0
    },
    isPrenomsSivValid() {
      return this.formData.siv.titulaire.particulier.prenoms.length > 0
    },
    isRaisonSocialeSivValid() {
      return this.formData.siv.titulaire.personneMorale.raisonSociale.length > 0
    },
    isNumeroSirenSivValid() {
      return (
        !this.formData.siv.titulaire.personneMorale.numeroSiren ||
        this.formData.siv.titulaire.personneMorale.numeroSiren.match(NUMERO_SIREN_REGEX)
      )
    },
    isNumeroImmatriculationSivValid() {
      return this.formData.siv.numeroImmatriculation.match(NUMERO_IMMATRICULATION_SIV_REGEX)
    },
    isNumeroFormuleSivValid() {
      return this.formData.siv.numeroFormule.match(NUMERO_FORMULE_REGEX)
    },

    // ----- Error messages -----

    numeroImmatriculationSivErrorMessage() {
      return (
        this.formData.siv.numeroImmatriculation && !this.isNumeroImmatriculationSivValid ?
          'Le numéro d\'immatriculation doit respecter le format "AA-123-AA" ou "AA 123 AA" ou "AA123AA".' :
          ''
      )
    },
    numeroFormuleSivErrorMessage() {
      return (
        this.formData.siv.numeroFormule && !this.isNumeroFormuleSivValid ?
          'Le numéro de formule doit respecter le format "2013BZ80335".' :
          ''
      )
    },
  },

  watch: {
    'siv.selectedTabIndex': function (val) {
      sleep(300).then(() => {
        if (val === 0) {
          document.getElementById('form-siv-particulier-nom-naissance').focus()
        }
        if (val === 1) {
          document.getElementById('form-siv-personne-morale-raison-sociale').focus()
        }
      })
    },
  },
  methods:{
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
    selectSivTab(idx) {
      this.onSelectTab(idx)
      this.asc = this.siv.selectedTabIndex < idx
      this.siv.selectedTabIndex = idx
    },
  },
})
</script>

<template>
  <DsfrTabs
    tab-list-name="Liste d'onglets pour un véhicule avec un numéro d'immatriculation au format S&#8203;I&#8203;V"
    :tab-titles="tabSivTitles"
    @select-tab="selectSivTab"
  >
    <LoaderComponent
      v-if="store.getChargement"
      taille="md"
    />
    <DsfrTabContent
      class="background-default-white"
      panel-id="siv-tab-content-0"
      tab-id="siv-tab-0"
      :selected="siv.selectedTabIndex === 0"
      :asc="siv.tabsAsc"
    >
      <p class="fr-text--xs">
        {{ mentionChampObligatoire }}
      </p>
      <p class="fr-text--md  histovec-input-group-title">
        Titulaire
      </p>
      <div class="fr-grid-row  fr-grid-row--gutters ">
        <div class="fr-col-12  fr-col-lg-6  fr-col-xl-6">
          <DsfrInputGroup
            :is-valid="isNomSivValid"
            description-id="nom-particulier-SIV-erreur-message"
          >
            <DsfrInput
              id="form-siv-particulier-nom-naissance"
              v-model="formData.siv.titulaire.particulier.nom"
              label="Nom de naissance"
              label-visible
              autocomplete="family-name"
              hint="Tel qu'indiqué sur le certificat d'immatriculation."
              required
              aria-required="true"
              :aria-invalid="!isNomSivValid"
              aria-errormessage="nom-particulier-SIV-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.SIV_NOM, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonSivNom"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le nom sur le certificat d'immatriculation au format S&#8203;I&#8203;V"
                  @click="actionModale(modalesTemplates.nom.libelle)"
                  @keydown.enter="actionModale(modalesTemplates.nom.libelle)"
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
          >
            <DsfrInput
              id="form-siv-particulier-prenom"
              v-model="formData.siv.titulaire.particulier.prenoms"
              label="Prénom(s)"
              label-visible
              autocomplete="given-name"
              hint="Tel(s) qu'indiqué(s) sur le certificat d'immatriculation."
              required
              aria-required="true"
              :aria-invalid="!isPrenomsSivValid"
              aria-errormessage="prenom-particulier-SIV-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.SIV_PRENOM, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonSivPrenoms"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le(s) prénom(s) sur le certificat d'immatriculation au format S&#8203;I&#8203;V"
                  @click="actionModale(modalesTemplates.prenom.libelle)"
                  @keydown.enter="actionModale(modalesTemplates.prenom.libelle)"
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
            description-id="numero-immatriculation-particulier-SIV-erreur-message"
          >
            <DsfrInput
              id="form-siv-particulier-numero-immatriculation"
              v-model="formData.siv.numeroImmatriculation"
              label="Numéro d'immatriculation"
              label-visible
              hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : AA-123-AA."
              required
              aria-required="true"
              :aria-invalid="!isNumeroImmatriculationSivValid"
              aria-errormessage="numero-immatriculation-particulier-SIV-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.SIV_IMMATRICULATION, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonSivNumeroImmatriculation"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le numéro d'immatriculation sur le certificat d'immatriculation au format S&#8203;I&#8203;V"
                  @click="actionModale(modalesTemplates.sivNumeroImmatriculation.libelle)"
                  @keydown.enter="actionModale(modalesTemplates.sivNumeroImmatriculation.libelle)"
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
            description-id="numero-formule-particulier-SIV-erreur-message"
          >
            <DsfrInput
              id="form-siv-particulier-numero-formule"
              v-model="formData.siv.numeroFormule"
              label="Numéro de formule"
              label-visible
              hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 2013BZ80335."
              required
              aria-required="true"
              :aria-invalid="!isNumeroFormuleSivValid"
              aria-errormessage="numero-formule-particulier-SIV-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.SIV_FORMULE, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonSivNumeroFormule"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le numéro de formule sur le certificat d'immatriculation au format S&#8203;I&#8203;V"
                  @click="actionModale(modalesTemplates.numeroFormule.libelle)"
                  @keydown.enter="actionModale(modalesTemplates.numeroFormule.libelle)"
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
      class="background-default-white"
      panel-id="siv-tab-content-1"
      tab-id="siv-tab-1"
      :selected="siv.selectedTabIndex === 1"
      :asc="siv.tabsAsc"
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
            :is-valid="isRaisonSocialeSivValid"
          >
            <DsfrInput
              id="form-siv-personne-morale-raison-sociale"
              v-model="formData.siv.titulaire.personneMorale.raisonSociale"
              label="Raison sociale"
              label-visible
              hint="Tel qu'indiqué sur le k&#8203;b&#8203;i&#8203;s&#8203;."
              required
              aria-required="true"
              :aria-invalid="!isRaisonSocialeSivValid"
              aria-errormessage="raison-sociale-personne-morale-SIV-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.SIV_RAISON_SOCIALE, $event)"
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
            :error-message="!isNumeroSirenSivValid?'Le numéro S&#8203;I&#8203;R&#8203;E&#8203;N doit comporter 9 chiffres ou être vide. Format : 1&#8203;2&#8203;3&#8203;4&#8203;5&#8203;6&#8203;7&#8203;8&#8203;9.':''"
            description-id="numero-siren-personne-morale-SIV-erreur-message"
          >
            <DsfrInput
              id="form-siv-personne-morale-numero-siren"
              v-model="formData.siv.titulaire.personneMorale.numeroSiren"
              label="Numéro S&#8203;I&#8203;R&#8203;E&#8203;N"
              label-visible
              hint="Tel qu'indiqué sur le k&#8203;b&#8203;i&#8203;s&#8203;. Format: 1&#8203;2&#8203;3&#8203;4&#8203;5&#8203;6&#8203;7&#8203;8&#8203;9 ou vide si vous n'en avez pas."
              :aria-invalid="!isNumeroSirenSivValid"
              aria-errormessage="numero-siren-personne-morale-SIV-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.SIV_SIREN, $event)"
            >
              <template #required-tip>
                <span
                  ref="buttonNumeroSiren"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le numéro de S&#8203;I&#8203;R&#8203;E&#8203;N de votre société ?"
                  @click="actionModale(modalesTemplates.numeroSiren.libelle)"
                  @keydown.enter="actionModale(modalesTemplates.numeroSiren.libelle)"
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
            description-id="numero-immatriculation-personne-morale-SIV-erreur-message"
          >
            <DsfrInput
              id="form-siv-personne-morale-numero-immatriculation"
              v-model="formData.siv.numeroImmatriculation"
              label="Numéro d'immatriculation"
              label-visible
              hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : AA-123-AA."
              required
              aria-required="true"
              :aria-invalid="!isNumeroImmatriculationSivValid"
              aria-errormessage="numero-immatriculation-personne-morale-SIV-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.SIV_IMMATRICULATION, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonSivNumeroImmatriculation"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le numéro d'immatriculation sur le certificat d'immatriculation au format S&#8203;I&#8203;V"
                  @click="actionModale(modalesTemplates.sivNumeroImmatriculation.libelle)"
                  @keydown.enter="actionModale(modalesTemplates.sivNumeroImmatriculation.libelle)"
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
            description-id="numero-formule-personne-morale-SIV-erreur-message"
          >
            <DsfrInput
              id="form-siv-personne-morale-numero-formule"
              v-model="formData.siv.numeroFormule"
              label="Numéro de formule"
              label-visible
              hint="Tel qu'indiqué sur le certificat d'immatriculation. Format : 2013BZ80335."
              required
              aria-required="true"
              :aria-invalid="!isNumeroFormuleSivValid"
              aria-errormessage="numero-formule-personne-morale-SIV-erreur-message"
              @paste="collerPressePapierEtDistribuerDansFormulaire(formData, CHAMP_MODIFIE.SIV_FORMULE, $event)"
            >
              <template #required-tip>
                <em class="required-label"> *</em>
                <span
                  ref="buttonSivNumeroFormule"
                  tabindex="0"
                  role="button"
                  class="fr-link  help-link"
                  title="Où trouver le numéro de formule sur le certificat d'immatriculation au format S&#8203;I&#8203;V"
                  @click="actionModale(modalesTemplates.numeroFormule.libelle)"
                  @keydown.enter="actionModale(modalesTemplates.numeroFormule.libelle)"
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
</template>
<style scoped>
.histovec-input-group-title {
  font-weight: bold !important;
}

.required-label {
  color: var(--red-marianne-main-472);
}

.help-link {
  margin-left: 1rem;
  cursor: pointer;
}

.help-icon {
  margin-left: 0.2rem;
}

</style>
