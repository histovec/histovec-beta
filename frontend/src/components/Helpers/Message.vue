<template>
  <div class="container">
    <article :class="messageType">
      <div class="message-header">
        <p>
          <span class="icon"><i :class="['fa', 'fa-' + iconType]"></i></span>
          <slot name="header"></slot>
        </p>
        <p>
          <slot name="button"></slot>
        </p>
      </div>
      <div class="message-body">
        <slot></slot>
      </div>
    </article>
  </div>
</template>

<script>
  export default {
    props: {
      type: String
    },
    data () {
      return {
        icons: {
          normal: '',
          primary: 'arrow-circle-right',
          info: 'info-circle',
          success: 'check-circle',
          warning: 'exclamation-circle',
          danger: 'times-circle'
        }
      }
    },
    computed: {
      messageType () {
        return this.type ? 'message is-' + this.type : 'message'
      },
      iconType () {
        return this.icons[this.type]
      }
    },
    methods: {
    },
    mounted () {
      window.bus.$on('projectChange', function (project) {
        window.bus.$emit('error', {display: false, message: '', type: 'success'})
        // vue.editor.setValue('')
      })

      window.bus.$on('objectChange', function (loading) {
        window.bus.$emit('error', {display: false, message: '', type: 'success'})
      })
    }
  }
</script>

<style scoped lang="less">
.messageWrapper {
  margin-top: 20px;
  background-color: #fff;
}
</style>
