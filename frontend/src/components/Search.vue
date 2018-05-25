<template>


  <div>
    <section class="main-container">
      <div class="container">
        <div class="row">
          <!-- section start -->
          <section class="dark-translucent-bg fixed-bg pv-30" style="background-image:url(assets/images/recherche_1.jpg);">
            <div class="container">
              <div class="row justify-content-lg-center">
                <div class="col-lg-12">
                  <h2 class="text-center mt-4"><span class="bold_6">L’administration</span> agit pour la <span class="bold_6">sécurité routière</span></h2>
                  <div class="separator with-icon"><i class="fa fa-car bordered"></i></div>
                  <p class="large text-center bold_4">Ce site est mis en oeuvre par le ministère de l’intérieur dans le cadre de la mesure 16 décidées par le Gouvernement en janvier 2018 afin de mieux protéger les acheteurs de véhicules d’occasion (cf . <a href="#">dossier de presse</a>) </p>
                </div>
              </div>
            </div>
          </section>
          <!-- section end -->
          <!-- debut image fixe
          <div class="col-md-12"> <img src="assets/images/recherche_1.jpg" class="img-responsive" alt="slidebg2" data-bgposition="center top" data-bgrepeat="no-repeat" data-bgfit="cover"></div>
            <!-- fin image fixe -->
        </div>
      </div>
    </section>

    <!-- section -->
    <section class="main-container">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <!-- tabs start -->
            <!-- ================ -->
            <!-- Nav tabs -->
            <ul class="nav nav-tabs style-2" role="tablist">
              <li :class="[{'active' : type_personne === 'particulier'}]"><a href="#h2tab1" role="tab" data-toggle="tab"><i class="fa fa-user pr-10"></i>Particulier</a></li>
              <li :class="[{'in active' : type_personne === 'pro'}]"><a href="#h2tab2" role="tab" data-toggle="tab"><i class="fa fa-building-o pr-10"></i>Entreprise</a></li>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
              <div class="tab-pane" id="h2tab1" :class="[{'in active' : type_personne === 'particulier'}]">
                <div class="row">
                  <div class="col-md-12">
                    <form role="form">
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group has-feedback">
                            <label class="control-label">Nom</label>
                            <input type="text" class="form-control" v-model="nom">
                            <i class="fa fa-user form-control-feedback"></i> </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group has-feedback">
                            <label class="control-label">Prénom</label>
                            <input type="text" class="form-control" v-model="prenom">
                            <i class="fa fa-user form-control-feedback"></i> </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group has-feedback">
                            <label class="control-label">Date de naissance</label>
                            <input type="email" class="form-control" v-model="date_naissance">
                            <i class="fa fa-calendar form-control-feedback"></i> </div>
                        </div>
                      </div>
                    </form>
                    <fieldset>
                      <legend><span class="color-default">Carte grise</span></legend>
                      <form role="form">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group has-feedback">
                              <label for="input" class="control-label">Plaque d'immatriculation</label>
                              <input type="text" class="form-control" id="input" placeholder="AA-555-AA" v-model="plaque">
                              <i class="fa fa-drivers-license-o form-control-feedback"></i> </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group has-feedback plan position_left">
                              <label for="input" class="control-label">N° de formule</label>
                              <input type="text" class="form-control pop" placeholder="A123B456" data-toggle="popover" data-placement="top" data-content="Le numéro de formule se situe sous le numéro d'immatricualtion" title="N° de formule" data-original-title="15GB Storage" data-trigger="hover" v-model="formule">
                              <i class="fa fa-pencil-square-o form-control-feedback"></i> </div>
                          </div>
                          <div class="col-md-4" v-if="false">
                            <div class="form-group has-feedback plan position_left">
                              <label for="input" class="control-label">Date première mise en circulation</label>
                              <input type="text" class="form-control pop" placeholder="XX/XX/XXXX" data-toggle="popover" data-placement="top" data-content="Le code VIN se situe à la lettre E sur votre carte grise" title="Code VIN" data-original-title="15GB Storage" data-trigger="hover" v-model="date_prem_immat">
                              <i class="fa fa-pencil-square-o form-control-feedback"></i> </div>
                          </div>

                        </div>
                      </form>
                    </fieldset>
                    <div class="form-group">
                      <div class="col-xs-offset-4 col-sm-5">
                        <router-link
                                class="btn btn-animated btn-default btn-sm"
                                :to="{ name: 'report', query: {id: id, key: key, code: code}}"
                        >
                          <i class="fa fa-search"></i>Rechercher
                        </router-link>
                        <a href="#" class="btn btn-animated btn-default btn-sm pop" data-container="body" data-toggle="popover" data-placement="top" data-content="Le certificat de situation administrative (CSA) est un document délivré par le ministère de l'Intérieur contenant des éléments d'information sur la situation administrative d'un véhicule.<br>Le CSA détaillé fait apparaître l'ensemble des informations relatives à la situation du véhicule." data-original-title="CSA" title="CSA"> Imprimer CSA détaillé<i class="fa fa-print"></i> </a> </div>
                      </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane" id="h2tab2" :class="[{'in active' : type_personne === 'pro'}]">
                <div class="row">
                  <div class="col-md-12">
                    <form role="form">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group has-feedback">
                            <label class="control-label">Raison sociale</label>
                            <input type="text" class="form-control" v-model="raison_sociale">
                            <i class="fa fa-user form-control-feedback"></i> </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group has-feedback">
                            <label class="control-label">N° SIREN</label>
                            <input type="email" class="form-control"  v-model="siren">
                            <i class="fa fa-building-o form-control-feedback"></i> </div>
                        </div>
                      </div>
                    </form>
                    <fieldset>
                      <legend><span class="color-default">Carte grise</span></legend>
                      <form role="form">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group has-feedback">
                              <label for="input" class="control-label">Plaque d'immatriculation</label>
                              <input type="text" class="form-control" id="input" placeholder="AA-555-AA"  v-model="plaque">
                              <i class="fa fa-drivers-license-o form-control-feedback"></i> </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group has-feedback plan position_left">
                              <label for="input" class="control-label">N° de formule</label>
                              <input type="text" class="form-control pop" placeholder="A123B456" data-toggle="popover" data-placement="top" data-content="Le code VIN se situe à la lettre E sur votre carte grise" title="N° de formule" data-original-title="15GB Storage" data-trigger="hover"  v-model="formule">
                              <i class="fa fa-pencil-square-o form-control-feedback"></i> </div>
                          </div>
                          <div class="col-md-4" v-if="false">
                            <div class="form-group has-feedback plan position_left">
                              <label for="input" class="control-label">Date première mise en circulation</label>
                              <input type="text" class="form-control pop" placeholder="XX/XX/XXXX" data-toggle="popover" data-placement="top" data-content="Date de première mise en circulation, telle qu'indiquée sur la carte grise" title="Date de première mise en circulation" data-original-title="15GB Storage" data-trigger="hover" v-model="date_prem_immat" >
                              <i class="fa fa-pencil-square-o form-control-feedback"></i> </div>
                          </div>
                        </div>
                      </form>
                    </fieldset>
                    <div class="form-group">
                      <div class="col-xs-offset-4 col-sm-5">
                        <router-link
                                class="btn btn-animated btn-default btn-sm"
                                :to="{ name: 'report', query: {id: id, key: key, code: code}}"
                        >
                          <i class="fa fa-search"></i>Rechercher
                        </router-link>
                        <a href="#" class="btn btn-animated btn-default btn-sm pop" data-container="body" data-toggle="popover" data-placement="top" data-content="Le certificat de situation administrative (CSA) est un document délivré par le ministère de l'Intérieur contenant des éléments d'information sur la situation administrative d'un véhicule.<br>Le CSA détaillé fait apparaître l'ensemble des informations relatives à la situation du véhicule." data-original-title="CSA" title="CSA"> Imprimer CSA détaillé<i class="fa fa-print"></i> </a> </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <!-- tabs end -->
        </div>
      </div>
    </section>
    <!-- section end -->
    <div class="container">
      <div class="row"> </div>
    </div>
  </div>

