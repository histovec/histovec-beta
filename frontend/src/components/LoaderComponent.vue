<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoaderComponent',
  props: {
    taille: {
      type: String,
      default: '',
    },
  },
  computed: {
    getLoader() {
      return 'lds-dual-ring ' + this.taille;
    },
  },
})
</script>

<template>
  <div class="loader-container">
    <div :class="getLoader"></div>
  </div>
</template>

<style scoped>
.loader-container{
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  background-color: rgba(0,0,0,0.5);
  z-index: 100;
}

.lds-dual-ring {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
  margin: 0 auto;

}

.lds-dual-ring:after {
  display: flex;
  align-items: center;
  content: " ";
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}

.md {
  width: 60px;
  height: 60px;
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
