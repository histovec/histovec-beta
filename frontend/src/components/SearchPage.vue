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
              id="plaque-siv"
              class="clickable"
              title="Immatriculation depuis 2009"
              @click="typeImmatriculation = TYPE_IMMATRICULATION.SIV"
            >
              <img
                class="img-responsive center-block"
                :class="{ 'opacity-plaque': typeImmatriculation && typeImmatriculation !== TYPE_IMMATRICULATION.SIV }"
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
              id="plaque-fni"
              class="clickable"
              title="Immatriculation avant 2009"
              @click="typeImmatriculation = TYPE_IMMATRICULATION.FNI"
            >
              <img
                class="img-responsive center-block"
                :class="{ 'opacity-plaque': typeImmatriculation && typeImmatriculation !== TYPE_IMMATRICULATION.FNI }"
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
              @click="typeImmatriculation = OLD_IMMATRICULATION_TYPE"
            >
              <img
                class="img-responsive center-block"
                :class="{ 'opacity-plaque': typeImmatriculation && typeImmatriculation !== OLD_IMMATRICULATION_TYPE }"
                :src="imagePlaqueImmatriculationAvant1995"
                width="200"
                height="44"
              >
            </a>
          </div>
        </div>
        <div
          v-if="typeImmatriculation === OLD_IMMATRICULATION_TYPE"
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
                href="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
                rel="noopener noreferrer"
                target="_blank"
              >
                Obtenir le CSA via l'ANTS
              </a>
            </div>
          </div>
        </div>
        <div
          v-if="Object.values(TYPE_IMMATRICULATION).includes(typeImmatriculation)"
          class="col-md-12 col-xs-12 p-h-25"
        >
          <!-- tabs start -->
          <!-- ================ -->
          <!-- Nav tabs -->
          <ul
            class="nav nav-tabs style-2 nav-justified"
            role="tablist"
          >
            <li :class="[{'in active' : typePersonne === TYPE_PERSONNE.PARTICULIER}]">
              <a
                class="clickable"
                @click="typePersonne = TYPE_PERSONNE.PARTICULIER"
              >
                <i class="fa fa-user pr-10"></i>
                Particulier
              </a>
            </li>
            <li :class="[{'in active' : typePersonne === TYPE_PERSONNE.PRO}]">
              <a
                id="pro"
                class="clickable"
                @click="typePersonne = TYPE_PERSONNE.PRO"
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
                        v-if="typePersonne === TYPE_PERSONNE.PARTICULIER"
                        class="row"
                      >
                        <div
                          :class="{
                            'col-md-6': typeImmatriculation === TYPE_IMMATRICULATION.SIV,
                            'col-md-12' : typeImmatriculation === TYPE_IMMATRICULATION.FNI
                          }"
                        >
                          <div
                            class="form-group has-feedback"
                            :class="[{'has-error' : (nom === '' && status !== 'init')}]"
                          >
                            <label
                              v-if="typeImmatriculation === TYPE_IMMATRICULATION.SIV"
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
                              v-if="typeImmatriculation === TYPE_IMMATRICULATION.SIV"
                              class="clickable text-info btn-sm-link"
                              @click="nomsModal = true"
                            >
                              Où le trouver
                              <i class="fa fa-info-circle fa-lg"></i>
                            </a>
                            <label
                              v-if="typeImmatriculation === TYPE_IMMATRICULATION.FNI"
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
                              v-if="typeImmatriculation === TYPE_IMMATRICULATION.FNI"
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
                          v-if="typeImmatriculation === TYPE_IMMATRICULATION.SIV"
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
                        v-if="typePersonne === TYPE_PERSONNE.PRO"
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
                          <InputField
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
                          </InputField>
                        </div>
                      </div>
                    </form>
                  </fieldset>
                  <fieldset>
                    <legend><span class="color-default">Carte grise</span></legend>
                    <form role="form">
                      <div class="row">
                        <div class="col-md-6">
                          <InputField
                            :active="status !== 'init'"
                            form-id="plaque"
                            :option="typeImmatriculation"
                          >
                            <a
                              v-if="typeImmatriculation === TYPE_IMMATRICULATION.SIV"
                              slot="link"
                              class="clickable text-info btn-sm-link"
                              @click="plaqueImmatriculationSIVModal = true"
                            >
                              Où la trouver
                              <i class="fa fa-info-circle fa-lg"></i>
                            </a>
                            <a
                              v-if="typeImmatriculation === TYPE_IMMATRICULATION.FNI"
                              slot="link"
                              class="clickable text-info btn-sm-link"
                              @click="plaqueImmatriculationFNIModal = true"
                            >
                              Où la trouver
                              <i class="fa fa-info-circle fa-lg"></i>
                            </a>
                          </InputField>
                        </div>
                        <div class="col-md-6">
                          <div
                            class="form-group has-feedback plan position_left"
                            :class="[{'has-error' : ((!checkFormule && !checkDateCertificat) && status !== 'init')}]"
                          >
                            <div v-if="typeImmatriculation === TYPE_IMMATRICULATION.SIV">
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
                            <div v-if="typeImmatriculation === TYPE_IMMATRICULATION.FNI">
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
                          id="search"
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
            rel="noopener noreferrer"
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
import Shake from 'shake.js'
import dayjs from 'dayjs'

