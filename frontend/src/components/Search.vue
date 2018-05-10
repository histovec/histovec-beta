<template>

  <div>
    <section class="main-container">
      <div class="container">
        <div class="row">
          <div class="col-md-12"> <img src="assets/images/recherche_1.jpg" class="img-responsive" alt="slidebg2" data-bgposition="center top" data-bgrepeat="no-repeat" data-bgfit="cover"></div>
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
                      <legend><span class="color-default">Mettre ici un titre</span></legend>
                      <form role="form">
                        <div class="row">
                          <div class="col-md-4">
                            <div class="form-group has-feedback">
                              <label for="input" class="control-label">N° SIV</label>
                              <input type="text" class="form-control" id="input" placeholder="AA-555-AA" v-model="plaque">
                              <i class="fa fa-drivers-license-o form-control-feedback"></i> </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group has-feedback plan position_left">
                              <label for="input" class="control-label">N° de formule</label>
                              <input type="text" class="form-control pop" placeholder="A123B456" data-toggle="popover" data-placement="top" data-content="Le numéro de formule se situe sous le numéro d'immatricualtion" title="Code VIN" data-original-title="15GB Storage" data-trigger="hover" v-model="formule">
                              <i class="fa fa-pencil-square-o form-control-feedback"></i> </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group has-feedback plan position_left">
                              <label for="input" class="control-label">Date première mise en circulation</label>
                              <input type="text" class="form-control pop" placeholder="XX/XX/XXXX" data-toggle="popover" data-placement="top" data-content="Le code VIN se situe à la lettre E sur votre certificat d'immatriculation" title="Code VIN" data-original-title="15GB Storage" data-trigger="hover" v-model="date_prem_immat">
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
                            <i class="fa fa-calendar form-control-feedback"></i> </div>
                        </div>
                      </div>
                    </form>
                    <fieldset>
                      <legend><span class="color-default">Mettre ici un titre</span></legend>
                      <form role="form">
                        <div class="row">
                          <div class="col-md-4">
                            <div class="form-group has-feedback">
                              <label for="input" class="control-label">N° SIV</label>
                              <input type="text" class="form-control" id="input" placeholder="AA-555-AA"  v-model="plaque">
                              <i class="fa fa-drivers-license-o form-control-feedback"></i> </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group has-feedback plan position_left">
                              <label for="input" class="control-label">N° de formule</label>
                              <input type="text" class="form-control pop" placeholder="A123B456" data-toggle="popover" data-placement="top" data-content="Le code VIN se situe à la lettre E sur votre certificat d'immatriculation" title="Code VIN" data-original-title="15GB Storage" data-trigger="hover"  v-model="formule">
                              <i class="fa fa-pencil-square-o form-control-feedback"></i> </div>
                          </div>
                          <div class="col-md-4">
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
    orderedProjects () {
      return this.$lodash.sortBy(this.projects)
    },
    weekNumber () {
      return '19'
      // let d = new Date()
      // // Copy date so don't modify original
      // d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      // // Set to nearest Thursday: current date + 4 - current day number
      // // Make Sunday's day number 7
      // d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
      // // Get first day of year
      // var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
      // // Calculate full weeks to nearest Thursday
      // var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
      // // Return array of year and week number
      // return [d.getUTCFullYear(), weekNo]
    },
    id () {
      return this.hash(this.raison_sociale + this.siren + this.nom + this.prenom + this.date_naissance + this.plaque + this.formule)
    },
    code () {
      return this.hash(this.plaque + this.formule + this.weekNumber)
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
    this.$http.get(this.apiUrl + 'conf')
      .then(response => {
        this.conf = Object.keys(response.body)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
