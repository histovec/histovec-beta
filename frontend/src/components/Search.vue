<template>
  <div>
    <!-- breadcrumb start -->
    <div class="breadcrumb-container">
      <div class="container">
        <ol class="breadcrumb">
          <li>
            <i class="fa fa-home pr-10"></i>
            <router-link
              :to="{ name: 'home' }"
            >
              Accueil
            </router-link>
          </li>
          <li class="active">
            Recherche
          </li>
        </ol>
      </div>
    </div>
    <!-- breadcrumb end -->
    <!-- section -->
    <section class="main-container">
      <div class="container">
        <div class="row">
          <!-- section start -->
          <section
            class="dark-translucent-bg"
            :style="{ backgroundImage: `url('${imagePoigneeDeMain}')`, backgroundPosition: '50% 50%' }"
          >
            <div class="container">
              <div class="row justify-content-lg-center">
                <div class="col-lg-12">
                  <h2 class="text-center mt-4">
                    <span class="bold_6">Rassurez</span>
                    vos acheteurs potentiels
                  </h2>
                  <div class="separator with-icon">
                    <i class="fa fa-car bordered"></i>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <!-- section end -->
        </div>
      </div>
    </section>
    <!-- section -->
    <section class="main-container">
      <div class="container">
        <div class="row">
          <div
            v-if="typeImmatriculation === ''"
            class="col-md-12"
          >
            <div class="col-md-1"></div>
            <div class="col-md-12">
              <div
                class="alert alert-info alert-icon text-center"
                role="alert"
              >
                <i class="fa fa-info-circle"></i>
                HistoVec permet de consulter l'historique de votre véhicule établi à partir des données enregistrées dans le système d'immatriculation des véhicules (SIV).
              </div>
              <div
                class="alert alert-warning alert-icon text-center"
                role="alert"
              >
                <i class="fa fa-exclamation-triangle"></i>
                Toute demande de renseignements sur votre dossier ou de correction des informations doit être adressée à l'Agence nationale des titres sécurisés (ANTS).
              </div>
            </div>
          </div>

          <div
            class="col-md-12"
          >
            <div
              class="text-center"
              role="alert"
            >
              <h4 class="title p-b-25">
                Veuillez sélectionner le format d'immatriculation de votre véhicule
              </h4>
            </div>
          </div>
          <div
            class="col-xs-12 col-xs-offset-0 col-sm-3 col-sm-offset-1"
          >
            <a
              class="clickable"
              title="Immatriculation depuis 2009"
              @click="typeImmatriculation = 'siv'"
            >
              <img
                class="img-responsive center-block"
                :class="{ 'opacity-plaque': typeImmatriculation && typeImmatriculation !== 'siv' }"
                :src="imagePlaqueImmatriculationDepuis2009"
                width="200"
                height="44"
              >
            </a>
          </div>
          <div
            class="col-xs-12 col-xs-offset-0 col-sm-4"
          >
            <a
              class="clickable"
              title="Immatriculation avant 2009"
              @click="typeImmatriculation = 'fni'"
            >
              <img
                class="img-responsive center-block"
                :class="{ 'opacity-plaque': typeImmatriculation && typeImmatriculation !== 'fni' }"
                :src="imagePlaqueImmatriculationAvant2009"
                width="200"
                height="44"
              >
            </a>
          </div>
          <div
            class="col-xs-12 col-xs-offset-0 col-sm-3"
          >
            <a
              class="clickable"
              title="Immatriculation avant 1995"
              @click="typeImmatriculation = 'old'"
            >
              <img
                class="img-responsive center-block"
                :class="{ 'opacity-plaque': typeImmatriculation && typeImmatriculation !== 'old' }"
                :src="imagePlaqueImmatriculationAvant1995"
                width="200"
                height="44"
              >
            </a>
          </div>
        </div>
        <div
          v-if="typeImmatriculation === 'old'"
          class="row"
        >
          <div class="col-md-10 col-md-offset-1">
            <div
              class="alert alert-info text-center"
              role="alert"
            >
              <p>
                L'historique de ce véhicule n'est pas disponible sur HistoVec à ce jour.
              </p>
              <p>
                Nous vous invitons à télécharger le certificat de situation administrative détaillé (CSA) sur le site de l'ANTS.
              </p>
            </div>
            <div class="col-xs-8 col-xs-offset-2 col-sm-4 col-sm-offset-4">
              <a
                class="btn btn-default btn-m center-block m-h-05"
                href="https://siv.interieur.gouv.fr/map-usg-ui/do/csa_retour_dem_certificat"
              >
                Obtenir le CSA via l'ANTS
              </a>
            </div>
          </div>
        </div>
        <div
          v-if="typeImmatriculation === 'siv' || typeImmatriculation === 'fni'"
          class="col-md-12 col-xs-12 p-h-25"
        >
          <!-- tabs start -->
          <!-- ================ -->
          <!-- Nav tabs -->
          <ul
            class="nav nav-tabs style-2 nav-justified"
            role="tablist"
          >
            <li :class="[{'in active' : typePersonne === 'particulier'}]">
              <a
                class="clickable"
                @click="typePersonne = 'particulier'"
              >
                <i class="fa fa-user pr-10"></i>
                Particulier
              </a>
            </li>
            <li :class="[{'in active' : typePersonne === 'pro'}]">
              <a
                class="clickable"
                @click="typePersonne = 'pro'"
              >
                <i class="fa fa-building-o pr-10"></i>
                Personne morale
              </a>
            </li>
          </ul>
          <!-- Tab panes -->
          <div class="tab-content">
            <div
              id="h2tab1"
              class="tab-pane in active"
            >
              <div class="row">
                <div class="col-md-12">
                  <span
                    v-if="(status == 'failed') && (!checkFields)"
                    class="info_red txt-small-11"
                  >
                    * Veuillez renseignez les champs obligatoires
                  </span>
                  <fieldset>
                    <legend>
                      <span class="color-default">Titulaire</span>
                    </legend>
                    <form role="form">
                      <div
                        v-if="typePersonne === 'particulier'"
                        class="row"
                      >
                        <div
                          :class="{
                            'col-md-6': typeImmatriculation === 'siv',
                            'col-md-12' : typeImmatriculation === 'fni'
                          }"
                        >
                          <div
                            class="form-group has-feedback"
                            :class="[{'has-error' : (nom === '' && status !== 'init')}]"
                          >
                            <label
                              v-if="typeImmatriculation === 'siv'"
                              class="control-label"
                            >
                              Nom de naissance
                              <span
                                class="info_red"
                                title="Ce champ est requis."
                              >
                                *
                              </span>
                            </label>
                            <a
                              v-if="typeImmatriculation === 'siv'"
                              class="clickable text-info btn-sm-link"
                              @click="nomsModal = true"
                            >
                              Où le trouver
                              <i class="fa fa-info-circle fa-lg"></i>
                            </a>
                            <label
                              v-if="typeImmatriculation === 'fni'"
                              class="control-label"
                            >
                              Nom(s) et Prénom(s)
                              <span
                                class="info_red"
                                title="Ce champ est requis."
                              >
                                *
                              </span>
                            </label>
                            <a
                              v-if="typeImmatriculation === 'fni'"
                              class="clickable text-info btn-sm-link"
                              @click="nomsPrenomsModal = true"
                            >
                              Où les trouver
                              <i class="fa fa-info-circle fa-lg"></i>
                            </a>
                            <input
                              id="lastname"
                              ref="nom"
                              v-model="nom"
                              v-focus
                              name="nom"
                              required="required"
                              type="text"
                              class="form-control"
                              tabindex="1"
                              @input="nom = $event.target.value.replace(/\t.*/,'')"
                              @paste="onPaste"
                            >
                            <i class="fa fa-user form-control-feedback">
                            </i>
                          </div>
                        </div>
                        <div
                          v-if="typeImmatriculation === 'siv'"
                          class="col-md-6"
                        >
                          <div
                            class="form-group has-feedback"
                            :class="[{'has-error' : (prenom === '' && status !== 'init')}]"
                          >
                            <label class="control-label">
                              Prénom(s)
                              <span
                                class="info_red"
                                title="Ce champ est requis."
                              >
                                *
                              </span>
                            </label>
                            <a
                              class="clickable text-info btn-sm-link"
                              @click="prenomsModal = true"
                            >
                              Où le trouver
                              <i class="fa fa-info-circle fa-lg"></i>
                            </a>
                            <input
                              id="firstname"
                              v-model="prenom"
                              type="text"
                              required="required"
                              class="form-control"
                              tabindex="2"
                            >
                            <i class="fa fa-user form-control-feedback"></i>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="typePersonne === 'pro'"
                        class="row"
                      >
                        <div class="col-md-7">
                          <div
                            class="form-group has-feedback"
                            :class="[{'has-error' : (raisonSociale === '' && status !== 'init')}]"
                          >
                            <label class="control-label">
                              Raison sociale
                              <span
                                class="info_red"
                                title="Ce champ est requis."
                              >
                                *
                              </span>
                            </label>
                            <input
                              id="organization"
                              v-model="raisonSociale"
                              name="raisonSociale"
                              type="text"
                              required="required"
                              class="form-control"
                              tabindex="1"
                              @input="raisonSociale = $event.target.value.replace(/\t.*/,'')"
                              @paste="onPaste"
                            >
                            <i class="fa fa-user form-control-feedback raison-sociale"></i>
                          </div>
                        </div>
                        <div class="col-md-5">
                          <field
                            :active="status !== 'init'"
                            form-id="siren"
                            :option="typeImmatriculation"
                          >
                            <a
                              slot="link"
                              class="clickable text-info btn-sm-link"
                              @click="sirenModal = true"
                            >
                              Où le trouver?
                              <i class="fa fa-info-circle fa-lg"></i>
                            </a>
                          </field>
                        </div>
                      </div>
                    </form>
                  </fieldset>
                  <fieldset>
                    <legend><span class="color-default">Carte grise</span></legend>
                    <form role="form">
                      <div class="row">
                        <div class="col-md-6">
                          <field
                            :active="status !== 'init'"
                            form-id="plaque"
                            :option="typeImmatriculation"
                          >
                            <a
                              v-if="typeImmatriculation === 'siv'"
                              slot="link"
                              class="clickable text-info btn-sm-link"
                              @click="plaqueImmatriculationSIVModal = true"
                            >
                              Où la trouver
                              <i class="fa fa-info-circle fa-lg"></i>
                            </a>
                            <a
                              v-if="typeImmatriculation === 'fni'"
                              slot="link"
                              class="clickable text-info btn-sm-link"
                              @click="plaqueImmatriculationFNIModal = true"
                            >
                              Où la trouver
                              <i class="fa fa-info-circle fa-lg"></i>
                            </a>
                          </field>
                        </div>
                        <div class="col-md-6">
                          <div
                            class="form-group has-feedback plan position_left"
                            :class="[{'has-error' : ((!checkFormule && !checkDateCertificat) && status !== 'init')}]"
                          >
                            <div v-if="typeImmatriculation === 'siv'">
                              <label
                                for="input"
                                class="control-label"
                              >
                                N° de formule
                                <span
                                  class="info_red"
                                  title="Ce champ est requis."
                                >
                                  *
                                </span>
                              </label>
                              <a
                                class="clickable text-info btn-sm-link"
                                @click="numeroFormuleModal = true"
                              >
                                Où le trouver
                                <i class="fa fa-info-circle fa-lg"></i>
                              </a>
                              <input
                                id="formule"
                                v-model="formule"
                                v-mask="'####AA#####'"
                                type="text"
                                required="required"
                                class="form-control"
                                placeholder="2013BZ80335"
                                tabindex="5"
                              >
                              <i class="fa fa-pencil-square-o form-control-feedback numero-formule"></i>
                            </div>
                            <div v-if="typeImmatriculation === 'fni'">
                              <label
                                for="input"
                                class="control-label"
                              >
                                Date du certificat d'immatriculation
                                <span
                                  class="info_red"
                                  title="Ce champ est requis."
                                >
                                  *
                                </span>
                              </label>
                              <a
                                class="clickable text-info btn-sm-link"
                                @click="dateImmatriculationModal = true"
                              >
                                Où la trouver
                                <i class="fa fa-info-circle fa-lg"></i>
                              </a>
                              <input
                                id="dateCertificat"
                                v-model="dateCertificat"
                                v-mask="'##/##/####'"
                                type="text"
                                required="required"
                                class="form-control"
                                placeholder="xx/xx/xxxx"
                                tabindex="5"
                              >
                              <i class="fa fa-calendar form-control-feedback"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </fieldset>
                  <div class="form-group">
                    <div class="row">
                      <div class="col-sm-3">
                      </div>
                      <div class="col-sm-2">
                        <button
                          class="btn btn-animated btn-default btn-sm btn-block"
                          tabindex="6"
                          @click="onSubmit"
                        >
                          <i
                            class="fa"
                            :class="[
                              {'fa-search' : (status === 'init')},
                              {'fa-spin fa-spinner' : (status === 'posting')},
                              {'fa-exclamation-triangle' : (status === 'failed')}
                            ]"
                          >
                          </i>
                          Rechercher
                        </button>
                      </div>
                      <div class="col-sm-2">
                        <button
                          class="btn btn-animated btn-default btn-sm btn-block"
                          @click="clearAll()"
                        >
                          Effacer
                          <i class="fa fa-close"></i>
                        </button>
                      </div>
                      <div class="col-sm-2">
                        <router-link
                          class="btn btn-animated btn-default btn-sm btn-block"
                          :to="{ name: 'faq', hash:'#comment-retrouver-mon-vehicule' }"
                        >
                          <i class="fa fa-life-ring"></i>
                          Besoin d'aide
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- tabs end -->
      </div>
    </section>
    <!-- section end -->
    <div class="container">
      <div class="row">
      </div>
    </div>
    <!-- debut modals -->
    <modal-helper
      v-if="nomsPrenomsModal"
      @close="nomsPrenomsModal = false"
    >
      <span slot="title">Information nom(s) et prénom(s)</span>
      <img
        slot="body"
        alt="Indication localisation nom(s) et prénom(s) : sous le numéro d'immatriculation"
        :src="imageNomsPrenomsFNI"
        class="img-responsive"
        style="margin: 0 auto;"
        width="290px"
      >
    </modal-helper>

    <modal-helper
      v-if="plaqueImmatriculationFNIModal"
      @close="plaqueImmatriculationFNIModal = false"
    >
      <span slot="title">Information plaque d'immatriculation</span>
      <img
        slot="body"
        alt="Indication localisation plaque d'immatriculation : au dessus du nom et prénom"
        :src="imagePlaqueImmatriculationFNI"
        class="img-responsive"
        style="margin: 0 auto;"
        width="290px"
      >
    </modal-helper>

    <modal-helper
      v-if="dateImmatriculationModal"
      @close="dateImmatriculationModal = false"
    >
      <span slot="title">
        Information date du certificat d'immatriculation
      </span>
      <img
        slot="body"
        alt="Indication localisation date du certificat d'immatriculation : à droite du numéro d'immatriculation"
        :src="imageDateImmatriculationFNI"
        class="img-responsive"
        style="margin: 0 auto;"
        width="290px"
      >
    </modal-helper>

    <modal-helper
      v-if="nomsModal"
      @close="nomsModal = false"
    >
      <span slot="title">Information nom(s)</span>
      <img
        slot="body"
        alt="Indication localisation nom(s) : au dessus du prénom"
        :src="imageNomsSIV"
        class="img-responsive"
        style="margin: 0 auto;"
        width="350px"
      >
    </modal-helper>

    <modal-helper
      v-if="prenomsModal"
      @close="prenomsModal = false"
    >
      <span slot="title">Information prenom(s)</span>
      <img
        slot="body"
        alt="Indication localisation prenom(s) : en dessous du nom"
        :src="imagePrenomsSIV"
        class="img-responsive"
        style="margin: 0 auto;"
        width="350px"
      >
    </modal-helper>

    <modal-helper
      v-if="plaqueImmatriculationSIVModal"
      @close="plaqueImmatriculationSIVModal = false"
    >
      <span slot="title">Information plaque d'immatriculation</span>
      <img
        slot="body"
        alt="Indication localisation plaque d'immatriculation : au dessus du numéro de formule"
        :src="imagePlaqueImmatriculationSIV"
        class="img-responsive"
        style="margin: 0 auto;"
        width="350px"
      >
    </modal-helper>

    <modal-helper
      v-if="numeroFormuleModal"
      @close="numeroFormuleModal = false"
    >
      <span slot="title">Information n° de formule</span>
      <img
        slot="body"
        alt="Indication localisation numéro de formule : sous la plaque d'immatriculation ou dans la bande MRZ ou sur la première page de la carte grise"
        :src="imageNumeroFormuleSIV"
        class="img-responsive"
        style="margin: 0 auto;"
      >
    </modal-helper>

    <modal-helper
      v-if="sirenModal"
      @close="sirenModal = false"
    >
      <span slot="title">Où trouver le numéro SIREN</span>
      <div slot="body">
        <p>
          Le numéro SIREN correspond au 9 premiers caractères du numéro SIRET de votre société.
        </p>
        <p>
          Il figure sur le <b>KBIS</b> de votre société.
          Vous pouvez aussi l'obtenir sur ce
          <a
            href="https://www.societe.com/"
            target="_blank"
          >
            site
            <i class="fa fa-external-link"></i>
          </a>
          en effectuant une <b>recherche avec le nom de votre société</b>.
        </p>
        <p>
          En tant qu'association ou collectivité locale, il se peut que vous n'ayez <b>pas de numéro de SIREN</b>.
          <br>
          Dans ce cas, <b>laissez le champs SIREN vide</b>.
        </p>
      </div>
    </modal-helper>

    <!-- fin modals -->
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import Shake from 'shake.js'
import dayjs from 'dayjs'
import ModalHelper from './infos/ModalHelper.vue'
import Field from './forms/Field.vue'
import imageDateImmatriculationFNI from '@/assets/img/aide_fni_date_immatriculation.png'
import imageNomsPrenomsFNI from '@/assets/img/aide_fni_noms_prenoms.png'
import imagePlaqueImmatriculationFNI from '@/assets/img/aide_fni_plaque_immatriculation.png'
import imageNomsSIV from '@/assets/img/aide_siv_noms.png'
import imageNumeroFormuleSIV from '@/assets/img/aide_siv_numero_formule.png'
import imagePlaqueImmatriculationSIV from '@/assets/img/aide_siv_plaque_immatriculation.png'
import imagePrenomsSIV from '@/assets/img/aide_siv_prenoms.png'
import imagePlaqueImmatriculationAvant1995 from '@/assets/img/plaque_immatriculation_avant_1995.png'
import imagePlaqueImmatriculationAvant2009 from '@/assets/img/plaque_immatriculation_avant_2009.png'
import imagePlaqueImmatriculationDepuis2009 from '@/assets/img/plaque_immatriculation_depuis_2009.png'
import imagePoigneeDeMain from '@/assets/img/poignee_de_main.jpg'


