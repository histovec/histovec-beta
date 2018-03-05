<template>
<div id="app-upload">
  <div class="container">
    <dropzone id="myVueDropzone" :url="url + 'uploadmany/'" v-on:vdropzone-success="showSuccess" v-on:vdropzone-removed-file="showRemoved">
        <div class="dz-default dz-message" data-dz-message><span>Drop your Files here to Upload</span></div>
         <input type="hidden" name="token" value="xxx">
     </dropzone>
  </div>
</div>
</template>


<script>
import Dropzone from 'vue2-dropzone'

export default {
  name: 'MainApp',
  components: {
    Dropzone
  },
  data () {
    return {
      url: process.env.APP + '/api/v0/'
    }
  },
  methods: {
    'showSuccess': function (file) {
      console.log('A file was successfully uploaded')
      console.log(process.env)
    },
    'showRemoved': function (file, error) {
      var url = this.url + 'delete/'
      var xhr = new XMLHttpRequest()
      xhr.open('DELETE', url + file.name, true)
      xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === '200') {
          console.log('the file was removed')
        } else {
          console.error(xhr.status)
        }
      }
      xhr.send(null)
    }
  }
}
</script>
