<template>
  <section class="main-container">
    <div class="container">
      <div class="row">
        <!-- section start -->
        <section
          class="dark-translucent-bg"
          :style="`background-image:url(${images.poigneeDeMainJpg}); background-position: 50% 50%`"
        >
          <div class="container">
            <div class="row justify-content-lg-center">
              <div class="col-lg-12">
                <h2 class="text-center mt-4">
                  <div v-if="holder">
                    <span class="bold_6">Rassurez</span> vos acheteurs potentiels
                  </div>
                  <div v-else>
                    <span class="bold_6">Achetez</span> en confiance un <span class="bold_6">véhicule d'occasion</span>
                  </div>
                </h2>
                <div class="separator with-icon">
                  <i class="fa fa-car bordered"></i>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- section end -->
      </div>
    </div>
  </section>
</template>

<script>
import {
  poigneeDeMainJpg,
} from '../../constants/images'

export default {
  props: {
    holder: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data() {
    return {
      images: {
        poigneeDeMainJpg
      }
    }
  }
}
</script>
