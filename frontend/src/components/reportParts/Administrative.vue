<template>
  <div>
    <div class="row">
      <div class="col-sm-6">
        <h6 class="title">
          Gages
          <a
            :href="syntheseMapping['otci'].link"
            target="_blank"
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
          >
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </h6>
        <!-- debut tableau gages -->
        <div class="col-sm-12">
          <span class="info_red txt-small-12">{{ reportLabels.gagesCurrentStatus }}</span>
          <div class="separator-2"></div>
        </div>
      </div>
      <div class="col-sm-6">
        <h6 class="title">
          Oppositions
          <a
            :href="syntheseMapping['otci'].link"
            target="_blank"
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
          >
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </h6>
        <!-- debut tableau oppositions -->
        <div class="col-sm-12">
          <div
            v-for="(oppositionStatus, index) in reportLabels.oppositionsCurrentStatus"
            :key="index"
            class="info_red txt-small-12"
          >
            {{ oppositionStatus }}
          </div>
          <!-- <span
            v-if="opposition.hasOtciPv && holder"
            class="txt-small-12"
          >
            Appelez le 08 21 08 00 31
          </span> -->
          <div class="separator-2"></div>
        </div>
        <!-- fin tableau oppositions -->
      </div>
      <div class="col-sm-6">
        <h6 class="title">
          Suspensions
        </h6>
        <!-- debut tableau suspensions -->
        <div class="col-sm-12">
          <div>
            <span class="info_red txt-small-12">{{ reportLabels.suspensionsMotifsCurrentStatus }}</span>
          </div>
          <div class="separator-2"></div>
        </div>
        <!-- fin tableau suspensions -->
      </div>
      <div class="col-sm-6">
        <h6 class="title">
          Procédures
        </h6>
        <!-- debut tableau procédures -->
        <div class="col-sm-12">
          <span class="info_red txt-small-12">{{ reportLabels.procedures }}</span>
          <div class="separator-2"></div>
        </div>
        <!-- fin tableau procédures -->
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <h6 class="title">
          Véhicule
        </h6>
        <!-- debut tableau véhicule -->
        <div class="col-sm-4">
          <span class="txt-small-12">Etat de vol</span>
        </div>
        <div class="col-sm-3">
          <span class="info_red txt-small-12">{{ reportLabels.vol }}</span>
        </div>
        <!-- fin tableau véhicule -->
      </div>
      <div class="col-sm-6">
        <h6 class="title">
          Etat de la carte grise
        </h6>
        <!-- debut tableau titre -->
        <div class="col-sm-5">
          <span class="txt-small-12">Etat de vol</span>
        </div>
        <div class="col-sm-5">
          <span class="info_red txt-small-12">{{ reportLabels.titre.vol }}</span>
        </div>
        <div class="col-sm-5">
          <span class="txt-small-12">Etat de perte</span>
        </div>
        <div class="col-sm-5">
          <span class="info_red txt-small-12">{{ reportLabels.titre.perte }}</span>
        </div>
        <div class="col-sm-5">
          <span class="txt-small-12">Duplicata</span>
        </div>
        <div class="col-sm-5">
          <span class="info_red txt-small-12">{{ reportLabels.titre.duplicata }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    holder: Boolean,
    opposition: {
      type: Object,
      default: () => {}
    },
    reportLabels: {
      type: Object,
      default: () => {}
    },
  },
  mounted () {
    this.$store.dispatch('log', `${this.$route.path}/administrative-status`)
  }
}

</script>