import { hash } from '@/utils/crypto.js'
import { base64Encode, urlSafeBase64Encode, base64Decode } from '@/utils/encoding.js'
import { normalizeIdvAsDataPreparation, normalizeKeyAsDataPreparation } from '@/utils/dataPreparationFormat.js'
import ModalHelper from './infos/ModalHelper.vue'
import InputField from './forms/InputField.vue'

import { OLD_IMMATRICULATION_TYPE, TYPE_IMMATRICULATION, TYPE_PERSONNE } from '../constants/type.js'
import { DEFAULT_NUMERO_SIREN }  from '../constants/vehicle/numeroSiren.js'

import imageDateImmatriculationFNI from '@/assets/img/aide_fni_date_immatriculation.jpg'
import imageNomsPrenomsFNI from '@/assets/img/aide_fni_noms_prenoms.jpg'
import imagePlaqueImmatriculationFNI from '@/assets/img/aide_fni_plaque_immatriculation.jpg'
import imageNomsSIV from '@/assets/img/aide_siv_noms.jpg'
import imageNumeroFormuleSIV from '@/assets/img/aide_siv_numero_formule.jpg'
import imagePlaqueImmatriculationSIV from '@/assets/img/aide_siv_plaque_immatriculation.jpg'
import imagePrenomsSIV from '@/assets/img/aide_siv_prenoms.jpg'
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
    type: 'text',
  },
  siren: {
    [TYPE_IMMATRICULATION.SIV]: {
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
      defaultValue: DEFAULT_SIREN,
    },
    [TYPE_IMMATRICULATION.FNI]: {
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
      defaultValue: DEFAULT_SIREN,
    },
  },
  plaque: {
    [TYPE_IMMATRICULATION.SIV]: {
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
      tabindex: '4',
    },
    [TYPE_IMMATRICULATION.FNI]: {
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
      tabindex: '4',
    },
  },
}

