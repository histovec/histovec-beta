<template>
  <div>
    <div class="row">
      <div class="col-sm-6">
        <h6 class="title">
          Gages
          <a
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
            :href="syntheseMapping['otci'].link"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </h6>
        <!-- debut tableau gages -->
        <div class="col-sm-12">
          <div
            v-for="(gageInfos, index) in reportLabels.gagesInfos"
            :key="index"
            class="info_red txt-small-12"
          >
            <span v-if="gageInfos.date">{{ gageInfos.date }} - </span>{{ gageInfos.label }}
          </div>
          <div class="separator-2"></div>
        </div>
        <!-- fin tableau gages -->
      </div>
      <div class="col-sm-6">
        <h6 class="title">
          Déclarations valant saisie
        </h6>
        <!-- debut tableau déclarations valant saisie -->
        <div class="col-sm-12">
          <div
            v-for="(dvs, index) in reportLabels.dvsInfos"
            :key="index"
            class="info_red txt-small-12"
          >
            <span v-if="dvs.date">{{ dvs.date }} - </span>{{ dvs.label }}
          </div>
          <div class="separator-2"></div>
        </div>
        <!-- fin tableau déclarations valant saisie -->
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-sm-6">
        <h6 class="title">
          Oppositions
          <a
            class="btn-sm-link pop color-info_3 bold_4 txt-small-12 no-padding"
            :href="syntheseMapping['otci'].link"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i class="fa fa-external-link pl-5"></i>
          </a>
        </h6>
        <!-- debut tableau oppositions -->
        <div class="col-sm-12">
          <div
            v-for="(oppositionInfos, index) in reportLabels.oppositionsInfos"
            :key="index"
            class="info_red txt-small-12"
          >
            <span v-if="oppositionInfos.date">{{ oppositionInfos.date }} - </span>{{ oppositionInfos.label }}
            <span
              v-if="oppositionSection.hasOtciPv && holder && oppositionInfos.label.includes('PV')"
              class="no-color txt-small-12"
            >
              ( Appelez le 08 21 08 00 31 )
            </span>
          </div>
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
            <div
              v-for="(suspensionInfos, index) in reportLabels.suspensionsInfos"
              :key="index"
              class="info_red txt-small-12"
            >
              <span v-if="suspensionInfos.date">{{ suspensionInfos.date }} - </span>{{ suspensionInfos.label }}
            </div>
          </div>
          <div class="separator-2"></div>
        </div>
        <!-- fin tableau suspensions -->
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-sm-6">
        <!-- debut tableau véhicule -->
        <h6 class="title">
          Véhicule
        </h6>
        <div class="col-offset-sm-2 col-sm-7">
          <span class="txt-small-12">Déclaré volé</span>
        </div>
        <div class="col-sm-1">
          <span class="info_red txt-small-12">{{ reportLabels.vol }}</span>
        </div>
        <div class="col-sm-2"></div>

        <div class="col-sm-12">
          <div class="separator-2"></div>
        </div>
      </div>
      <!-- fin tableau véhicule -->
      <!-- debut tableau titre -->
      <div class="col-sm-6">
        <h6 class="title">
          Carte grise
        </h6>
        <div class="col-offset-sm-2 col-sm-7">
          <span class="txt-small-12">Déclaré volée</span>
        </div>
        <div class="col-sm-1">
          <span class="info_red txt-small-12">{{ reportLabels.titre.vol }}</span>
        </div>
        <div class="col-sm-2"></div>

        <div class="col-offset-sm-2 col-sm-7">
          <span class="txt-small-12">Déclaré perdue</span>
        </div>
        <div class="col-sm-1">
          <span class="info_red txt-small-12">{{ reportLabels.titre.perte }}</span>
        </div>
        <div class="col-sm-2"></div>

        <div class="col-offset-sm-2 col-sm-7">
          <span class="txt-small-12">Duplicata</span>
        </div>
        <div class="col-sm-1">
          <span class="info_red txt-small-12">{{ reportLabels.titre.duplicata }}</span>
        </div>
        <div class="col-sm-2"></div>

        <div class="col-sm-12">
          <div class="separator-2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    holder: Boolean,
    oppositionSection: {
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
