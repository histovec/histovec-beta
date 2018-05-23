<template>
<section id="result">
  <!-- breadcrumb start -->
  <div class="breadcrumb-container">
    <div class="container">
      <ol class="breadcrumb">
        <li><i class="fa fa-home pr-10"></i><a href="/search">Accueil</a></li>
        <li class="active">Résultats</li>
      </ol>
    </div>
  </div>
  <!-- breadcrumb end -->
  <!-- main-container start -->

  <div class="container" v-if="this.result === 'ok'">
    <div class="row">
      <div class="col-lg-12 mb-20">
        <!-- debut vignette -->
        <div class="row">
          <div class="col-sm-5">
            <div class="alert alert-icon alert-info" role="alert"> <i class="fa fa-window-maximize"></i> Numéro - Plaque d'immatriculation : {{ v.plaque }}</div>
          </div>
          <div class="col-sm-5" v-if="beta">
            <div class="alert alert-icon alert-3" role="alert"> <i class="fa fa-info-circle"></i> Vignette Crit'Air - Tous les véhicules <span class="txt-small">100% électrique et hydrogènes</span> </div>
          </div>
          <div class="col-sm-2" v-if="beta"><img class="img-responsive" src="assets/images/vignettes_crit_air/petit/vignette_3.png"></div>
        </div>
        <!-- fin vignette -->
        <!-- debut trait séparation -->
        <div class="separator-2"></div>
        <!-- fin trait séparation -->
        <!-- debut nouvelle info -->
        <!-- Tabs start -->
        <div class="vertical">
          <!-- Nav tabs -->
          <ul class="nav nav-tabs" role="tablist">
            <li class="active"><a href="#vtab1" role="tab" data-toggle="tab"><i class="fa fa-refresh pr-10"></i> Synthèse</a></li>
            <li><a href="#vtab2" role="tab" data-toggle="tab"><i class="fa fa-car pr-10"></i>Véhicule</a></li>
            <li><a href="#vtab3" role="tab" data-toggle="tab"><i class="fa fa-address-card pr-10"></i>Titulaire & Titre</a></li>
            <li><a href="#vtab4" role="tab" data-toggle="tab"><i class="fa fa-clipboard pr-10"></i> Situation administrative</a></li>
            <li><a href="#vtab5" role="tab" data-toggle="tab"><i class="fa fa-calculator pr-10"></i> Historique des opérations </a></li>
            <li v-if="$route.query.code !== undefined"><a href="#vtab6" role="tab" data-toggle="tab"><i class="fa fa-send pr-10"></i> Transmettre le rapport</a></li>
          </ul>
          <!-- Tab panes -->
          <div class="tab-content">
            <!-- /* ----------------- debut synthese ----------------- */ -->
            <div class="tab-pane fade in active" id="vtab1">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-7">
                    <h6 class="title p-h-35">Résumé</h6>
                    <p class="small"> information du ministère de l'Intérieur au {{ v.date_update }}</p>
                  </div>
                  <div class="col-md-4 alert alert-icon alert-info" role="alert"> <i class="fa fa-user-circle-o blink_me"></i>Conseils pour l'acheteur </div>
                </div>
                <div class="row">
                  <!-- debut voiture  -->
                  <div class="col-sm-1"><i class="fa fa-car fa-2x"></i></div>
                  <div class="col-sm-6"><span class="info_red txt-small-13">{{ v.ctec.marque }} {{ v.ctec.modele }}</span></br>
                    <span class="txt-small-13">Puissance fiscale :</span> <span class="info_red bold txt-small-13">{{ v.ctec.puissance.cv }} ch</span> </div>
                    <div class="col-sm-5"><a href="https://siv.interieur.gouv.fr/map-usg-ui/do/simtax_accueil" class="btn-sm-link pop color-info_2 bold_4 txt-small-12 no-padding" data-container="body" data-toggle="popover" data-placement="top" data-content="Calculez le montant de votre certificat d'immatriculation" data-original-title="Simulateur" title="Simulateur" target="_blank">Simulateur de calcul<i class="fa fa-external-link pl-10"></i></a></div>
                    <!-- fin voiture  -->
                </div>
                  <!-- debut trait separation  -->
                <div class="separator-2"></div>
                  <!-- fin trait separation  -->
                <div class="row">
                    <!-- debut proprietaire  -->
                  <div class="col-sm-1"><i class="fa fa-address-card fa-2x pr-10"></i></div>
                  <div class="col-sm-6"><span class="txt-small-13">Propriétaire actuel : </span><span class="info_red txt-small-13">{{ v.titulaire.identite }} depuis {{ v.certificat.depuis }} ans</span><br/>
                    <span class="txt-small-13">En acquérant ce véhicule vous serez le</span> <span class="info_red txt-small-13">{{ v.nb_proprietaires + 1 }}</span><sup class="info_red txt-small">ème</sup> propriétaire</div>
                  <div class="col-sm-5"></div>
                  <!-- fin proprietaire  -->
                </div>
                <!-- debut trait separation  -->
                <div class="separator-2"></div>
                <!-- fin trait separation  -->
                <div class="row">
                  <!-- debut immatriculation  -->
                  <div class="col-sm-1"><i class="fa fa-calendar fa-2x pr-10"></i></div>
                  <div class="col-sm-6"><span class="txt-small-13">Première immatriculation le</span> <span class="info_red txt-small-13">{{ v.certificat.premier }}</span><br/><br/></div>
                  <div class="col-sm-5"></div>
                  <!-- fin immatriculation  -->
                </div>
                <!-- debut trait separation  -->
                <div class="separator-2"></div>
                <!-- fin trait separation  -->
                <div v-if="false">
                  <div class="row">
                    <!-- debut releve  -->
                    <div class="col-sm-1"><i class="fa fa-arrows-h fa-2x pr-10"></i></div>
                    <div class="col-sm-6"><span class="info_red txt-small-13">48.210 km</span> <span class="txt-small-13">Relevé au dernier contrôle technique du</span> <span class="info_red txt-small-13">21/04/2016</span> </div>
                    <div class="col-sm-5"><span class="color-info_2 bold_4 txt-small-13">Un contrôle technique de moins de 6 mois doit être fourni</span></div>
                    <!-- fin releve  -->
                  </div>
                  <!-- debut trait separation  -->
                  <div class="separator-2" v-if="false"></div>
                  <!-- fin trait separation  -->
                </div>
                <div v-if="v.etranger !== 'NON'">
                  <div class="row">
                    <!-- debut immatriculer  -->
                    <div class="col-sm-1"><i class="fa fa fa-globe fa-2x pr-10"></i></div>
                    <div class="col-sm-6"><span class="txt-small-13">Ce véhicule a été</span> <span class="info_red txt-small-13">importé</span> </div>
                    <div class="col-sm-5"><span class="color-info_2 bold_4 txt-small-13">Vérifier les options incluses qui peuvent être différentes</span></div>
                    <!-- fin immatriculer  -->
                  </div>
                  <!-- debut trait separation  -->
                  <div class="separator-2"></div>
                  <!-- fin trait separation  -->
                </div>
                <div v-if="v.sinistre !== false">
                  <div class="row">
                    <!-- debut sinistre  -->
                    <div class="col-sm-1"><i :class="[{'fa fa-thumbs-up fa-2x pr-10' : v.apte !== false},
                                 {'fa fa-exclamation-triangle info_red fa-2x pr-10' : v.apte === false}]"></i></div>
                    <div class="col-sm-6"><span class="txt-small-13">Ce véhicule a eu </span> <span class="info_red txt-small-13">un sinistre déclaré</span> <span class="txt-small-13">en {{v.sinistre}}</span></br>
                      <span v-if="v.apte !== false"> <span class="txt-small-13">et</span> <span class="info_red txt-small-13">déclaré apte à circuler</span> <span class="txt-small-13">en {{v.apte}}</span></span></div>
                    <div class="col-sm-5"><span class="color-info_2 bold_4 txt-small-13">{{ synthese.ove.adv }}</span></div>
                    <!-- fin sinistre  -->
                  </div>
                  <!-- debut trait separation  -->
                  <div class="separator-2"></div>
                  <!-- fin trait separation  -->
                </div>
                <div v-if="(v.administratif.synthese.length === 0) && (this.v.sinistre === false)">
                  <div class="row">
                    <!-- debut ras  -->
                    <div class="col-sm-1"><i class="fa fa-clipboard fa-2x"></i></div>
                    <div class="col-sm-6"><span class="info_red txt-small-13">Rien à signaler</span> <span class="txt-small-13">du point de vue administratif</br>
                          (gages, opposition, vol,...)</span> </div>
                    <div class="col-sm-5"><span class="color-info_2 bold_4 txt-small-13">Demander au Vendeur un Certificat de Situation Administratif détaillé</span></div>
                    <!-- fin ras  -->
                  </div>
                  <!-- debut trait separation  -->
                  <div class="separator-2"></div>
                  <!-- fin trait separation  -->
                </div>
                <div v-for="(entry, index) in v.administratif.synthese" :key="index">
                  <div class="row info_red">
                    <div class="col-sm-1"><i class="fa fa-2x pr-10" :class="synthese[entry].icon"></i></div>
                    <div class="col-sm-6 txt-small-13"> {{ synthese[entry].text }} </div>
                    <div class="col-sm-5 color-info_2 bold_4 txt-small-13"> {{ synthese[entry].adv }}
                      <br/><a class="btn-sm-link pop color-info_2 bold_4 txt-small-12 no-padding" v-if="synthese[entry].link !== undefined" :href="synthese[entry].link"> En savoir plus <i class="fa fa-external-link pl-5"></i> </a>
                    </div>
                  </div>
                  <!-- debut trait separation  -->
                  <div class="separator-2"></div>
                  <!-- fin trait separation  -->
                </div>
              </div>
            </div>
            <!-- /* ----------------- fin synthese ----------------- */ -->
            <!-- /* ----------------- debut vehicule ----------------- */ -->
            <div class="tab-pane fade pr-20" id="vtab2">
              <div class="row">
                <div class="col-md-12">
                  <h6 class="title">Caractéristiques techniques</h6>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Marque</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">D.1</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.marque }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Tvv</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">D.2</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.tvv }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Nom commercial</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">D.3</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.modele }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Numéro CNIT</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">D.2.1</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.cnit }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Couleur</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">&nbsp;</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.couleur }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Type de reception</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">&nbsp;</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">CE</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <td class="no-trait-left no-trait-right" colspan="3">&nbsp;</td>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Numéro d'identification véhicule</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">E</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.vin }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <td colspan="3">&nbsp;</td>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">PT technique admissible (kg)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">F.1</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.PT.admissible }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">PTAC (kg)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">F.2</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.PT.AC }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">PTRA (kg)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">F.3</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.PT.RA }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <td colspan="3">&nbsp;</td>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">PT en service (kg)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">G</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.PT.service }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">PTAV (kg)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">G.1</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.PT.AV }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <td colspan="3">&nbsp;</td>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Catégorie (Ce)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">J</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.categorie }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Genre (National)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">J.1</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.genre }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Carrosserie (Ce)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">J.2</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.carrosserie.ce }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Carrosserie (National)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">J.3</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.carrosserie.national }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <td colspan="3">&nbsp;</td>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Numéro de réception</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">K</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.reception.numero }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <td colspan="3">&nbsp;</td>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Cylindrée (cm3)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">P.1</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.puissance.cylindres }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Puissance nette max (kW)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">P.2</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.puissance.nette }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Energie</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">P.3</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.energie }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Puissance CV</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">P.6</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.puissance.cv }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <td colspan="3">&nbsp;</td>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Puissance / masse (kW/kg)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">Q</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.puissance.norm }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <td colspan="3">&nbsp;</td>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Places assises</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">S.1</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.places.assis }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Pace debout</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">S.3</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.places.debout }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <td colspan="3">&nbsp;</td>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Niveau sonore (db(A))</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">U.1</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.db }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Vitesse moteur (min-1)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">U.2</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.moteur }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <td colspan="3">&nbsp;</td>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">CO2 (g/km)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">V.7</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.co2 }}</span></div>
              </div>
              <div class="separator"></div>
              <div class="row">
                <div class="col-sm-6"><span class="txt-small-12">Classe environnement (CE)</span></div>
                <div class="col-sm-2"><span class="bold txt-small-12">V.9</span></div>
                <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.ctec.environnement }}</span></div>
              </div>
              <div class="separator"></div>
              <!-- fin tableau v.-->
              <!-- debut tableau controle technique -->
              <!-- <table class="table table-striped table-responsive" v-if="beta">
                <tbody>
                  <tr>
                    <td colspan="4">
                      <h6>Contrôle technique</h6></td>
                  </tr>
                  <tr>
                    <div class="col-sm-2"><span class="bold txt-small-12">OTC</span></div>
                    <div class="col-sm-6"><span class="txt-small-12">Résultat</span></div>
                    <div class="col-sm-6"><span class="txt-small-12"><span class="label label-success">{{ v.controle.otc.resultat }}</span></span></div>
                    <div class="col-sm-6"><span class="txt-small-12">Date du contrôle</span></div>
                    <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.controle.otc.date }}</span></div>
                    <div class="col-sm-6"><span class="txt-small-12">Fin de validité</span></div>
                    <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.controle.otc.validite }}</span></div>
                  </tr>

                  <tr>
                    <div class="col-sm-2"><span class="bold txt-small-12">SIV</span></div>
                    <div class="col-sm-6"><span class="txt-small-12">Résultat</span></div>
                    <div class="col-sm-6"><span class="txt-small-12"><span class="label label-warning">{{ v.controle.siv.resultat }}</span></span></div>
                    <div class="col-sm-6"><span class="txt-small-12">Date du contrôle</span></div>
                    <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.controle.siv.date }}</span></div>
                    <div class="col-sm-6"><span class="txt-small-12">Fin de validité</span></div>
                    <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.controle.siv.validite }}</span></div>
                  </tr>

                </tbody>
              </table> -->
              <!-- fin tableau controle technique -->
              <!-- debut mentions particuliéres : à supprimer ultérieurement ? selon validation comité Histovec -->
              <!-- <table class="table table-striped table-responsive">
                <tbody>
                  <div class="row">
                    <td>
                      <h6>Mentions particulières</h6></td>
                  </div>
                  <div class="separator"></div>

                  <div class="row">
                    <td>
                      <div class="alert alert-info" role="alert">{{ v.mentions }}</div>
                    </td>
                  </div>
                  <div class="separator"></div>

                </tbody>
              </table> -->
              <!-- fin mentions particuliéres -->
            </div>
            <div class="tab-pane fade" id="vtab3">
              <h6 class="title">Titulaire</h6>
              <!-- debut titulaire et co-titulaire -->
              <div class="row">
                <div class="col-sm-5"><span class="txt-small-12">Nature</span></div>
                <div class="col-sm-7"><span class="txt-small-12">{{ v.titulaire.nature }}</span></div>
              </div>
              <div class="separator"></div>

              <div class="row">
                <div class="col-sm-5"><span class="txt-small-12">Identité</span></div>
                <div class="col-sm-7"><span class="info_red txt-small-12">{{ v.titulaire.identite }}</span></div>
              </div>
              <div class="separator"></div>

              <div class="row">
                <div class="col-sm-5"><span class="txt-small-12">Code Postal</span></div>
                <div class="col-sm-7"><span class="info_red txt-small-12">{{ v.titulaire.adresse }}</span></div>
              </div>
              <div class="separator"></div>
              <!-- fin tableau titulaire et co-titulaire -->
              <h6 class="title">Carte grise</h6>
              <!-- debut tableau carte grise -->
              <div class="row">
                <div class="col-sm-5"><span class="txt-small-12">Date de première immatriculation</span></div>
                <div class="col-sm-7"><span class="info_red txt-small-12">{{ v.certificat.premier }}</span></div>
              </div>
              <div class="separator"></div>

              <div class="row">
                <div class="col-sm-5"><span class="txt-small-12">Date de la carte grise actuelle</span></div>
                <div class="col-sm-7"><span class="info_red txt-small-12">{{ v.certificat.courant }}</span></div>
              </div>
              <div class="separator"></div>
              <!-- debut tableau situation administrative -->
            </div>
            <div class="tab-pane fade" id="vtab4">
              <div class="row">
                <div class="col-sm-6">
                  <h6 class="title">Gages</h6>
                  <!-- debut tableau gages -->
                  <div class="col-sm-5"><span class="info_red txt-small-12">{{ v.administratif.gages }}</span>
                    <div class="separator-2"></div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <h6 class="title">Oppositions</h6>
                  <!-- debut tableau oppositions -->
                  <div class="col-sm-5"><span class="info_red txt-small-12">{{ v.administratif.oppositions }}</span>
                    <div class="separator-2"></div>
                  </div>
                  <!-- fin tableau oppositions -->
                </div>
                <div class="col-sm-6">
                  <h6 class="title">Suspensions</h6>
                  <!-- debut tableau suspensions -->
                  <div class="col-sm-5"><span class="info_red txt-small-12">{{ v.administratif.suspensions }}</span>
                    <div class="separator-2"></div>
                  </div>
                  <!-- fin tableau suspensions -->
                </div>
                <div class="col-sm-6">
                  <h6 class="title">Procédures</h6>
                  <!-- debut tableau procédures -->
                  <div class="col-sm-5"><span class="info_red txt-small-12">{{ v.administratif.procedures }}</span>
                    <div class="separator"></div>
                  </div>
                  <!-- fin tableau procédures -->
                </div>
                <div class="col-sm-6">
                  <h6 class="title">Véhicule</h6>
                  <!-- debut tableau véhicule -->
                  <div class="col-sm-4"><span class="txt-small-12">Etat de vol</span></div>
                  <div class="col-sm-3"><span class="info_red txt-small-12">{{ v.administratif.vol }}</span></div>
                  <!-- fin tableau véhicule -->
                </div>
                <div class="col-sm-6">
                  <h6 class="title">Etat de la carte grise</h6>
                  <!-- debut tableau titre -->
                  <div class="col-sm-5"><span class="txt-small-12">Etat de vol</span></div>
                  <div class="col-sm-5"><span class="info_red txt-small-12">{{ v.administratif.titre.vol }}</span></div>
                  <div class="col-sm-5"><span class="txt-small-12">Etat de perte</span></div>
                  <div class="col-sm-5"><span class="info_red txt-small-12">{{ v.administratif.titre.perte }}</span></div>
                  <div class="col-sm-5"><span class="txt-small-12">Duplicata</span></div>
                  <div class="col-sm-5"><span class="info_red txt-small-12">{{ v.administratif.titre.duplicata }}</span></div>
                </div>
            <!-- <div class="row">
                      <div class="col-sm-6"><span class="txt-small-12">Remise du titre</span></div>
                      <div class="col-sm-4"><span class="info_red txt-small-12">{{ v.administratif.titre.remise }}</span></div>
                    </div>
                  <div class="separator"></div>
 -->
              <!-- debut bouton imprimer csa detaille -->
                <div class="col-sm-12">
                  <button type="button" class="btn btn-animated btn-default btn-sm marg_but pop" data-container="body" data-toggle="popover" data-placement="top" data-content="Le certificat de situation administrative (CSA) est un document délivré par le ministère de l'Intérieur contenant des éléments d'information sur la situation administrative d'un véhicule.<br>Le CSA détaillé fait apparaître l'ensemble des informations relatives à la situation du véhicule."
                  data-original-title="CSA" title="CSA"> Imprimer CSA détaillé<i class="fa fa-print"></i> </button>
                </div>
              <!-- fin bouton imprimer csa detaille -->
              </div>
            </div>
            <div class="tab-pane fade" id="vtab5">
              <!-- debut tableau operation historique -->
              <div class="row">
                <div class="col-sm-4"><span class="txt-small-12"><h6>Date</h6></span></div>
                <div class="col-sm-8"><span class="bold txt-small-12"><h6>Opération</h6></span></div>
              </div>
              <div class="separator"></div>

              <div v-for="(entry, index) in v.historique" :key="index">
                <div class="row">
                  <div class="col-sm-4"><span class="txt-small-12">{{ entry.date }}</span></div>
                  <div class="col-sm-8"><span class="info_red txt-small-12">{{ entry.nature }}</span></div>
                </div>
                <div class="separator pv-5"></div>
              </div>
              <!-- fin tableau operation historique -->
            </div>
            <div class="tab-pane fade" id="vtab6" v-if="$route.query.code !== undefined">
              <div class="pv-30 ph-20 feature-box bordered_spec text-center" style="background: white">
                <div class="row">
                  <div class="col-md-12 p-h-10">
                    <p>Vous pouvez transmettre à votre acheteur potentiel, le rapport que vous venez de consulter par mail, sms.<br>
                      Ce rapport cera accessible <b> 4 semaines </b> à partir de l'envoi. <br>
                    <p class="text-center">
                      <button v-clipboard:copy="url" class="btn radius-30 btn-dark btn-animated btn">Copier <i class="fa fa-copy"></i></button>
                      <a :href="'mailto:?subject=Rapport%20Histovec&body=' + mailBody" class="btn radius-30 btn-default btn-animated btn">Courriel <i class="fa fa-send"></i></a>
                      <a :href="'sms://?body=' + smsBody" class="btn radius-30 btn-dark btn-animated btn">Texto <i class="fa fa-mobile fa-2x"></i></a>
                    </p>
                  </div>
                  <div class="row">
                    <div class="col-md-12">Ou par QR code </div>
                  </div>
                  <div class="separator"></div>
                  <div class="row">
                    <div class="col-md-12" style="fload: none; margin: 0 auto">
                      <qrcode-vue :value="url" :size="150" level="L"></qrcode-vue>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <!-- tabs end -->
        <!-- debut trait de séparation -->
        <hr class="style1">
        <!-- fin trait de séparation -->
      </div>
    </div>
    <!-- row -->
  </div>
  <!-- container -->

  <div class="container" v-if="this.result === 'wait'">
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-info text-center" role="alert">  Recherche en cours <i class="fa fa-spinner fa-spin"></i> </div>
      </div>
    </div>
  </div>



  <div class="container" v-if="this.result === 'ko'">
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-icon alert-danger" role="alert"> <i class="fa fa-warning"></i> Désolé, nous n'avons pas trouvé de résultat pour cette recherche</div>
      </div>
    </div>
  </div>
