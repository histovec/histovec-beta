<script>
import { defineComponent } from 'vue'
import { FocusTrap } from 'focus-trap-vue'

export default defineComponent({
  name: 'HistoVecModale',
  components: {
    FocusTrap,
  },
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
  watch: {
    opened(newValue) {
      if (newValue) {
        document.addEventListener('keydown', this.closeIfEscape)
      } else {
        document.removeEventListener('keydown', this.closeIfEscape)
      }
    },
  },
  methods: {
    close () {
      this.$emit('close')
    },
  },
})
</script>

<template>
  <focus-trap
    v-if="opened"
  >
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
                  title="Fermer la fenêtre modale"
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
                <DsfrButtonGroup
                  align="right"
                  :buttons="actions"
                  inline
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </focus-trap>
</template>