export default {
  components: {
    ModalHelper,
    InputField,
  },
  directives: {
    focus: {
      inserted: (el) => {
        el.focus()
      },
    },
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

      // constants
      OLD_IMMATRICULATION_TYPE,
      TYPE_IMMATRICULATION,
      TYPE_PERSONNE,

      status: 'init',
    }
  },
  computed: {

    checkDateCertificat () {
      return this.dateCertificat.match(/^[0-3][0-9](\/|-|\s+)?[0-1][0-9](\/|-|\s+)?[1-2][0-9]{3}$/)
    },
    checkPlaque () {
      if (this.typeImmatriculation === this.TYPE_IMMATRICULATION.FNI) {
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
      return ((this.nom && (this.prenom || this.typeImmatriculation === this.TYPE_IMMATRICULATION.FNI)) || (this.raisonSociale && this.checkSiren)) && this.checkPlaque && (this.checkFormule || this.checkDateCertificat)
    },
    currentMonthNumber () {
      let date = dayjs().add(-7, 'day')

      if (this.usePreviousMonthForData) {
          date = date.add(-this.previousMonthShift, 'month')
      }

      return date.format('YYYYMM')
    },
    personneId () {
      if (this.typePersonne === TYPE_PERSONNE.PARTICULIER) {
        return this.nom + (this.typeImmatriculation === this.TYPE_IMMATRICULATION.SIV ? this.prenom : '')
      } else {
        return this.raisonSociale + this.siren
      }
    },
    vehicleId () {
      if (this.typeImmatriculation === this.TYPE_IMMATRICULATION.SIV) {
        return this.plaque + this.formule
      } else {
        return this.plaque + this.dateCertificat
      }
    },
    id () {
      const id = `${this.personneId}${this.vehicleId}${this.currentMonthNumber}`
      return normalizeIdvAsDataPreparation(id)
    },
    key () {
      return normalizeKeyAsDataPreparation(this.vehicleId)
    },
  },
  created () {
    if (this.formOptions === undefined) {
      this.formOptions = formInitialOptions
    }

    this.$store.dispatch('log', this.$route.path)
    let myShakeEvent = new Shake({
      threshold: 15,
      timeout: 1000,
    })
    myShakeEvent.start()
    window.addEventListener('shake', () => { this.active = true }, false)
    if (!window.location.host.match(/(histovec.fr|.gouv.fr$)/)) {
      this.active = true
    }
    this.typePersonne = this.$store.state.identity.typePersonne || TYPE_PERSONNE.PARTICULIER
  },

  methods: {
    async onSubmit () {
      this.status = 'posting'
      this.defaultEmtpyFields()

      const hashedIdBuffer = await hash(this.id)
      const encodedHashedId = base64Encode(hashedIdBuffer)
      // @todo: remove these logs while transition done (8th day of the next month after 'HistoVec code partage' feature deployement)
      // eslint-disable-next-line no-console
      console.log(`[NEW] id base64Encoded = ${encodedHashedId}`)

      const urlSafeBase64EncodedId = urlSafeBase64Encode(base64Decode(encodedHashedId))
      // eslint-disable-next-line no-console
      console.log(`[OLD] id urlSafeBase64Encoded = ${urlSafeBase64EncodedId}`)

      // // eslint-disable-next-line no-console
      console.log(`[ID] are they different ? ${encodedHashedId !== urlSafeBase64EncodedId}`)

      const hashedKeyBuffer = await hash(this.key)
      const encodedHashedKey = base64Encode(hashedKeyBuffer)
      // @todo: remove these logs while transition done (8th day of the next month after 'HistoVec code partage' feature deployement)
      // eslint-disable-next-line no-console
      console.log(`[NEW] key base64Encoded = ${encodedHashedKey}`)

      const urlSafeBase64EncodedKey = urlSafeBase64Encode(base64Decode(encodedHashedKey))
      // eslint-disable-next-line no-console
      console.log(`[OLD] key urlSafeBase64Encoded = ${urlSafeBase64EncodedKey}`)

      // // eslint-disable-next-line no-console
      console.log(`[KEY] are they different ? ${encodedHashedKey !== urlSafeBase64EncodedKey}`)

      if (this.checkFields) {
        if (encodedHashedId !== this.$store.state.histovec.id) {
          this.clearReport()
        }

        this.$router.push({
          name: 'report',
          params: {
            id: encodedHashedId,
            key: encodedHashedKey,
            typeImmatriculation: this.typeImmatriculation,
          },
        })
      } else {
        this.status = 'failed'
      }
    },
  },
}
</script>