</section>
</template>

<script>

import CryptoJS from 'crypto-js'
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue
  },
  data () {
    return {
      synthese: {
        'ove': {
          'icon': 'fa-exclamation-triangle',
          'text': 'Ce véhicule a eu un sinistre déclaré',
          'adv': 'Demander le rapport d\'expert et la(es) facture(s)',
          'link': 'https://www.service-public.fr/particuliers/vosdroits/F1473'
        },
        'otci': {
          'icon': 'fa-exclamation-triangle',
          'text': 'Le certificat fait l\'objet d\'une opposition temporaire (non lié à un sinistre)',
          'adv': 'Ce véhicule pourra être vendu après levée de l\'opposition',
          'link': 'https://www.service-public.fr/particuliers/vosdroits/F34107'
        },
        'suspension': {
          'icon': 'fa-minus-circle',
          'text': 'L\'autorisation de circulation de ce véhicule a été suspendue',
          'adv': 'Une levée de suspension est nécessaire pour sa remise en circulation',
          'link': 'https://www.service-public.fr/particuliers/vosdroits/F1754'
        },
        'perte_ci': {
          'icon': 'fa-exclamation-triangle',
          'text': 'La carte grise a fait l\'objet d\'une déclaration de perte',
          'adv': 'La carte grise doit porter la mention "Duplicata" et la date'
        },
        'annulation_ci': {
          'icon': 'fa-minus-circle',
          'text': 'La carte grise a été annulée',
          'adv': 'Ce véhicule ne peut pas être vendu en l\'état'
        },
        'vehicule_vole': {
          'icon': 'fa-minus-circle',
          'text': 'Le véhicule fait l\'objet d\'un signalement pour vol et ne peut être vendu en l\'état',
          'adv': 'Le signalement doit être vérifié dans les plus brefs délais avec le commissariat le plus proche'
        },
        'ci_vole': {
          'icon': 'fa-exclamation-triangle',
          'text': 'La carte grise a fait l\'objet d\'une déclaration de vol',
          'adv': 'Demandez la déclaration de vol. La carte grise fournie doit porter la mention "Duplicata" et la date'
        },
        'saisie': {
          'icon': 'fa-minus-circle',
          'text': 'Le véhicule est saisi',
          'adv': 'Seule une mainlevée du créancier ou un juge peut permettre la vente de ce véhicule'
        },
        'gage': {
          'icon': 'fa-exclamation-triangle',
          'text': 'Le véhicule est gagé',
          'adv': 'Un véhicule gagé peut être acheté, avec transfert du gage'
        },
        'duplicata': {
          'icon': 'fa-copy',
          'text': 'La carte grise est un duplicata',
          'adv': 'La carte grise doit porter la mention "Duplicata" et la date'
        }
      },
      plaque: 'A*-0**-F*',
      vin: 'VF32M******44370',
      result: 'wait',
      conf: [],
      v: {
        date_update: '10/05/2018',
        nb_proprietaires: 3,
        plaque: 'A*-0**-F*',
        etranger: true,
        sinistre: '2012',
        apte: 'avril 2012',
        ctec: {
          marque: 'BMW',
          tvv: 'MBM5752C9489',
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
          vin: 'VF32M******44370',
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
          identite: 'P******* 123***789',
          adresse: '75000'
        },
        certificat: {
          premier: '16/06/2008',
          courant: '17/06/2016',
          depuis: 9
        },
        administratif: {
          synthese: false,
          gages: 'Aucun gage',
          oppositions: 'Aucune opposition',
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
          {date: '01/02/2012', nature: 'Déclaration, expert no 000000-VE Véhicule techniquement réparable Procédure : Véhicule à réparations contrôlées (VRC)'},
          {date: '03/03/2012', nature: '1er rapport, expert no 000000-VE Véhicule techniquement réparable'}
        ]
      }
    }
  },
  computed: {
    mailBody () {
      var text = encodeURI('Un titulaire de véhicule vous transmet un rapport HistoVec\n\nRendez-vous sur le lien suivant pour le consulter: \n')
      return text + this.url.replace('&', '%26')
    },
    smsBody () {
      var text = encodeURI('Un titulaire de véhicule vous transmet un rapport HistoVec.\n\nRendez-vous sur le lien suivant pour le consulter: \n')
      return text + this.url.replace('&', '%26')
    },
    url () {
      return window.location.protocol + '//' + window.location.host + '/report?id=' + this.$route.query.code + '&key=' + this.$route.query.key
    }
  },
  methods: {
    decrypt (key, encrypted) {
      key = CryptoJS.enc.Base64.parse(key)
      var rawData = atob(encrypted)
      let iv = CryptoJS.enc.Base64.parse(btoa(rawData.substring(0, 16)))
      encrypted = btoa(rawData.substring(16))
      var decrypted = CryptoJS.AES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(encrypted),
        salt: ''
      },
        key, {
          iv: iv,
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        })
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
    },
    formatDate (isoDate) {
      let date = new Date(isoDate)
      let mm = date.getMonth() + 1 // getMonth() is zero-based
      let dd = date.getDate()

      return [(dd > 9 ? '' : '0') + dd,
        (mm > 9 ? '' : '0') + mm,
        date.getFullYear()
      ].join('/')
    },
    histoFilter (historique) {
      return historique.filter(event => this.operations[event.opa_type] !== undefined).map(event => {
        return {'date': this.formatDate(event.opa_date), 'nature': this.operations[event.opa_type]}
      })
    }
  },
  created () {
    this.$http.get(this.apiUrl + 'id/' + this.$route.query.id)
      .then(response => {
        console.log(response)
        if (response.body.hits.hits.length === 0) {
          this.result = 'ko'
          return
        }
        var encrypted = response.body.hits.hits[0]._source.v.replace(/-/g, '+').replace(/_/g, '/')
        var key = this.$route.query.key.replace(/-/g, '+').replace(/_/g, '/')
        var veh = this.decrypt(key, encrypted)
        console.log(veh)
        this.vin = veh.vin
        this.v.ctec.vin = veh.vin
        this.plaque = veh.plaq_immat
        this.v.plaque = veh.plaq_immat
        this.v.ctec.couleur = veh.couleur
        this.v.ctec.cnit = veh.num_cnit
        this.v.ctec.tvv = veh.tvv
        this.v.ctec.reception.type = veh.type_reception
        this.v.ctec.reception.numero = veh.cveh_num_reception
        this.v.ctec.puissance.cylindres = veh.CTEC_CYLINDREE
        this.v.ctec.puissance.nette = veh.CTEC_PUISS_NETTE
        this.v.ctec.puissance.cv = veh.CTEC_PUISS_CV
        this.v.ctec.puissance.norm = veh.CTEC_RAPPORT_PUIS_MASSE
        this.v.ctec.places.assis = veh.CTEC_PLACES_ASSISES
        this.v.ctec.places.debout = veh.CTEC_PLACES_DEBOUT
        this.v.ctec.db = veh.CTEC_NIVEAU_SONORE
        this.v.ctec.co2 = veh.CTEC_CO2
        this.v.ctec.moteur = veh.CTEC_VITESSE_MOTEUR
        this.v.ctec.marque = veh.marque
        this.v.ctec.modele = veh.nom_commercial
        this.v.ctec.genre = veh.CTEC_RLIB_GENRE
        this.v.ctec.categorie = veh.CTEC_RLIB_CATEGORIE
        this.v.ctec.carrosserie.national = veh.CTEC_RLIB_CARROSSERIE_NAT
        this.v.ctec.carrosserie.ce = veh.CTEC_RLIB_CARROSSERIE_CE
        this.v.ctec.environnement = veh.CTEC_RLIB_POLLUTION
        this.v.ctec.energie = veh.CTEC_RLIB_ENERGIE
        this.v.ctec.PT.admissible = veh.pt_tech_adm_f1
        this.v.ctec.PT.AC = veh.ptac_f2
        this.v.ctec.PT.RA = veh.ptra_f3
        this.v.ctec.PT.service = veh.pt_service_g
        this.v.ctec.PT.AV = veh.ptav_g1

        this.v.titulaire.identite = [veh.pers_raison_soc_tit, veh.pers_siren_tit, veh.pers_nom_naissance_tit, veh.pers_prenom_tit].join(' ')
        this.v.titulaire.adresse = veh.adr_code_postal_tit
        this.v.certificat.premier = veh.date_premiere_immat
        this.v.certificat.courant = veh.date_ci
        this.v.certificat.depuis = veh.duree_dernier_prop

        this.v.historique = this.histoFilter(veh.historique)
        this.v.nb_proprietaires = veh.nb_proprietaire
        this.v.age_veh = veh.age_annee

        this.v.administratif.gages = veh.gage
        this.v.administratif.suspensions = (veh.suspension === 'NON') ? ((veh.suspension === 'NON') ? 'NON' : 'certificat annulé') : ((veh.annulation_ci === 'NON') ? 'certificat suspendu' : 'certificat suspendu et annulé') // mapping à valider
        // opposition et procédure à valider
        this.v.administratif.oppositions = (veh.ove === 'NON') ? ((veh.otci === 'NON') ? 'NON' : 'opposition temporaire') : ((veh.otci === 'NON') ? 'véhicule endommagé' : 'opposition temporaire, véhicule endommagé') // mapping à valider
        // pour l'instant aucun véhicule saisi dans les échantillons
        this.v.administratif.procedures = (veh.saisie === 'NON') ? ((veh.gage === 'NON') ? 'NON' : 'véhicule gagé') : ((veh.annulation_ci === 'NON') ? 'véhicule saisi' : 'véhicule gagé et saisi') // mapping à valider
        this.v.administratif.vol = veh.vehicule_vole

        // vol : les informations viennent-elles de foves ?
        this.v.administratif.titre.vol = veh.ci_vole
        this.v.administratif.titre.perte = veh.perte_ci
        this.v.administratif.titre.duplicata = (veh.perte_ci === 'OUI') ? 'OUI' : veh.duplicata

        this.v.administratif.synthese = [ 'otci', 'saisie', 'vehicule_vole', 'gage', 'suspension', 'perte_ci', 'ci_vole', 'annulation_ci', 'duplicata' ].filter(e => veh[e] === 'OUI')

        this.v.etranger = (veh.import === 'NON') ? 'NON' : [veh.import, veh.imp_imp_immat, veh.pays_import]
        // ci-dessous : interprétation à confirmer
        this.v.sinistre = veh.historique.some(e => e.opa_type === 'INSCRIRE_OVE') ? veh.historique.filter(e => e.opa_type === 'INSCRIRE_OVE').map(e => e.opa_date.replace(/.*\//, ''))[0] : false
        this.v.apte = veh.historique.some(e => e.opa_type === 'LEVER_OVE') ? veh.historique.filter(e => e.opa_type === 'LEVER_OVE').map(e => e.opa_date.replace(/.*\//, ''))[0] : false

        this.result = 'ok'
      }
    )
    if (this.$route.query.id === 'test') {
      this.result = 'ok'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
