<template>
  <div id="editor" class="is-fullheight" style="font-size: 12px">
    <codemirror
      ref="myEditor"
      :code="code"
      :options="editorOptions"
      @change="onEditorCodeChange"
      class="is-fullheight"
    ></codemirror>
    <a
      class="delete is-large"
      v-show="isFullScreen"
      @click="editor.setOption('fullScreen', false); isFullScreen = false"
      id="closeFullScreen"
    ></a>
  </div>
</template>

<script>

import {codemirror} from 'vue-codemirror'

require('codemirror/addon/selection/active-line.js')

require('codemirror/addon/dialog/dialog.js')
require('codemirror/addon/dialog/dialog.css')
require('codemirror/addon/search/searchcursor.js')
require('codemirror/addon/search/search.js')

// keyMap
require('codemirror/addon/edit/matchbrackets.js')

// foldGutter
require('codemirror/addon/fold/foldgutter.css')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/comment-fold.js')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/xml-fold.js')

require('codemirror/addon/display/fullscreen.css')
require('codemirror/addon/display/fullscreen.js')

export default {
  components: {
    codemirror
  },
  props: {
    codeData: String,
    saveCode: Boolean,
    showFullScreen: Boolean
  },
  data () {
    return {
      code: this.codeData,
      editorOptions: {
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        foldGutter: true,
        styleSelectedText: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineWrapping: false,
        showCursorWhenSelecting: true,
        tabSize: 2,
        extraKeys: {
          'F11': cm => {
            this.isFullScreen = !cm.getOption('fullScreen')
            cm.setOption('fullScreen', !cm.getOption('fullScreen'))
          },
          'Esc': cm => {
            if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false)
            this.isFullScreen = false
          },
          'Tab': cm => {
            cm.replaceSelection(Array(cm.getOption('indentUnit') + 1).join(' '))
          }
        },
        mode: 'text/yaml',
        theme: 'rubyblue'
      },
      isFullScreen: false
    }
  },
  watch: {
    saveCode (newVal) {
      if (newVal) {
        this.$emit('codeSaved-' + this.$route.name, this.code)
      }
    },
    showFullScreen (newVal) {
      if (newVal) {
        this.isFullScreen = true
        this.editor.setOption('fullScreen', true)
        this.$emit('showedFullScreen')
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myEditor.editor
    }
  },
  methods: {
    onEditorCodeChange (newCode) {
      this.code = newCode
    }
  }
}
</script>

<style lang="scss">
.CodeMirror {
  height: 100%;
}
#closeFullScreen {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
}
</style>
