<template>
  <div
    class="banner"
    :style="{
      backgroundImage: `url(${homeBannerBgImgUrl})`,
    }"
  >
    <div class="container">
      <h1 class="title">
        Jouez la transparence
      </h1>
      <p class="title  subtitle">
        En partageant l'historique du véhicule
      </p>
    </div>
  </div>
</template>

<script>
import homeBannerBgImgUrl from '@/assets/img/accueil_4.jpg'

export default {
  data () {
    return {
      homeBannerBgImgUrl,
    }
  },
}
</script>

<style lang="scss" scoped>
.banner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 350px;
  background-size: 1200px;
  background-position: 50% -100px;
  background-repeat: no-repeat;
}

.title {
  color: #fff;
  text-shadow: 2px 2px 2px #000;
  text-align: center;
}

.subtitle {
  font-size: 1.333em;
}
</style>