const formInitialOptions = {
  default: {
    required: true,
    requiredTitle: 'Ce champ est requis.',
    maskTitle: 'désactiver le contrôle',
    maskTitleAlt: 'ré-activer le contrôle',
    type: 'text'
  },
  siren: {
    siv: {
      fieldNumberPro: 2,
      fieldNumberParticulier: 2,
      label: 'N° SIREN',
      model: 'siren',
      masked: true,
      mask: '#########',
      check: /^(\d{9})$/,
      placeholder: '123456789 ou vide si vous n\'en avez pas',
      icon: 'fa fa-hashtag',
      tabindex: '2',
      required: false,
      defaultValue: '000000000'
    },
    fni: {
      fieldNumberPro: 2,
      fieldNumberParticulier: 2,
      label: 'N° SIREN',
      model: 'siren',
      masked: true,
      mask: '#########',
      check: /^[0-9]{9}$/,
      placeholder: '123456789 ou vide si vous n\'en avez pas',
      icon: 'fa fa-hashtag',
      tabindex: '2',
      required: false,
      defaultValue: '000000000'
    }
  },
  plaque: {
    siv: {
      fieldNumberPro: 3,
      fieldNumberParticulier: 3,
      label: 'Plaque d\'immatriculation',
      model: 'plaque',
      masked: true,
      mask: 'plaqueSiv',
      maskAlt: 'XXXXXXX',
      maskTitle: 'désactiver le contrôle pour les plaques particulières',
      check: /^[a-zA-Z]{1,2}(-|\s+)?[0-9]{2,3}(-|\s+)?[a-zA-Z]{1,2}$/,
      placeholder: 'AA-123-AA',
      placeholderAlt: 'AA123AA ou A123A ou AA123A',
      icon: 'fa fa-drivers-license-o',
      tabindex: '4'
    },
    fni: {
      fieldNumberPro: 3,
      fieldNumberParticulier: 2,
      label: 'Plaque d\'immatriculation',
      model: 'plaque',
      masked: true,
      mask: 'plaqueFni',
      maskAlt: 'XXXXXXXX',
      maskTitle: 'désactiver le contrôle pour les plaques particulières',
      check: /^\s*[0-9]{2,4}(-|\s+)?[a-zA-Z]{2,3}(-|\s+)?([0-9]{2,3}|2A|2B)\s*$/,
      placeholder: '123 ABC 45',
      placeholderAlt: '1234ABC45 ou 123ABC45 ou 12ABC45 ou 12AB45',
      icon: 'fa fa-drivers-license-o',
      tabindex: '4'
    }
  }
}

