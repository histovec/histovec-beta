<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="close"
                @click="close()"
              >
                <span aria-hidden="true">&times;</span><span class="sr-only">Fermer</span>
              </button>
              <h6 class="modal-title">
                <slot name="title"></slot>
              </h6>
            </div>
            <div
              class="modal-body"
              style="height: 250px; overflow-y: auto;"
            >
              <slot name="body"></slot>
            </div>
            <div class="modal-footer">
              <a
                class="btn radius-30 btn btn-animated btn-default"
                @click="close()"
              >
                Fermer <i class="fa fa-close"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
