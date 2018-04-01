<template>
    
  
    <section class="container" id="search">
        <div class="row">
          <div class="col-md-12"> <img src="assets/images/certificat_immat_2.jpg" class="img-responsive" alt="slidebg2" data-bgposition="center top" data-bgrepeat="no-repeat" data-bgfit="cover"/></div>
        </div>
        <span class="row">
        </span>
      <div class="row">
        <div class="col-md-4">
          <h3 class="title"><span class="text-default">H</span>isto<span class="text-default">V</span>ec </h3>
          <p>Cette recherche vous permet de connaitre les antécédents du véhicule, le nombre de propriétaires, les données à la première mise en circulation (couleur, cylindrée....).</p>
          <p>Egalement la vie du véhicule, accidentalité ayant entrainé une mise en hors circulation, utilisation d'un véhicule dans un cadre professionnel (taxi...).</p>
          <a href="page-about.html" class="btn radius-50 btn-default btn-hvr hvr-shutter-out-horizontal" data-toggle="modal" data-target="#myModal"><i class="fa fa-users  pr-10"></i>En savoir plus...</a>
          <!-- Modals en savoir plus start -->
          <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                  <h4 class="modal-title" id="myModalLabel">HistoVec</h4>
                </div>
                <div class="modal-body">
                  <p>Consectetur adipisicing elit. Nemo architecto debitis dolorum ullam in ut sint, odit maiores eaque explicabo, repellendus minima soluta sunt! Nisi minima blanditiis voluptate, ut atque.</p>
                  <p>Culpa expedita! Quisquam, itaque officiis nisi nam doloribus explicabo possimus, dolorum alias provident maxime temporibus, enim voluptatibus! Molestias, accusantium cum impedit sint velit exercitationem deserunt, corporis magni provident earum, ullam iusto voluptatem iste animi inventore ab cupiditate quod laborum quasi libero doloremque obcaecati eius. Ut, reprehenderit optio unde accusantium quia qui! Debitis delectus corporis aspernatur nemo aut, odio harum ea repellendus quidem, saepe, incidunt? Assumenda deserunt unde minima aspernatur ducimus velit molestiae, minus eius inventore, dolore temporibus odio distinctio optio.</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-sm btn-dark" data-dismiss="modal">Fermer</button>
                  <button type="button" class="btn btn-sm btn-default">Imprimer</button>
                </div>
              </div>
            </div>
          </div>
          <!-- Modals en savoir plus end -->
        </div>
        <div class="col-md-8">
          <h3 class="text-center h3_spec">Saississez votre recherche</h3>
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
          <form role="form">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group has-feedback">
                  <label for="input" class="control-label">N° SIV</label>
                  <input type="text" class="form-control" id="input" v-model="plaque" placeholder="AA-555-AA">
                  <i class="fa fa-drivers-license-o form-control-feedback"></i> </div>
              </div>
              <div class="col-md-6">
                <div class="form-group has-feedback plan position_left">
                  <label for="input" class="control-label">N° VIN</label>
                  <input type="text" class="form-control pt-popover" id="input" v-model="vin" placeholder="VFS1W2389ASTV3069" data-toggle="popover" data-placement="top" data-content="Le code VIN se situe à la lettre E sur votre certificat d'immatriculation" title="Code VIN " data-original-title="15GB Storage" data-trigger="hover">
                  <i class="fa fa-pencil-square-o form-control-feedback"></i> </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-sm-offset-4 col-sm-3"> 
                <router-link 
                  class="btn btn-animated btn-default btn-hvr hvr-shutter-out-horizontal"
                  :to="{ name: 'result', query: {id: id}}"
                >
                  <i class="fa fa-send-o"></i>Rechercher
                </router-link> 
              </div>
            </div>
          </form>
          <!-- Modal rechercher start -->
          <div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                  <h4 class="modal-title" id="myLargeModalLabel">Résultats</h4>
                </div>
                <div class="modal-body">
                  <h2><span class="text-default">H</span>isto<span class="text-default">V</span>ec </h2>
                  <h6>M. DXXXXT Pxxxxe - Immatriculation AA-123-BB</h6>
                  <div class="separator-2"></div>
                  <!-- resultat icone start -->
                  <!-- ================ -->
                  <section class="main-container">
                    <div class="container">
                      <div class="row">
                        <div class="main col-md-12">
                          <div class="row">
                            <div class="col-md-4 ">
                              <div class="feature-box-2"> <span class="icon without-bg"><i class="fa fa-object-ungroup text-default"></i></span>
                                <div class="body">
                                  <h4 class="title">Marque</h4>
                                  <p>Peugeot</p>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-4 ">
                              <div class="feature-box-2"> <span class="icon without-bg"><i class="fa fa-car text-default"></i></span>
                                <div class="body">
                                  <h4 class="title">Modèle</h4>
                                  <p>308</p>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-4 ">
                              <div class="feature-box-2"> <span class="icon without-bg"><i class="fa fa-paint-brush text-default"></i></span>
                                <div class="body">
                                  <h4 class="title">Couleur</h4>
                                  <p>Bleue</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-4 ">
                              <div class="feature-box-2"> <span class="icon without-bg"><i class="fa fa-cogs text-default"></i></span>
                                <div class="body">
                                  <h4 class="title">Cylindrée</h4>
                                  <p> 2494</p>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-4 ">
                              <div class="feature-box-2"> <span class="icon without-bg"><i class="fa fa-calendar text-default"></i></span>
                                <div class="body">
                                  <h4 class="title">Mise en circulation</h4>
                                  <p> 07/2016</p>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-4 ">
                              <div class="feature-box-2"> <span class="icon without-bg"><i class="fa fa-fire text-default"></i></span>
                                <div class="body">
                                  <h4 class="title">Carburant</h4>
                                  <p> Essence</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <!-- resultat icone end -->
                  <div class="separator-2"></div>
                  <!-- section start -->
                  <!-- ================ -->
                  <section>
                    <div class="container">
                      <div class="row">
                        <div class="col-md-6">
                          <!-- page-title start -->
                          <!-- ================ -->
                          <h2><span class="icon without-bg"><i class="fa fa-id-card-o text-default"></i></span> <span class="text-default">H</span><span class="text-lowercase">istorique</span> <span class="text-default">I</span><span class="text-lowercase">mmatriculation</span> </h2>
                          <div class="separator-2"></div>
                          <!-- page-title end -->
                          <!-- pricing tables start -->
                          <!-- ================ -->
                          <div class="pricing-tables stripped">
                            <div class="row grid-space-0">
                              <!-- pricing table start -->
                              <!-- ================ -->
                              <div class="col-sm-4 plan stripped">
                                <div class="header dark-bg">
                                  <h3>Privé</h3>
                                </div>
                                <ul>
                                  <li>Professionnel</li>
                                  <li>Privé</li>
                                </ul>
                              </div>
                              <!-- pricing table end -->
                              <!-- pricing table start -->
                              <!-- ================ -->
                              <div class="col-sm-4 plan stripped">
                                <div class="header default-bg">
                                  <h3>Date</h3>
                                </div>
                                <ul>
                                  <li><a href="#" class="pt-popover" data-toggle="popover" data-placement="top" data-content="Effectuée" title="" data-original-title="Immatriculation">06 Janvier 2012</a> </li>
                                  <li><a href="#" class="pt-popover" data-toggle="popover" data-placement="top" data-content="Effectuée" title="" data-original-title="Immatriculation">05 Avril 2008</a> </li>
                                </ul>
                              </div>
                              <!-- pricing table end -->
                              <!-- pricing table start -->
                              <!-- ================ -->
                              <div class="col-sm-4 plan stripped">
                                <div class="header dark-bg">
                                  <h3>Ville</h3>
                                </div>
                                <ul>
                                  <li>Rouen</li>
                                  <li>Paris</li>
                                </ul>
                              </div>
                            <!-- pricing table end -->
                            </div>
                          </div>
                          <!-- pricing tables end -->
                        </div>
                        <div class="col-md-6">
                          <!-- page-title start -->
                          <!-- ================ -->
                          <h2><span class="icon without-bg"><i class="fa fa-check-square-o text-default"></i></span> <span class="text-default">H</span><span class="text-lowercase">istorique</span> <span class="text-default">V</span><span class="text-lowercase">erbalisation</span> </h2>
                          <div class="separator-2"></div>
                          <!-- page-title end -->
                          <!-- pricing tables start -->
                          <!-- ================ -->
                          <div class="pricing-tables stripped">
                            <div class="row grid-space-0">
                              <!-- pricing table start -->
                              <!-- ================ -->
                              <div class="col-sm-4 plan stripped">
                                <div class="header dark-bg">
                                  <h3>Situation</h3>
                                </div>
                                <ul>
                                  <li>Rouen</li>
                                  <li>A13</li>
                                  <li>Rouen</li>
                                </ul>
                              </div>
                              <!-- pricing table end -->
                              <!-- pricing table start -->
                              <!-- ================ -->
                              <div class="col-sm-4 plan stripped">
                                <div class="header default-bg">
                                  <h3>Date</h3>
                                </div>
                                <ul>
                                  <li><a href="#" class="pt-popover" data-toggle="popover" data-placement="top" data-content="Infraction payée" title="" data-original-title="Contravention">15 Mars 2014</a></li>
                                  <li>19 Juillet 2015</li>
                                  <li><a href="#" class="pt-popover label-danger" data-toggle="popover" data-placement="top" data-content="Infraction non-payée" title="" data-original-title="Contravention">20 Ocotobre 2016</a></li>
                                </ul>
                              </div>
                              <!-- pricing table end -->
                              <!-- pricing table start -->
                              <!-- ================ -->
                              <div class="col-sm-4 plan stripped">
                                <div class="header dark-bg">
                                  <h3>Catégorie</h3>
                                </div>
                                <ul>
                                  <li>Feu rouge</li>
                                  <li>Vitesse</li>
                                  <li>Vitesse</li>
                                </ul>
                              </div>
                              <!-- pricing table end -->
                            </div>
                          </div>
                          <!-- pricing tables end -->
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-sm btn-dark" data-dismiss="modal">Fermer</button>
                  <button type="button" class="btn btn-sm btn-default">Partager</button>
                </div>
              </div>
            </div>
          </div>
          <!-- Modal rechercher end -->
        </div>
      </div>
  </section>
  <!-- section end -->
</template>

<script>

import Upload from './Upload'

var sha1 = require('sha1')

export default {
  components: {
    Upload
  },
  data () {
    return {
      nom: '',
      prenom: '',
      date_naissance: '',
      plaque: '',
      vin: '',
      conf: []
    }
  },
  computed: {
    orderedProjects () {
      return this.$lodash.sortBy(this.projects)
    },
    id () {
      console.log(this.plaque.replace(/-/g, '') + this.vin)
      return sha1(this.plaque.replace(/-/g, '') + this.vin)
    }
  },
  created () {
    this.$http.get(this.apiUrl + 'conf')
      .then(response => {
        this.conf = Object.keys(response.body)
      })
  }
}
</script>

<style lang="scss" scoped>
</style>
