<script>
import { defineComponent } from 'vue'
import { DsfrButtonGroup } from '@gouvminint/vue-dsfr';

export default defineComponent({
  name: 'HistoVecModale',
  components: {DsfrButtonGroup},
  inheritAttrs: false,
  props: {
    titre: {
      type: String,
      required: true,
    },
    actions: {
      type: Array,
      default: () => {},
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'close',
  ],
  data () {
    return {
      closeIfEscape: ($event) => {
        if ($event.key === 'Escape' || $event.keyCode === 27) {
          this.close()
        }
      },
    }
  },
  mounted () {
    this.startListeningToEscape()
  },
  beforeUnmount () {
    this.stopListeningToEscape()
  },
  methods: {
    startListeningToEscape () {
      document.addEventListener('keydown', this.closeIfEscape)
    },
    stopListeningToEscape () {
      document.removeEventListener('keydown', this.closeIfEscape)
    },
    close () {
      this.$emit('close')
    },
  },
})
</script>

<template>
  <dialog
    id="fr-modal-1"
    aria-labelledby="fr-modal-title-modal-1"
    class="fr-modal"
    :class="{'fr-modal--opened': opened}"
  >
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <button
                ref="closeBtn"
                class="fr-btn--close fr-btn"
                aria-controls="fr-modal-1"
                title="Fermer"
                role="button"
                @click="close()"
              >
                Fermer
              </button>
            </div>
            <div class="fr-modal__content">
              <h1
                id="fr-modal-title-modal-1"
                class="fr-modal__title"
              >
                {{ titre }}
              </h1>
              <slot />
            </div>
            <div class="fr-modal__footer">
              <ul class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                <DsfrButtonGroup
                  align="right"
                  :buttons="actions"
                  inline
                  reverse
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
