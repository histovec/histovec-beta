<template>
  <div 
    v-if="(status !== 'ok') && (status !== 'cached')"
    class="container"
  >
    <div class="row">
      <div class="col-lg-12">
        <div
          :class="alertClass"
          role="alert"
        >
          <i :class="icon"></i>
          {{ message }} 
          <router-link
            v-if="refDisplay"
            class="clickable alert-danger"
            :to="{ name: ref, hash:'#i'}"
          >
            <em>{{ refMessage }}</em>
            <b :class="refIcon"></b>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: 'unknown'
    }
  },
  computed: {
    message () {
      return this.messages[this.status] ? (this.messages[this.status].msg ? this.messages[this.status].msg : this.messages[this.status]) : this.messages.default.msg
    },
    alertClass () {
      return this.messages[this.status] ? (this.messages[this.status].class ? this.messages[this.status].class : this.messages.default.class) : this.messages.default.class
    },
    icon () {
      return this.messages[this.status] ? (this.messages[this.status].icon ? this.messages[this.status].icon : this.messages.default.icon) : this.messages.default.icon
    },
    refDisplay () {
      return this.messages[this.status] ? (this.messages[this.status].ref !== false) : true
    },
    ref () {
      return this.messages[this.status] ? ((this.messages[this.status].ref !== undefined) ? this.messages[this.status].ref.route : this.messages.default.ref.route) : this.messages.default.ref.route
    },
    refMessage () {
      return this.messages[this.status] ? (this.messages[this.status].ref ? this.messages[this.status].ref.msg : this.messages.default.ref.msg) : this.messages.default.ref.msg
    },
    refIcon () {
      return this.messages[this.status] ? (this.messages[this.status].ref ? this.messages[this.status].ref.icon : this.messages.default.ref.icon) : this.messages.default.ref.icon
    }
  }
}
</script>
