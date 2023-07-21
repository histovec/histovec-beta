<script>
import {defineComponent} from 'vue'

import { OLD_IMMATRICULATION_TYPE, TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@Constants/type.js'

import plaqueNonSupporteeSvg from '@Assets/img/plaque_non_supportee.svg?url'
import plaqueFniSvg from '@Assets/img/plaque_fni.svg?url'
import plaqueSivSvg from '@Assets/img/plaque_siv.svg?url'
import { sleep } from '@Utils/sleep';

export default defineComponent({
  name: 'SelectionnerFormatImmatriculation',
  props:{
    formulaireData: {
      type: Object,
      default: null,
    },
    focusSIV: {
      type: Boolean,
      default: false,
    },
    focusFNI: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      formData: this.formulaireData,
      TYPE_IMMATRICULATION,
      OLD_IMMATRICULATION_TYPE,

      images: {
        plaqueNonSupporteeSvg,
        plaqueFniSvg,
        plaqueSivSvg,
      },

    }

  },
  watch: {
    'focusSIV': function () {
      sleep(100).then(() => {
        this.$refs.SIVPlaque.focus()
      })
    },
    'focusFNI': function () {
      sleep(100).then(() => {
        this.$refs.FNIPlaque.focus()
      })
    },
    'formData.typeImmatriculation': function (val) {
      sleep(100).then(() => {
        if (val === TYPE_IMMATRICULATION.SIV) {
            this.formData.typePersonne = TYPE_PERSONNE.PARTICULIER
            document.getElementById('form-siv-particulier-nom-naissance').focus()

        }
        if (val === TYPE_IMMATRICULATION.FNI) {
            this.formData.typePersonne = TYPE_PERSONNE.PARTICULIER
            document.getElementById('form-fni-particulier-nom-prenom').focus()
        }
      })
    },
  },
  methods: {
    setActive (typeImmatriculationCompare) {
      return this.formData.typeImmatriculation === typeImmatriculationCompare;
    },
    setOpacite (typeImmatriculationCompare) {
      return this.formData.typeImmatriculation && this.formData.typeImmatriculation !== typeImmatriculationCompare
    },
  },
})
</script>

<template>
  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center">
    <div class="fr-col-11  fr-col-lg-8  fr-col-xl-8  text-center">
      <h3 class="fr-h4">
        Veuillez sélectionner le format d'immatriculation de votre véhicule
      </h3>
    </div>
  </div>
  <div class="fr-form-group">
    <fieldset class="fr-fieldset">
      <legend
        id="radio-rich-legend"
        class="fr-fieldset__legend"
      >
        Sélectionner le type de votre plaque d'immatriculation :
      </legend>
      <ul class="fr-btns-group fr-btns-group--center fr-btns-group--inline-sm">
        <li>
          <label
            :for="TYPE_IMMATRICULATION.SIV"
            class="card-immatriculation"
            :class="{ 'card-immatriculation--active': setActive(TYPE_IMMATRICULATION.SIV) }"
          >
            <span class="card-immatriculation--image--wrap">
              <img
                class="card-immatriculation--image"
                :class="{ 'card-immatriculation--image--opacity': setOpacite(TYPE_IMMATRICULATION.SIV) }"
                :src="images.plaqueSivSvg"
                alt="Format d'immatriculation depuis 2009"
                title="Format d'immatriculation depuis 2009"
              />
            </span>
            <input
              :id="TYPE_IMMATRICULATION.SIV"
              ref="SIVPlaque"
              v-model="formData.typeImmatriculation"
              name="Immatriculation depuis 2009"
              class="card-immatriculation--radio"
              type="radio"
              :value="TYPE_IMMATRICULATION.SIV"
            >
            <span
              class="fr-label fr-mt-3w"
            >Immatriculation depuis 2009
            </span>
          </label>
        </li>
        <li>
          <label
            :for="TYPE_IMMATRICULATION.FNI"
            class="card-immatriculation"
            :class="{ 'card-immatriculation--active': setActive(TYPE_IMMATRICULATION.FNI) }"
          >
            <span class="card-immatriculation--image--wrap">
              <img
                class="card-immatriculation--image"
                :class="{ 'card-immatriculation--image--opacity': setOpacite(TYPE_IMMATRICULATION.FNI) }"
                :src="images.plaqueFniSvg"
                alt="Format d'immatriculation avant 2009"
                title="Format d'immatriculation avant 2009"
              />
            </span>
            <input
              :id="TYPE_IMMATRICULATION.FNI"
              ref="FNIPlaque"
              v-model="formData.typeImmatriculation"
              name="Immatriculation avant 2009"
              class="card-immatriculation--radio"
              type="radio"
              :value="TYPE_IMMATRICULATION.FNI"
            >
            <span
              class="fr-label fr-mt-3w"
            >Immatriculation avant 2009
            </span>
          </label>
        </li>
        <li>
          <label
            :for="OLD_IMMATRICULATION_TYPE"
            class="card-immatriculation"
            :class="{ 'card-immatriculation--active': setActive(OLD_IMMATRICULATION_TYPE) }"
          >
            <span class="card-immatriculation--image--wrap">
              <img
                class="card-immatriculation--image"
                :class="{ 'card-immatriculation--image--opacity': setOpacite(OLD_IMMATRICULATION_TYPE) }"
                :src="images.plaqueNonSupporteeSvg"
                alt="Format d'immatriculation avant 1995"
                title="Format d'immatriculation avant 1995"
              />
            </span>
            <input
              :id="OLD_IMMATRICULATION_TYPE"
              v-model="formData.typeImmatriculation"
              name="Immatriculation avant 1995"
              class="card-immatriculation--radio"
              type="radio"
              :value="OLD_IMMATRICULATION_TYPE"
            >
            <span
              class="fr-label fr-mt-3w"
            >Immatriculation avant 1995
            </span>
          </label>
        </li>
      </ul>
    </fieldset>
  </div>
</template>
<style scoped>
.text-center {
  text-align: center;
}

.card-immatriculation {
  text-align: center;
  width: 270px;
  margin: 1rem;
  cursor: pointer;
  background: var(--background-default-grey);
  border: 2px var(--grey-925-125) solid;
  padding: 1rem;
  display:block;
}
.card-immatriculation--active {
  border-color: var(--blue-france-sun-113-625);
}
.card-immatriculation:hover,
.card-immatriculation:focus,
.card-immatriculation:focus-within {
  background: var(--grey-1000-50-hover);
  outline: 2px solid var(--info-425-625-hover);
}
.card-immatriculation:hover img,
.card-immatriculation:focus img,
.card-immatriculation:focus-within img {
  opacity: 1;
}
.card-immatriculation--image--wrap {
  height: 70px;
  width: 100%;
}
.card-immatriculation--image {
  background: var(--background-default-grey);
  height: 3rem;
}
.card-immatriculation--image--opacity {
  opacity: 0.2;
}
.card-immatriculation--radio {
  outline:none;
}
</style>