export default {
  components: {
    ModalHelper,
    Field
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  data () {
    return {
      // modals FNI
      nomsPrenomsModal: false,
      plaqueImmatriculationFNIModal: false,
      dateImmatriculationModal: false,

      // modals SIV
      nomsModal: false,
      prenomsModal: false,
      plaqueImmatriculationSIVModal: false,
      numeroFormuleModal: false,

      // modals entreprises
      sirenModal: false,

      // images
      imageNomsPrenomsFNI,
      imagePlaqueImmatriculationFNI,
      imageDateImmatriculationFNI,
      imageNomsSIV,
      imagePrenomsSIV,
      imagePlaqueImmatriculationSIV,
      imageNumeroFormuleSIV,
      imagePlaqueImmatriculationAvant1995,
      imagePlaqueImmatriculationAvant2009,
      imagePlaqueImmatriculationDepuis2009,
      imagePoigneeDeMain,

      status: 'init',
    }
  },
  computed: {
    formOptions: {
      get () {
        return this.$store.state.identity.formOptions
      },
      set (value) {
        this.$store.commit('initFormOptions', value)
      }
    },
    nom: {
      get () {
        return this.$store.state.identity.nom
      },
      set (value) {
        this.$store.commit('updateNom', value)
      }
    },
    prenom: {
      get () {
        return this.$store.state.identity.prenom
      },
      set (value) {
        this.$store.commit('updatePrenom', value)
      }
    },
    raisonSociale: {
      get () {
        return this.$store.state.identity.raisonSociale
      },
      set (value) {
        this.$store.commit('updateRaisonSociale', value)
      }
    },
    siren: {
      get () {
        return this.$store.state.identity.siren
      },
      set (value) {
        this.$store.commit('updateSiren', value)
      }
    },
    plaque: {
      get () {
        return this.$store.state.identity.plaque
      },
      set (value) {
        this.$store.commit('updatePlaque', value)
      }
    },
    formule: {
      get () {
        return this.$store.state.identity.formule
      },
      set (value) {
        this.$store.commit('updateFormule', value)
      }
    },
    typePersonne: {
      get () {
        return this.$store.state.identity.typePersonne
      },
      set (value) {
        this.$store.commit('updateTypePersonne', value)
      }
    },
    typeImmatriculation: {
      get () {
        return this.$store.state.identity.typeImmatriculation
      },
      set (value) {
        this.$store.commit('updateTypeImmatriculation', value)
      }
    },
    dateCertificat: {
      get () {
        return this.$store.state.identity.dateCertificat
      },
      set (value) {
        this.$store.commit('updateDateCertificat', value)
      }
    },
    checkDateCertificat () {
      return this.dateCertificat.match(/^[0-3][0-9](\/|-|\s+)?[0-1][0-9](\/|-|\s+)?[1-2][0-9]{3}$/)
    },
    checkPlaque () {
      if (this.typeImmatriculation === 'fni') {
        return this.plaque.match(/^\s*[0-9]{2,4}(-|\s+)?[a-zA-Z]{2,3}(-|\s+)?([0-9]{2,3}|2A|2B)\s*$/)
      } else {
        return this.plaque.match(/^[a-zA-Z]{1,2}(-|\s+)?[0-9]{2,3}(-|\s+)?[a-zA-Z]{1,2}$/)
      }
    },
    checkFormule () {
      return this.formule.match(/^(\d{2,4}[a-zA-Z]{2}\d{5})$/)
    },
    checkSiren () {
      return !this.siren || this.siren.match(/^\d{9}$/)
    },
    checkFields () {
      return ((this.nom && (this.prenom || this.typeImmatriculation === 'fni')) || (this.raisonSociale && this.checkSiren)) && this.checkPlaque && (this.checkFormule || this.checkDateCertificat)
    },
    currentMonthNumber () {
      var date = new Date()
      date = dayjs().add(-7, 'day').format('YYYYMM')
      return date
    },
    personneId () {
      if (this.typePersonne === 'particulier') {
        return this.nom + (this.typeImmatriculation === 'siv' ? this.prenom : '')
      } else {
        return this.raisonSociale + this.siren
      }
    },
    vehicleId () {
      if (this.typeImmatriculation === 'siv') {
        return this.plaque + this.formule
      } else {
        return this.plaque + this.dateCertificat
      }
    },
    id () {
      return this.hash(this.personneId + this.vehicleId + this.currentMonthNumber)
    },
    key () {
      return this.hash(this.vehicleId)
    }
  },
  created () {
    if (this.typeImmatriculation === undefined) {
      this.typeImmatriculation = 'siv'
    }
    if (this.formOptions === undefined) {
      this.formOptions = formInitialOptions
    }

    this.$store.dispatch('log', this.$route.path)
    let myShakeEvent = new Shake({
      threshold: 15,
      timeout: 1000
    })
    myShakeEvent.start()
    window.addEventListener('shake', () => { this.active = true }, false)
    if (!window.location.host.match(/(histovec.fr|.gouv.fr$)/)) {
      this.active = true
    }
    this.typePersonne = this.$store.state.identity.typePersonne || this.$route.params.t || 'particulier'
  },
  mounted() {
    // reset 'MonAvis' evaluation for each new search (notShow option will override it)
    localStorage.setItem('evaluation', false)
    this.cleanDefaultFields()
  },
  updated () {
    this.cleanDefaultFields()
  },
  methods: {
    defaultEmtpyFields () {
      for (let [field, options] of Object.entries(this.formOptions)) {
        ['siv', 'fni'].forEach((typeImmat) => {
          if (field !== 'default' && this.typeImmatriculation === typeImmat) {
            const specificOptions = options[typeImmat]
            if (
              (specificOptions.required === false ||
                (specificOptions.required === undefined && this.formOptions.default === false)
              ) && this[field] === ''
            ) {
              this[field] = specificOptions.defaultValue
            }
          }
        })
      }
    },
    cleanDefaultFields () {
      for (let [field, options] of Object.entries(this.formOptions)) {
        ['siv', 'fni'].forEach((typeImmat) => {
          if (field !== 'default' && this.typeImmatriculation === typeImmat) {
            const specificOptions = options[typeImmat]
            if (specificOptions.required === false || (specificOptions.required === undefined && this.formOptions.default === false)) {
              if (this[field] === specificOptions.defaultValue) {
                // @note: <Field> is to complexe and should be rewrited
                // All fields are text field, so we use empty string as clean value
                // instead of adding complexity to <Field>
                this[field] = ''
              }
            }
          }
        })
      }
    },
    onPaste (evt) {
      const data = evt.clipboardData.getData('Text').replace(/\s*$/, '').split(/\t+/)

      if (data.length > 1) {
        if (evt.target.name === 'nom') {
          if (this.typeImmatriculation === 'siv') {
            // 1st element has already been pasted on current target name : 'nom'
            // It is equivalent to :
            // this.nom = data[0]
            this.prenom = data[1]
            this.plaque = data[2]
            this.formule = data[3]
          }
          if (this.typeImmatriculation === 'fni') {
            // 1st element has already been pasted on current target name : 'nom'
            // It is equivalent to :
            // this.nom = data[0]
            this.plaque = data[1]
            this.dateCertificat = data[2]
          }
        }
        if (evt.target.name === 'raisonSociale') {
          // 1st element has already been pasted on current target name : 'raisonSociale'
          // It is equivalent to :
          // this.raisonSociale = data[0]
          this.siren = data[1]
          this.plaque = data[2]
          if (this.typeImmatriculation === 'siv') {
            this.formule = data[3]
          }
          if (this.typeImmatriculation === 'fni') {
            this.dateCertificat = data[3]
          }
        }
      }
    },
    async clearReports () {
      await this.$store.commit('clearSIV')
      await this.$store.commit('clearUTAC')
    },
    async clearAll () {
      await this.$store.commit('clearIdentity')
      this.clearReports()
    },
    normalize (string) {
      try {
        return string.normalize('NFD')
      } catch (e) {
        return string.replace(/[\u0300-\u036f]*/g, '')
      }
    },
    hash (string) {
      var hash = string
      hash = this.normalize(hash).toLowerCase().replace(/[^0-9a-z]/g, '')
      hash = CryptoJS.SHA256(hash).toString(CryptoJS.enc.Base64)
      hash = hash.replace(/\+/g, '-').replace(/\//g, '_')
      return hash
    },
    async onSubmit () {
      this.status = 'posting'
      this.defaultEmtpyFields()

      if (this.checkFields) {
        if (this.id !== this.$store.state.siv.id) {
          this.clearReports()
        }
        this.$router.push({name: 'report', params: {id: this.id, key: this.key, typeImmatriculation: this.typeImmatriculation}})
      } else {
        this.status = 'failed'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
