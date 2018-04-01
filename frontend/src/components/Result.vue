<template>
  <section id="result">
  <div class="breadcrumb-container">
    <div class="container">
      <ol class="breadcrumb">
        <li><i class="fa fa-home pr-10"></i><a href="vendeur_modal_fiche.html">Accueil</a></li>
        <li class="active">Résultats</li>
      </ol>
    </div>
  </div>
  <!-- breadcrumb end -->
  <!-- main-container start -->
  <div class="main-container" v-if="this.display">
    <div class="row">
      <!-- main start -->
      <div class="main col-md-12">
        <div class="container">
          <div class="row">
            <div class="col-sm-5">
              <div class="alert alert-icon alert-info" role="alert"> <i class="fa fa-window-maximize"></i> Numéro - Plaque d'immatriculation : {{ vehicule.plaque }}</div>
            </div>
            <div class="col-sm-5">
              <div class="alert alert-icon alert-3" role="alert"> <i class="fa fa-info-circle"></i> Vignette Crit'Air - Tous les véhicules <span class="txt-small">100% électrique et hydrogènes</span> </div>
            </div>
            <div class="col-sm-2"><img class="img-responsive" src="assets/images/vignettes_crit_air/petit/vignette_3.png"></div>
          </div>
          <div class="separator-2"></div>
          <!-- Tabs start -->
          <div class="vertical">
            <!-- Nav tabs -->
            <ul class="nav nav-tabs" role="tablist">
              <li class="active"><a href="#vtab1" role="tab" data-toggle="tab"><i class="fa fa-car pr-10"></i>Véhicule</a></li>
              <li><a href="#vtab2" role="tab" data-toggle="tab"><i class="fa fa-address-card pr-10"></i>Titulaire & Titre</a></li>
              <!-- <li><a href="#vtab3" role="tab" data-toggle="tab"><i class="fa fa-file-text-o pr-10"></i> Titres</a></li> -->
              <li><a href="#vtab4" role="tab" data-toggle="tab"><i class="fa fa-clipboard pr-10"></i> Situation administrative</a></li>
              <li><a href="#vtab5" role="tab" data-toggle="tab"><i class="fa fa-calculator pr-10"></i> Opération Historique</a></li>
              <!-- <li><a href="#vtab6" role="tab" data-toggle="tab"><i class="fa fa-bar-chart pr-10"></i> Historique</a></li> -->
              <li><a href="#vtab7" role="tab" data-toggle="tab"><i class="fa fa-refresh pr-10"></i> &nbsp;Synthèse</a></li>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
              <!-- debut vtab1 -->
              <div class="tab-pane fade in active" id="vtab1">
                <!-- debut tableau vehicule -->
                <table class="table table-responsive">
                  <tbody>
                    <tr>
                      <td colspan="7"><h6>Caractéristiques techniques</h6></td>
                    </tr>
                    <tr>
                      <td>Marque</td>
                      <td class="bold">D.1</td>
                      <td class="info_red">{{ vehicule.caracteristiques.marque }}</td>
                      <td>&nbsp;</td>
                      <td>Cyclindrée (cm3)</td>
                      <td class="bold">P.1</td>
                      <td class="info_red">{{ vehicule.caracteristiques.puissance.cylindres }}</td>
                    </tr>
                    <tr>
                      <td>Tvv</td>
                      <td class="bold">D.2</td>
                      <td class="info_red">{{ vehicule.caracteristiques.tvv }}</td>
                      <td>&nbsp;</td>
                      <td>Puissance nette max (kW)</td>
                      <td class="bold">P.2</td>
                      <td class="info_red">{{ vehicule.caracteristiques.puissance.nette }}</td>
                    </tr>
                    <tr>
                      <td>Nom commercial</td>
                      <td class="bold">D.3</td>
                      <td class="info_red">{{ vehicule.caracteristiques.modele }}</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td colspan="7"><div class="separator-2"></div></td>
                    </tr>
                    <tr>
                      <td>Numéro CNIT</td>
                      <td class="bold">D.2.1</td>
                      <td class="info_red">{{ vehicule.caracteristiques.cnit }}</td>
                      <td>&nbsp;</td>
                      <td>Energie</td>
                      <td class="bold">P.3</td>
                      <td class="info_red">{{ vehicule.caracteristiques.energie }}</td>
                    </tr>
                    <tr>
                      <td>Numéro d'identification véhicule</td>
                      <td class="bold">E</td>
                      <td class="info_red">{{ vehicule.caracteristiques.vin }}</td>
                      <td>&nbsp;</td>
                      <td>Puissance CV</td>
                      <td class="bold">P.6</td>
                      <td class="info_red">9</td>
                    </tr>
                    <tr>
                      <td>Couleur nuance</td>
                      <td>&nbsp;</td>
                      <td class="info_red">{{ vehicule.caracteristiques.couleur }}</td>
                      <td>&nbsp;</td>
                      <td>Puissance (kW/kg)</td>
                      <td class="bold">{{ vehicule.caracteristiques.puissance.norm }}</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td colspan="7"><div class="separator-2"></div></td>
                    </tr>
                    <tr>
                      <td>PT technique admissible (kg)</td>
                      <td class="bold">F.1</td>
                      <td class="info_red">{{ vehicule.caracteristiques.PT.admissible }}</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td>PTAC (kg)</td>
                      <td class="bold">F.2</td>
                      <td class="info_red">{{ vehicule.caracteristiques.PT.AC }}</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td>PTRA (kg)</td>
                      <td class="bold">F.3</td>
                      <td class="info_red">{{ vehicule.caracteristiques.PT.RA }}</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td colspan="7"><div class="separator-2"></div></td>
                    </tr>
                    <tr>
                      <td>PT en service (kg)</td>
                      <td class="bold">G</td>
                      <td class="info_red">{{ vehicule.caracteristiques.PT.service }}</td>
                      <td>&nbsp;</td>
                      <td>Place assises</td>
                      <td class="bold">S.1</td>
                      <td class="info_red">{{ vehicule.caracteristiques.places.assis }}</td>
                    </tr>
                    <tr>
                      <td>PTAV (kg)</td>
                      <td class="bold">G.1</td>
                      <td class="info_red">{{ vehicule.caracteristiques.PT.AV }}</td>
                      <td>&nbsp;</td>
                      <td>Pace debout</td>
                      <td class="bold">S.2</td>
                      <td>{{ vehicule.caracteristiques.places.debout }}</td>
                    </tr>
                    <tr>
                      <td colspan="7"><div class="separator-2"></div></td>
                    </tr>
                    <tr>
                      <td>Catégorie (Ce)</td>
                      <td class="bold">J</td>
                      <td class="info_red">{{ vehicule.caracteristiques.categorie }}</td>
                      <td>&nbsp;</td>
                      <td>Niveau sonore (dB(A))</td>
                      <td class="bold">U.1</td>
                      <td class="info_red">{{ vehicule.caracteristiques.db }}</td>
                    </tr>
                    <tr>
                      <td>Genre (National)</td>
                      <td class="bold">J.1</td>
                      <td class="info_red">{{ vehicule.caracteristiques.genre }}</td>
                      <td>&nbsp;</td>
                      <td>Vitesse moteur (min-1)</td>
                      <td class="bold">U.2</td>
                      <td class="info_red">{{ vehicule.caracteristiques.moteur }}</td>
                    </tr>
                    <tr>
                      <td>Carrosserie (Ce)</td>
                      <td class="bold">J.2</td>
                      <td class="info_red">{{ vehicule.caracteristiques.carrosserie.ce }}</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td>Carrosserie (National)</td>
                      <td class="bold">J.3</td>
                      <td class="info_red">{{ vehicule.caracteristiques.carrosserie.national }}</td>
                      <td>&nbsp;</td>
                      <td>CO2 (g/km)</td>
                      <td class="bold">V.7</td>
                      <td class="info_red">{{ vehicule.caracteristiques.co2 }}</td>
                    </tr>
                    <tr>
                      <td>Numéro de réception</td>
                      <td class="bold">K</td>
                      <td class="info_red">{{ vehicule.caracteristiques.reception.numero }}</td>
                      <td>&nbsp;</td>
                      <td>Classe Environnement (CE)</td>
                      <td class="bold">V.9</td>
                      <td class="info_red">{{ vehicule.caracteristiques.environnement }}</td>
                    </tr>
                    <tr>
                      <td>Type de réception</td>
                      <td>&nbsp;</td>
                      <td class="info_red">{{ vehicule.caracteristiques.reception.type }}</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
                <!-- fin tableau vehicule -->
                <!-- debut tableau controle technique -->
                <table class="table table-responsive">
                  <tbody>
                    <tr>
                      <td colspan="4"><h6>Contrôle technique</h6></td>
                    </tr>
                    <tr>
                      <td class="bold">OTC</td>
                      <td>Résultat</td>
                      <td><span class="label label-success">{{ vehicule.controle.otc.resultat }}</span></td>
                      <td>Date du contrôle</td>
                      <td class="info_red">{{ vehicule.controle.otc.date }}</td>
                      <td>Fin de validité</td>
                      <td class="info_red">{{ vehicule.controle.otc.validite }}</td>
                    </tr>
                    <tr>
                      <td class="bold">SIV</td>
                      <td>Résultat</td>
                      <td><span class="label label-warning">{{ vehicule.controle.siv.resultat }}</span></td>
                      <td>Date du contrôle</td>
                      <td class="info_red">{{ vehicule.controle.siv.date }}</td>
                      <td>Fin de validité</td>
                      <td class="info_red">{{ vehicule.controle.siv.validite }}</td>
                    </tr>
                  </tbody>
                </table>
                  <!-- fin tableau controle technique -->
                  <!-- debut mentions particuliéres -->
                <table class="table table-responsive">
                  <tbody>
                    <tr>
                      <td><h6>Mentions particulières</h6></td>
                    </tr>
                    <tr>
                      <td><div class="alert alert-info" role="alert">{{ vehicule.mentions }}</div></td>
                    </tr>
                  </tbody>
                </table>
                <!-- fin mentions particuliéres -->
              </div>
              <!-- fin vtab1 -->
              <!-- debut vtab2 -->
              <div class="tab-pane fade" id="vtab2">
                <!-- debut tableau Titulaire et co-titulaires -->
                <table class="table table-responsive">
                  <tbody>
                    <tr>
                      <td colspan="4"><h6>Titulaire et co-titulaires</h6></td>
                    </tr>
                    <tr >
                      <td>NATURE</td>
                      <td class="info_red">{{ vehicule.titulaire.nature }}</td>
                    </tr>
                    <tr>
                      <td>IDENTITE</td>
                      <td class="info_red">{{ vehicule.titulaire.identite }}</td>
                    </tr>
                    <tr>
                      <td>ADRESSE</td>
                      <td class="info_red">{{ vehicule.titulaire.adresse }}</td>
                    </tr>
                    <tr>
                      <td colspan="4"><h6>Certificat d'Immatriculation</h6></td>
                    </tr>
                    <tr>
                      <td>Date de première immatriculation</td>
                      <td class="info_red">{{ vehicule.certificat.premier }}</td>
                    </tr>
                    <tr>
                      <td>Date du CI</td>
                      <td class="info_red">{{ vehicule.certificat.courant }}</td>
                    </tr>
                    <!--
                    <tr>
                      <td>Numéro de formule</td>
                      <td class="info_red">2016CT33682</td>
                    </tr>
                    <tr>
                      <td>Etat de vol</td>
                      <td class="info_red">Aucune Information</td>
                    </tr>
                    <tr>
                      <td>Etat de perte</td>
                      <td class="info_red">Aucune Information</td>
                    </tr>
                    <tr>
                      <td>Remise de titre</td>
                      <td class="info_red">Aucune Information</td>
                    </tr>
                    <tr>
                      <td>Etat de production/distribution</td>
                      <td class="info_red">D10 - Distribué (Distribué)</td>
                    </tr>
                    -->
                  </tbody>
                </table>
                <!-- fin tableau Titulaire et co-titulaires -->
              </div>
              <!-- fin vtab2 -->
              <!-- debut vtab3 -->
              <div class="tab-pane fade" id="vtab3">
                <!-- debut tableau Titres -->
                <table class="table table-responsive">
                  <tbody>
                    <tr>
                      <td colspan="4"><h6>Certificat Provisoire d'Immatriculation</h6></td>
                    </tr>
                    <tr>
                      <td>Date du CPI</td>
                      <td class="info_red">03/12/2009</td>
                    </tr>
                    <tr>
                      <td>Date de fin de validité</td>
                      <td class="info_red">02/01/2010</td>
                    </tr>
                    <tr>
                      <td>Numéro d'émission</td>
                      <td class="info_red">10005184823</td>
                    </tr>
                    <tr>
                      <td>Duplicata</td>
                      <td class="info_red">Aucun</td>
                    </tr>
                  </tbody>
                </table>
                <!-- fin tableau Titres -->
              </div>
              <!-- fin vtab3 -->
              <!-- debut vtab4 -->
              <div class="tab-pane fade" id="vtab4">
                <div class="row">
                  <div class="col-sm-6">
                    <!-- debut tableau Situation administratvive (gages) -->
                    <table class="table table-responsive">
                      <tbody>
                        <tr>
                          <td colspan="4"><h6>Gages</h6></td>
                        </tr>
                        <tr>
                          <td class="info_red">{{ vehicule.administratif.gages }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- fin tableau gages -->
                  </div>
                  <div class="col-sm-6">
                    <!-- debut tableau oppositions -->
                    <table class="table table-responsive">
                      <tbody>
                        <tr>
                          <td colspan="4"><h6>Oppositions</h6></td>
                        </tr>
                        <tr>
                          <td class="info_red">{{ vehicule.administratif.oppositions }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- fin tableau oppositions -->
                  </div>
                  <div class="col-sm-6">
                    <!-- debut tableau suspensions -->
                    <table class="table table-responsive">
                      <tbody>
                        <tr>
                          <td colspan="4"><h6>Suspensions</h6></td>
                        </tr>
                        <tr>
                          <td class="info_red">{{ vehicule.administratif.suspensions }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- fin tableau suspensions -->
                  </div>
                  <div class="col-sm-6">
                    <!-- debut tableau procédures -->
                    <table class="table table-responsive">
                      <tbody>
                        <tr>
                          <td colspan="4"><h6>Procédures</h6></td>
                        </tr>
                        <tr>
                          <td class="info_red">{{ vehicule.administratif.procedures }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- fin tableau procédures -->
                  </div>
                  <div class="col-sm-6">
                    <!-- debut tableau véhicule -->
                    <table class="table table-responsive">
                      <tbody>
                        <tr>
                          <td colspan="4"><h6>Véhicule</h6></td>
                        </tr>
                        <tr>
                          <td>Etat de vol</td>
                          <td class="info_red">{{ vehicule.administratif.vol }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- fin tableau véhicule -->
                  </div>
                  <div class="col-sm-6">
                    <!-- debut tableau titre -->
                    <table class="table table-responsive">
                      <tbody>
                        <tr>
                          <td colspan="4"><h6>Titre</h6></td>
                        </tr>
                        <tr>
                          <td>Etat de vol</td>
                          <td class="info_red">{{ vehicule.administratif.titre.vol }}</td>
                        </tr>
                        <tr>
                          <td>Etat de perte</td>
                          <td class="info_red">{{ vehicule.administratif.titre.perte }}</td>
                        </tr>
                        <tr>
                          <td>Duplicata</td>
                          <td class="info_red">{{ vehicule.administratif.titre.duplicata }}</td>
                        </tr>
                        <tr>
                          <td>Remise du titre</td>
                          <td class="info_red">{{ vehicule.administratif.titre.remise }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- fin tableau Situation administratvive (titre) -->
                    <br>
                      <a href="#" class="btn btn-animated btn-default btn-sm">Visualiser le certificat de situation administrative détaillé <i class="fa fa-search"></i></a><a href="#" class="btn btn-animated btn-default btn-sm">Visualiser le certificat de situation administrative simple <i class="fa fa-search"></i></a>
                  </div>
                </div>
              </div>
              <!-- fin vtab4 -->
              <!-- debut vtab5 -->
              <div class="tab-pane fade" id="vtab5">
                <table class="table table-responsive">
                  <tbody>
                    <tr>
                      <td colspan="4"><h6>Historique des opérations</h6></td>
                    </tr>
                    <tr >
                      <td>Date</td>
                      <td>Nature</td>
                    </tr>
                    <tr v-for="(entry, index) in vehicule.historique"
                       :key="index"
                    >
                      <td class="info_red">{{ entry.date }}</td>  
                      <td class="info_red">{{ entry.nature }}</td>
                    </tr>
                  </tbody>
                </table>
               </div>
              <!-- fin vtab5 -->
              <!-- debut vtab6 -->
              <div class="tab-pane fade" id="vtab6"> </div>
              <!-- fin vtab6 -->
              <!-- debut vtab7 -->
              <div class="tab-pane fade" id="vtab7"> </div>
              <!-- fin vtab7 -->
            </div>
          </div>
          <!-- tabs end -->
          <!-- debut tout voir -->
          <h3 class="title"><span class="text-default">V</span>oir tout</h3>
          <p>Vous avez la possibilité de visionner tous les thèmes</p>
          <a class="btn btn-default collapsed btn-animated " data-toggle="collapse" href="#collapseContent" aria-expanded="false" aria-controls="collapseContent"> Ouvrir<i class="fa fa-plus"></i></a>
          <div class="collapse" id="collapseContent">
            <div class="row">
              <div class="col-lg-12">
                <!-- debut tableau vehicule -->
                <table class="table table-responsive">
                  <tbody>
                  <tr>
                    <td colspan="7"><h5>Caractéristiques techniques</h5></td>
                  </tr>
                  <tr>
                    <td>Marque</td>
                    <td class="bold">D.1</td>
                    <td class="info_red">{{ vehicule.caracteristiques.marque }}</td>
                    <td>&nbsp;</td>
                    <td>Cyclindrée (cm3)</td>
                    <td class="bold">P.1</td>
                    <td class="info_red">{{ vehicule.caracteristiques.puissance.cylindres }}</td>
                  </tr>
                  <tr>
                    <td>Tvv</td>
                    <td class="bold">D.2</td>
                    <td class="info_red">{{ vehicule.caracteristiques.tvv }}</td>
                    <td>&nbsp;</td>
                    <td>Puissance nette max (kW)</td>
                    <td class="bold">P.2</td>
                    <td class="info_red">{{ vehicule.caracteristiques.puissance.nette }}</td>
                  </tr>
                  <tr>
                    <td>Nom commercial</td>
                    <td class="bold">D.3</td>
                    <td class="info_red">{{ vehicule.caracteristiques.modele }}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td colspan="7"><div class="separator-2"></div></td>
                  </tr>
                  <tr>
                    <td>Numéro CNIT</td>
                    <td class="bold">D.2.1</td>
                    <td class="info_red">{{ vehicule.caracteristiques.cnit }}</td>
                    <td>&nbsp;</td>
                    <td>Energie</td>
                    <td class="bold">P.3</td>
                    <td class="info_red">{{ vehicule.caracteristiques.energie }}</td>
                  </tr>
                  <tr>
                    <td>Numéro d'identification véhicule</td>
                    <td class="bold">E</td>
                    <td class="info_red">{{ vehicule.caracteristiques.vin }}</td>
                    <td>&nbsp;</td>
                    <td>Puissance CV</td>
                    <td class="bold">P.6</td>
                    <td class="info_red">9</td>
                  </tr>
                  <tr>
                    <td>Couleur nuance</td>
                    <td>&nbsp;</td>
                    <td class="info_red">{{ vehicule.caracteristiques.couleur }}</td>
                    <td>&nbsp;</td>
                    <td>Puissance (kW/kg)</td>
                    <td class="bold">{{ vehicule.caracteristiques.puissance.norm }}</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td colspan="7"><div class="separator-2"></div></td>
                  </tr>
                  <tr>
                    <td>PT technique admissible (kg)</td>
                    <td class="bold">F.1</td>
                    <td class="info_red">{{ vehicule.caracteristiques.PT.admissible }}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>PTAC (kg)</td>
                    <td class="bold">F.2</td>
                    <td class="info_red">{{ vehicule.caracteristiques.PT.AC }}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>PTRA (kg)</td>
                    <td class="bold">F.3</td>
                    <td class="info_red">{{ vehicule.caracteristiques.PT.RA }}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td colspan="7"><div class="separator-2"></div></td>
                  </tr>
                  <tr>
                    <td>PT en service (kg)</td>
                    <td class="bold">G</td>
                    <td class="info_red">{{ vehicule.caracteristiques.PT.service }}</td>
                    <td>&nbsp;</td>
                    <td>Place assises</td>
                    <td class="bold">S.1</td>
                    <td class="info_red">{{ vehicule.caracteristiques.places.assis }}</td>
                  </tr>
                  <tr>
                    <td>PTAV (kg)</td>
                    <td class="bold">G.1</td>
                    <td class="info_red">{{ vehicule.caracteristiques.PT.AV }}</td>
                    <td>&nbsp;</td>
                    <td>Pace debout</td>
                    <td class="bold">S.2</td>
                    <td>{{ vehicule.caracteristiques.places.debout }}</td>
                  </tr>
                  <tr>
                    <td colspan="7"><div class="separator-2"></div></td>
                  </tr>
                  <tr>
                    <td>Catégorie (Ce)</td>
                    <td class="bold">J</td>
                    <td class="info_red">{{ vehicule.caracteristiques.categorie }}</td>
                    <td>&nbsp;</td>
                    <td>Niveau sonore (dB(A))</td>
                    <td class="bold">U.1</td>
                    <td class="info_red">{{ vehicule.caracteristiques.db }}</td>
                  </tr>
                  <tr>
                    <td>Genre (National)</td>
                    <td class="bold">J.1</td>
                    <td class="info_red">{{ vehicule.caracteristiques.genre }}</td>
                    <td>&nbsp;</td>
                    <td>Vitesse moteur (min-1)</td>
                    <td class="bold">U.2</td>
                    <td class="info_red">{{ vehicule.caracteristiques.moteur }}</td>
                  </tr>
                  <tr>
                    <td>Carrosserie (Ce)</td>
                    <td class="bold">J.2</td>
                    <td class="info_red">{{ vehicule.caracteristiques.carrosserie.ce }}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Carrosserie (National)</td>
                    <td class="bold">J.3</td>
                    <td class="info_red">{{ vehicule.caracteristiques.carrosserie.national }}</td>
                    <td>&nbsp;</td>
                    <td>CO2 (g/km)</td>
                    <td class="bold">V.7</td>
                    <td class="info_red">{{ vehicule.caracteristiques.co2 }}</td>
                  </tr>
                  <tr>
                    <td>Numéro de réception</td>
                    <td class="bold">K</td>
                    <td class="info_red">{{ vehicule.caracteristiques.reception.numero }}</td>
                    <td>&nbsp;</td>
                    <td>Classe Environnement (CE)</td>
                    <td class="bold">V.9</td>
                    <td class="info_red">{{ vehicule.caracteristiques.environnement }}</td>
                  </tr>
                  <tr>
                    <td>Type de réception</td>
                    <td>&nbsp;</td>
                    <td class="info_red">{{ vehicule.caracteristiques.reception.type }}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                </tbody>
                </table>
                <!-- fin tableau vehicule -->
                <!-- debut tableau controle technique -->
                <table class="table table-responsive">
                  <tbody>
                  <tr>
                    <td colspan="4"><h5>Contrôle technique</h5></td>
                  </tr>
                  <tr>
                    <td class="bold">OTC</td>
                    <td>Résultat</td>
                    <td><span class="label label-success">{{ vehicule.controle.otc.resultat }}</span></td>
                    <td>Date du contrôle</td>
                    <td class="info_red">{{ vehicule.controle.otc.date }}</td>
                    <td>Fin de validité</td>
                    <td class="info_red">{{ vehicule.controle.otc.validite }}</td>
                  </tr>
                  <tr>
                    <td class="bold">SIV</td>
                    <td>Résultat</td>
                    <td><span class="label label-warning">{{ vehicule.controle.siv.resultat }}</span></td>
                    <td>Date du contrôle</td>
                    <td class="info_red">{{ vehicule.controle.siv.date }}</td>
                    <td>Fin de validité</td>
                    <td class="info_red">{{ vehicule.controle.siv.validite }}</td>
                  </tr>
                </tbody>
                </table>
                <!-- fin tableau controle technique -->
                <!-- debut mentions particuliéres -->
                <h5>Mentions particulières</h5>
                <div class="alert alert-info" role="alert">{{ vehicule.mentions }}</div>
                <!-- fin mentions particuliéres -->
              </div>
            </div>
          </div>
          <!-- fin tout voir -->
        </div>
        <!-- main end -->
      </div>
    </div>
  </div>

  <div class="main-container" v-else>
    <div class="alert alert-info" role="alert"> Désolé, nous n'avons pas trouvé de résultat pour cette recherche</div>
  </div>
  </section>
</template>

<script>

import elasticsearchLib from 'elasticsearch'

export default {
  props: {
  },
  data () {
    return {
      plaque: 'AA-086-FS',
      vin: 'VF32M8HZA9Y044370',
      conf: [],
      elasticsearch: null,
      vehicule: {
        plaque: 'AA-555-AA',
        caracteristiques: {
          marque: 'BMW',
          tvv: '390LVG91AA',
          modele: 'Série 3',
          puissance: {
            cylindres: '1995',
            nette: '130',
            cv: '',
            norm: 'Q'
          },
          couleur: 'GRIS CLAIR',
          energie: 'GO',
          PT: {
            admissible: '1950',
            AC: '1950',
            RA: '3625',
            service: '1505',
            AV: '1430'
          },
          places: {
            assis: 5,
            debout: ''
          },
          categorie: 'M1',
          genre: 'VP',
          carrosserie: {
            ce: 'AA',
            national: 'CI'
          },
          cnit: 'MBM5752C9489',
          vin: 'WBAVG91040A347052',
          reception: {
            numero: 'e1*2001/116*0308*08',
            type: 'CE'
          },
          db: '73',
          moteur: '3000',
          co2: '128',
          environnement: '70/220*2003/76EURO4'
        },
        controle: {
          otc: {
            resultat: 'Accepté',
            date: '21/04/2016',
            validite: '20/04/2018'
          },
          siv: {
            resultat: 'Refusé',
            date: '21/04/2016',
            validite: '20/04/2018'
          }
        },
        mentions: 'Aucun élément dans la liste.',
        titulaire: {
          nature: 'Titulaire',
          identite: 'PRBUISNESS 123456789',
          adresse: '38, avenue Guy Mocquet, 75000 Paris'
        },
        certificat: {
          premier: '16/06/2008',
          courant: '17/06/2016'
        },
        administratif: {
          gages: 'Aucun gage',
          oppositions: 'Aucune oppoistion',
          suspensions: 'Aucune suspension',
          procedures: 'Aucune procédure',
          vol: 'non volé',
          titre: {
            vol: 'Aucune information',
            perte: 'Aucune information',
            duplicata: 'Aucun',
            remise: 'Aucune information'
          }
        },
        historique: [
          {date: '17/06/2008', nature: 'Première immatriculation'},
          {date: '21/01/2009', nature: 'Achat'},
          {date: '23/10/2009', nature: 'Achat'},
          {date: '18/11/2009', nature: 'Déclaration de Réimmatriculation à l\'étranger'},
          {date: '03/12/2009', nature: 'Changement de titulaire et réimmatriculation France'},
          {date: '17/06/2016', nature: 'Changement de titulaire'}
        ]
      }
    }
  },
  computed: {
    orderedProjects () {
      return this.$lodash.sortBy(this.projects)
    }
  },
  created () {
    this.elasticsearch = {
      connection: {
        host: window.location.host
      }
    }
    this.esClient = new elasticsearchLib.Client(this.elasticsearch.connection)
    this.esClient.search({
      index: 'siv',
      size: 1,
      body: {
        query: {
          match: {
            id: this.$route.query.id
          }
        }
      }
    }).then(response => {
      response = response.hits.hits[0]
      this.vin = response.cveh_num_identif
      this.vehicule.caracteristiques.vin = response._source.cveh_num_identif
      this.plaque = response._source.info_num_plaque
      this.vehicule.plaque = response._source.info_num_plaque
      this.vehicule.caracteristiques.places.assis = response._source.ctec_places_assises
      this.vehicule.caracteristiques.marque = response._source.ctec_marque
      this.vehicule.caracteristiques.modele = response._source.ctec_denom_com
      this.vehicule.certificat.premier = response._source.dos_date_prem_immat
      this.display = true
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