</template>

<script>

import CryptoJS from 'crypto-js'

export default {
  components: {
  },
  data () {
    return {
      type_personne: 'particulier',
      nom: '',
      raison_sociale: '',
      prenom: '',
      date_naissance: '',
      plaque: '',
      siren: '',
      formule: '',
      date_prem_immat: '',
      vin: '',
      conf: []
    }
  },
  computed: {
    currentWeekNumber () {
      var instance = new Date()

      // Create a copy of this date object
      var target = new Date(instance.valueOf())

      // ISO week date weeks start on monday
      // so correct the day number
      var dayNr = (instance.getDay() + 6) % 7

      // ISO 8601 states that week 1 is the week
      // with the first thursday of that year.
      // Set the target date to the thursday in the target week
      target.setDate(target.getDate() - dayNr + 3)

      // Store the millisecond value of the target date
      var firstThursday = target.valueOf()

      // Set the target to the first thursday of the year
      // First set the target to january first
      target.setMonth(0, 1)
      // Not a thursday? Correct the date to the next thursday
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7)
      }

      // The currentWeekNumber is the number of weeks between the
      // first thursday of the year and the thursday in the target week
      var currentWeekNumber = 1 + Math.ceil((firstThursday - target) / 604800000)
      return instance.getFullYear() + '' + currentWeekNumber
    },
    id () {
      return this.hash(this.raison_sociale + this.siren + this.nom + this.prenom + this.date_naissance + this.plaque + this.formule)
    },
    code () {
      return this.hash(this.plaque + this.formule + this.currentWeekNumber)
    },
    key () {
      return this.hash(this.plaque + this.formule)
    }
  },
  methods: {
    hash (string) {
      var hash = string
      hash = hash.normalize('NFD').toLowerCase().replace(/[^0-9a-z]/g, '')
      hash = CryptoJS.SHA256(hash).toString(CryptoJS.enc.Base64)
      hash = hash.replace(/\+/g, '-').replace(/\//g, '_')
      return hash
    }
  },
  created () {
    this.type_personne = this.$route.query.t
  }
}
</script>

<style lang="scss" scoped>
</style>
