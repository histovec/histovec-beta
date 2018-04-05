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
  <div class="container" v-if="this.display">
   <div class="row">
      <div class="col-lg-12 mb-20">
        <!-- debut vignette -->
        <div class="row">
          <div class="col-sm-5">
            <div class="alert alert-icon alert-info" role="alert"> <i class="fa fa-window-maximize"></i> Numéro - Plaque d'immatriculation : {{ v.plaque }}</div>
          </div>
          <div class="col-sm-5">
            <div class="alert alert-icon alert-3" role="alert"> <i class="fa fa-info-circle"></i> Vignette Crit'Air - Tous les véhicules <span class="txt-small">100% électrique et hydrogènes</span> </div>
          </div>
          <div class="col-sm-2"><img class="img-responsive" src="assets/images/vignettes_crit_air/petit/vignette_3.png"></div>
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
            <li class="active"><a href="#vtab1" role="tab" data-toggle="tab"><i class="fa fa-car pr-10"></i>Véhicule</a></li>
            <li><a href="#vtab2" role="tab" data-toggle="tab"><i class="fa fa-address-card pr-10"></i>Titulaire & Titre</a></li>
            <li><a href="#vtab3" role="tab" data-toggle="tab"><i class="fa fa-clipboard pr-10"></i> Situation administrative</a></li>
            <li><a href="#vtab4" role="tab" data-toggle="tab"><i class="fa fa-calculator pr-10"></i> Opération Historique</a></li>
            <li><a href="#vtab5" role="tab" data-toggle="tab"><i class="fa fa-refresh pr-10"></i> &nbsp;Synthèse</a></li>
          </ul>
          <!-- Tab panes -->
          <div class="tab-content">
            <div class="tab-pane fade in active" id="vtab1">
              <h6 class="title">Caractéristiques technique</h6>
              <!-- debut tableau v.-->
              <table class="table table-striped table-responsive" >
                <tbody>
                <tr>
                  <td class="rd_w350">Marque</td>
                  <td class="bold rd_w150">D.1</td>
                  <td class="info_red rd_w250">{{ v.ctec.marque }}</td>
                </tr>
                <tr>
                  <td>Tvv</td>
                  <td class="bold">D.2</td>
                  <td class="info_red">{{ v.ctec.tvv }}</td>
                </tr>
                <tr>
                  <td>Nom commercial</td>
                  <td class="bold">D.3</td>
                  <td class="info_red">{{ v.ctec.modele }}</td>
                </tr>
                <tr>
                  <td>Numéro CNIT</td>
                  <td class="bold">D.2.1</td>
                  <td class="info_red">{{ v.ctec.cnit }}</td>
                </tr>
                <tr>
                  <td>Couleur</td>
                  <td class="bold">&nbsp;</td>
                  <td class="info_red">{{ v.ctec.couleur }}</td>
                </tr>
                <tr>
                  <td>Type de reception</td>
                  <td class="bold">&nbsp;</td>
                  <td class="info_red">CE</td>
                </tr>
                <tr>
                  <td class="no-trait-left no-trait-right" colspan="3">&nbsp;</td>
                </tr>
                <tr>
                  <td>Numéro d'identification véhicule</td>
                  <td class="bold">E</td>
                  <td class="info_red">{{ v.ctec.vin }}</td>
                </tr>
                <tr>
                  <td colspan="3">&nbsp;</td>
                </tr>
                <tr>
                  <td>PT technique admissible (kg)</td>
                  <td class="bold">F.1</td>
                  <td class="info_red">{{ v.ctec.PT.admissible }}</td>
                </tr>
                <tr>
                  <td>PTAC (kg)</td>
                  <td class="bold">F.2</td>
                  <td class="info_red">{{ v.ctec.PT.AC }}</td>
                </tr>
                <tr>
                  <td>PTRA (kg)</td>
                  <td class="bold">F.3</td>
                  <td class="info_red">{{ v.ctec.PT.RA }}</td>
                </tr>
                <tr>
                  <td colspan="3">&nbsp;</td>
                </tr>
                <tr>
                  <td>PT en service (kg)</td>
                  <td class="bold">G</td>
                  <td class="info_red">{{ v.ctec.PT.service }}</td>
                </tr>
                <tr>
                  <td>PTAV (kg)</td>
                  <td class="bold">G.1</td>
                  <td class="info_red">{{ v.ctec.PT.AV }}</td>
                </tr>
                <tr>
                  <td colspan="3">&nbsp;</td>
                </tr>
                <tr>
                  <td>Catégorie (Ce)</td>
                  <td class="bold">J</td>
                  <td class="info_red">{{ v.ctec.categorie }}</td>
                </tr>
                <tr>
                  <td>Genre (National)</td>
                  <td class="bold">J.1</td>
                  <td class="info_red">{{ v.ctec.genre }}</td>
                </tr>
                <tr>
                  <td>Carrosserie (Ce)</td>
                  <td class="bold">J.2</td>
                  <td class="info_red">{{ v.ctec.carrosserie.ce }}</td>
                </tr>
                <tr>
                  <td>Carrosserie (National)</td>
                  <td class="bold">J.3</td>
                  <td class="info_red">{{ v.ctec.carrosserie.national }}</td>
                </tr>
                <tr>
                  <td colspan="3">&nbsp;</td>
                </tr>
                <tr>
                  <td>Numéro de réception</td>
                  <td class="bold">K</td>
                  <td class="info_red">{{ v.ctec.reception.numero }}</td>
                </tr>
                <tr>
                  <td colspan="3">&nbsp;</td>
                </tr>
                <tr>
                  <td>Cylindrée (cm3)</td>
                  <td class="bold">P.1</td>
                  <td class="info_red">{{ v.ctec.puissance.cylindres }}</td>
                </tr>
                <tr>
                  <td>Puissance nette max (kW)</td>
                  <td class="bold">P.2</td>
                  <td class="info_red">{{ v.ctec.puissance.nette }}</td>
                </tr>
                <tr>
                  <td>Energie</td>
                  <td class="bold">P.3</td>
                  <td class="info_red">{{ v.ctec.energie }}</td>
                </tr>
                <tr>
                  <td>Puissance CV</td>
                  <td class="bold">P.6</td>
                  <td class="info_red">{{ v.ctec.puissance.cv }}</td>
                </tr>
                <tr>
                  <td colspan="3">&nbsp;</td>
                </tr>
                <tr>
                  <td>Puissance / masse (kW/kg)</td>
                  <td class="bold">Q</td>
                  <td class="info_red">{{ v.ctec.puissance.norm }}</td>
                </tr>
                <tr>
                  <td colspan="3">&nbsp;</td>
                </tr>
                <tr>
                  <td>Places assises</td>
                  <td class="bold">S.1</td>
                  <td class="info_red">{{ v.ctec.places.assis }}</td>
                </tr>
                <tr>
                  <td>Pace debout</td>
                  <td class="bold">S.3</td>
                  <td class="info_red">{{ v.ctec.places.debout }}</td>
                </tr>
                <tr>
                  <td colspan="3">&nbsp;</td>
                </tr>
                <tr>
                  <td>Niveau sonore (db(A))</td>
                  <td class="bold">U.1</td>
                  <td class="info_red">{{ v.ctec.db }}</td>
                </tr>
                <tr>
                  <td>Vitesse moteur (min-1)</td>
                  <td class="bold">U.2</td>
                  <td class="info_red">{{ v.ctec.moteur }}</td>
                </tr>
                <tr>
                  <td colspan="3">&nbsp;</td>
                </tr>
                <tr>
                  <td>CO2 (g/km)</td>
                  <td class="bold">V.7</td>
                  <td class="info_red">{{ v.ctec.co2 }}</td>
                </tr>
                <tr>
                  <td>Classe environnement (CE)</td>
                  <td class="bold">V.9</td>
                  <td class="info_red">{{ v.ctec.environnement }}</td>
                </tr>
              </tbody>
              </table>
              <!-- fin tableau v.-->
              <!-- debut tableau controle technique -->
              <table class="table table-striped table-responsive" >
              <tbody>
                <tr>
                  <td colspan="4"><h6>Contrôle technique</h6></td>
                </tr>
                <tr>
                  <td class="bold">OTC</td>
                  <td>Résultat</td>
                  <td><span class="label label-success">{{ v.controle.otc.resultat }}</span></td>
                  <td>Date du contrôle</td>
                  <td class="info_red">{{ v.controle.otc.date }}</td>
                  <td>Fin de validité</td>
                  <td class="info_red">{{ v.controle.otc.validite }}</td>
                </tr>
                <tr>
                  <td class="bold">SIV</td>
                  <td>Résultat</td>
                  <td><span class="label label-warning">{{ v.controle.siv.resultat }}</span></td>
                  <td>Date du contrôle</td>
                  <td class="info_red">{{ v.controle.siv.date }}</td>
                  <td>Fin de validité</td>
                  <td class="info_red">{{ v.controle.siv.validite }}</td>
                </tr>
              </tbody>
              </table>
              <!-- fin tableau controle technique -->
              <!-- debut mentions particuliéres -->
              <table class="table table-striped table-responsive" >
                <tbody>
                <tr>
                  <td><h6>Mentions particulières</h6></td>
                </tr>
                <tr>
                  <td><div class="alert alert-info" role="alert">{{ v.mentions }}</div></td>
                </tr>
              </tbody>
              </table>
              <!-- fin mentions particuliéres -->
            </div>
            <div class="tab-pane fade" id="vtab2">
              <h6 class="title">Titulaire et co-titulaires</h6>
              <!-- debut titulaire et co-titulaire -->
              <table class="table table-striped table-responsive" >
                <tbody>
                <tr >
                  <td class="rd_w350">Nature</td>
                  <td class="info_red">{{ v.titulaire.nature }}</td>
                </tr>
                <tr>
                  <td>Identité</td>
                  <td class="info_red">{{ v.titulaire.identite }}</td>
                </tr>
                <tr>
                  <td>Adresse</td>
                  <td class="info_red">{{ v.titulaire.adresse }}</td>
                </tr>
              </tbody>
              </table>
              <!-- fin tableau titulaire et co-titulaire -->
              <h6 class="title">Certificat d'Immatriculation</h6>
              <!-- debut tableau certificat d'immatriculation -->
              <table class="table table-striped table-responsive" >
                <tbody>
                <tr>
                  <td class="rd_w350">Date de première immatriculation</td>
                  <td class="info_red">{{ v.certificat.premier }}</td>
                </tr>
                <tr>
                  <td>Date du CI</td>
                  <td class="info_red">{{ v.certificat.courant }}</td>
                </tr>
              </tbody>
              </table>
              <!-- debut tableau certificat d'immatriculation -->
            </div>
            <div class="tab-pane fade" id="vtab3">
              <div class="col-sm-6">
                <h6>Gages</h6>
                <!-- debut tableau gages -->
                <table class="table table-responsive">
                  <tbody>
                  <tr>
                    <td class="info_red">{{ v.administratif.gages }}</td>
                  </tr>
                </tbody>
                </table>
                <!-- fin tableau gages -->
              </div>
              <div class="col-sm-6">
                <h6>Oppositions</h6>
                <!-- debut tableau oppositions -->
                <table class="table table-responsive">
                  <tbody>
                  <tr>
                    <td class="info_red">{{ v.administratif.oppositions }}</td>
                  </tr>
                </tbody>
                </table>
                <!-- fin tableau oppositions -->
              </div>
              <div class="col-sm-6">
                <h6>Suspensions</h6>
                <!-- debut tableau suspensions -->
                <table class="table table-responsive">
                  <tbody>
                  <tr>
                    <td class="info_red">{{ v.administratif.suspensions }}</td>
                  </tr>
                </tbody>
                </table>
                <!-- fin tableau suspensions -->
              </div>
              <div class="col-sm-6">
                <h6>Procédures</h6>
                <!-- debut tableau procédures -->
                <table class="table table-responsive">
                  <tbody>
                  <tr>
                    <td class="info_red">{{ v.administratif.procedures }}</td>
                  </tr>
                </tbody>
                </table>
                <!-- fin tableau procédures -->
              </div>
              <div class="col-sm-6">
                <h6>Véhicule</h6>
                <!-- debut tableau véhicule -->
                <table class="table table-responsive">
                  <tbody>
                  <tr>
                    <td>Etat de vol</td>
                    <td class="info_red">{{ v.administratif.vol }}</td>
                  </tr>
                </tbody>
                </table>
                <!-- fin tableau véhicule -->
              </div>
              <div class="col-sm-6">
                <h6>Etats</h6>
                <!-- debut tableau titre -->
                <table class="table table-responsive">
                  <tbody>
                  <tr>
                    <td>Etat de vol</td>
                    <td class="info_red">{{ v.administratif.titre.vol }}</td>
                  </tr>
                  <tr>
                    <td>Etat de perte</td>
                    <td class="info_red">{{ v.administratif.titre.perte }}</td>
                  </tr>
                  <tr>
                    <td>Duplicata</td>
                    <td class="info_red">{{ v.administratif.titre.duplicata }}</td>
                  </tr>
                  <tr>
                    <td>Remise du titre</td>
                    <td class="info_red">{{ v.administratif.titre.remise }}</td>
                  </tr>
                </tbody>
                </table>
                <!-- fin tableau titre -->
              </div>
              <!-- debut bouton imprimer csa detaille -->
              <div class="col-sm-6">
                <button type="button" class="btn btn-animated btn-default btn-sm marg_but pop" data-container="body" data-toggle="popover" data-placement="top" data-content="Le certificat de situation administrative (CSA) est un document délivré par le ministère de l'Intérieur contenant des éléments d'information sur la situation administrative d'un véhicule.<br>Le CSA détaillé fait apparaître l'ensemble des informations relatives à la situation du véhicule."
  data-original-title="CSA" title="CSA"> Imprimer CSA détaillé<i class="fa fa-print"></i> </button>
              </div>
              <!-- fin bouton imprimer csa detaille -->
            </div>
            <div class="tab-pane fade" id="vtab4">
              <!-- debut tableau operation historique -->
              <table class="table table-responsive">
                <tbody>
                  <tr>
                    <td class="rd_w350"><h6>Date</h6></td>
                    <td><h6>Nature</h6></td>
                  </tr>
                  <tr v-for="(entry, index) in v.historique"
                     :key="index"
                  >
                    <td>{{ entry.date }}</td>  
                    <td class="info_red">{{ entry.nature }}</td>
                  </tr>
                </tbody>
              </table>
              <!-- fin tableau operation historique -->
            </div>
            <div class="tab-pane fade" id="vtab5">
              <table class="table table-responsive">
                <tbody>
                <tr>
                  <td class="rdw300"><h6>Resumé</h6></td>
          <td><h6></h6></td>
                  <td><h6>Conseils de l'acheteur averti</h6></td>
                </tr>
                <tr>
                  <td><i class="fa fa-car fa-3x pr-10"></i></td>
                  <td><span class="info_red">{{ v.marque }} {{ v.ctec.modele }}</span> </br> Propriétaire : {{ v.titulaire.identite }} depuis {{ v.certificat.annee }}</td>
          <td>&nbsp;</td>
        </tr>
                <tr>
                  <td><i class="fa fa-address-card fa-3x pr-10"></i></td>
                  <td>En acquérant ce véhicule vous serez le <span class="info_red">{{ v.nb_proprietaires + 1 }} ème</span> propriétaire</td>
          <td>&nbsp;</td>
                </tr>
                <tr>
                  <td><i class="fa fa-first-order fa-3x pr-10"></i></td>
                  <td>Premiére immatriculation le <span class="info_red">{{ v.certificat.premier }}</span> </td>
          <td>&nbsp;</td>
                </tr>
                <tr>
                  <td><i class="fa fa-arrows-h fa-3x pr-10"></i></td>
                  <td><span class="info_red">48210 km</span> Au dernier contrôle technique du 21/04/2016 </td>
          <td>&nbsp;</td>
        </tr>
              <tr v-if="v.etranger">
                  <td><i class="fa fa fa-globe fa-3x pr-10"></i></td>
                  <td>Ce véhicule a déjà été <span class="info_red">immatriculé à l'étranger</span></td>
                  <td>vérifier les options incluses</br> qui peuvent être différentes</td>
              </tr>
              <tr>
              <td><i class="fa fa-thumbs-up fa-3x pr-10"></i></td>
                  <td>Ce véhicule a été <span class="info_red">déclaré accidenté</span> en février 2012</br> et <span class="info_red">déclaré apte à circuler</span>  en avril 2012</td>
          <td>Demander le rapport d'expert</br>et la(es) facture(s)</td>
                </tr>
        <tr>
          <td><i class="fa fa-clipboard fa-3x pr-10"></i></td>
                  <td><span class="info_red">Rien à signaler</span> du point de vue administratif</br>(gages, opposition, vol,...)</td>
          <td>Un contrôle technique de moins</br>de 3 mois doit être fourni</td>
                </tr>
              </tbody>
        </table>
            </div>
          </div>
        </div>
        <!-- tabs end -->
        <!-- debut trait de séparation -->
        <hr class="style1">
        <!-- fin trait de séparation -->
        <!-- debut tout voir -->
        <h3 class="title"><span class="text-default">V</span>oir tout</h3>
        <p>Vous avez la possibilité de visionner tous les thèmes</p>
        <a class="btn btn-default collapsed btn-animated " data-toggle="collapse" href="#collapseContent" aria-expanded="false" aria-controls="collapseContent"> Ouvrir<i class="fa fa-plus"></i></a>
        <div class="collapse" id="collapseContent">
          <div class="row">
            <div class="col-lg-12">
              <!-- debut v.-->
              <h6>Véhicule</h6>
              <div>
                <!-- debut tableau v.-->
                <table class="table table-striped table-responsive" >
                  <tbody>
                  <tr>
                    <td class="rd_w350">Marque</td>
                    <td class="bold rd_w150">D.1</td>
                    <td class="info_red rd_w250">{{ v.ctec.marque }}</td>
                  </tr>
                  <tr>
                    <td>Tvv</td>
                    <td class="bold">D.2</td>
                    <td class="info_red">{{ v.ctec.tvv }}</td>
                  </tr>
                  <tr>
                    <td>Nom commercial</td>
                    <td class="bold">D.3</td>
                    <td class="info_red">{{ v.ctec.modele }}</td>
                  </tr>
                  <tr>
                    <td>Numéro CNIT</td>
                    <td class="bold">D.2.1</td>
                    <td class="info_red">{{ v.ctec.cnit }}</td>
                  </tr>
                  <tr>
                    <td>Couleur</td>
                    <td class="bold">&nbsp;</td>
                    <td class="info_red">{{ v.ctec.couleur }}</td>
                  </tr>
                  <tr>
                    <td>Type de reception</td>
                    <td class="bold">&nbsp;</td>
                    <td class="info_red">CE</td>
                  </tr>
                  <tr>
                    <td class="no-trait-left no-trait-right" colspan="3">&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Numéro d'identification véhicule</td>
                    <td class="bold">E</td>
                    <td class="info_red">{{ v.ctec.vin }}</td>
                  </tr>
                  <tr>
                    <td colspan="3">&nbsp;</td>
                  </tr>
                  <tr>
                    <td>PT technique admissible (kg)</td>
                    <td class="bold">F.1</td>
                    <td class="info_red">{{ v.ctec.PT.admissible }}</td>
                  </tr>
                  <tr>
                    <td>PTAC (kg)</td>
                    <td class="bold">F.2</td>
                    <td class="info_red">{{ v.ctec.PT.AC }}</td>
                  </tr>
                  <tr>
                    <td>PTRA (kg)</td>
                    <td class="bold">F.3</td>
                    <td class="info_red">{{ v.ctec.PT.RA }}</td>
                  </tr>
                  <tr>
                    <td colspan="3">&nbsp;</td>
                  </tr>
                  <tr>
                    <td>PT en service (kg)</td>
                    <td class="bold">G</td>
                    <td class="info_red">{{ v.ctec.PT.service }}</td>
                  </tr>
                  <tr>
                    <td>PTAV (kg)</td>
                    <td class="bold">G.1</td>
                    <td class="info_red">{{ v.ctec.PT.AV }}</td>
                  </tr>
                  <tr>
                    <td colspan="3">&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Catégorie (Ce)</td>
                    <td class="bold">J</td>
                    <td class="info_red">{{ v.ctec.categorie }}</td>
                  </tr>
                  <tr>
                    <td>Genre (National)</td>
                    <td class="bold">J.1</td>
                    <td class="info_red">{{ v.ctec.genre }}</td>
                  </tr>
                  <tr>
                    <td>Carrosserie (Ce)</td>
                    <td class="bold">J.2</td>
                    <td class="info_red">{{ v.ctec.carrosserie.ce }}</td>
                  </tr>
                  <tr>
                    <td>Carrosserie (National)</td>
                    <td class="bold">J.3</td>
                    <td class="info_red">{{ v.ctec.carrosserie.national }}</td>
                  </tr>
                  <tr>
                    <td colspan="3">&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Numéro de réception</td>
                    <td class="bold">K</td>
                    <td class="info_red">{{ v.ctec.reception.numero }}</td>
                  </tr>
                  <tr>
                    <td colspan="3">&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Cylindrée (cm3)</td>
                    <td class="bold">P.1</td>
                    <td class="info_red">{{ v.ctec.puissance.cylindres }}</td>
                  </tr>
                  <tr>
                    <td>Puissance nette max (kW)</td>
                    <td class="bold">P.2</td>
                    <td class="info_red">{{ v.ctec.puissance.nette }}</td>
                  </tr>
                  <tr>
                    <td>Energie</td>
                    <td class="bold">P.3</td>
                    <td class="info_red">{{ v.ctec.energe }}</td>
                  </tr>
                  <tr>
                    <td>Puissance CV</td>
                    <td class="bold">P.6</td>
                    <td class="info_red">{{ v.ctec.puissance.cv }}</td>
                  </tr>
                  <tr>
                    <td colspan="3">&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Puissance / masse (kW/kg)</td>
                    <td class="bold">Q</td>
                    <td class="info_red">{{ v.ctec.puissance.norm }}</td>
                  </tr>
                  <tr>
                    <td colspan="3">&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Places assises</td>
                    <td class="bold">S.1</td>
                    <td class="info_red">{{ v.ctec.places.assis }}</td>
                  </tr>
                  <tr>
                    <td>Pace debout</td>
                    <td class="bold">S.3</td>
                    <td class="info_red">{{ v.ctec.places.debout }}</td>
                  </tr>
                  <tr>
                    <td colspan="3">&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Niveau sonore (db(A))</td>
                    <td class="bold">U.1</td>
                    <td class="info_red">{{ v.ctec.db }}</td>
                  </tr>
                  <tr>
                    <td>Vitesse moteur (min-1)</td>
                    <td class="bold">U.2</td>
                    <td class="info_red">{{ v.ctec.moteur }}</td>
                  </tr>
                  <tr>
                    <td colspan="3">&nbsp;</td>
                  </tr>
                  <tr>
                    <td>CO2 (g/km)</td>
                    <td class="bold">V.7</td>
                    <td class="info_red">{{ v.ctec.co2 }}</td>
                  </tr>
                  <tr>
                    <td>Classe environnement (CE)</td>
                    <td class="bold">V.9</td>
                    <td class="info_red">{{ v.ctec.environnement }}</td>
                  </tr>
                </tbody>
                </table>
                <!-- fin tableau v.-->
                <div class="separator"></div>
                <!-- debut tableau controle technique -->
                <table class="table table-striped table-responsive" >
                  <tbody>
                  <tr>
                    <td colspan="4"><h6>Contrôle technique</h6></td>
                  </tr>
                  <tr>
                    <td class="bold">OTC</td>
                    <td>Résultat</td>
                    <td><span class="label label-success">{{ v.controle.otc.resultat }}</span></td>
                    <td>Date du contrôle</td>
                    <td class="info_red">{{ v.controle.otc.date }}</td>
                    <td>Fin de validité</td>
                    <td class="info_red">{{ v.controle.otc.validite }}</td>
                  </tr>
                  <tr>
                    <td class="bold">SIV</td>
                    <td>Résultat</td>
                    <td><span class="label label-warning">{{ v.controle.siv.resultat }}</span></td>
                    <td>Date du contrôle</td>
                    <td class="info_red">{{ v.controle.siv.date }}</td>
                    <td>Fin de validité</td>
                    <td class="info_red">{{ v.controle.siv.validite }}</td>
                  </tr>
                </tbody>
                </table>
                <!-- fin tableau controle technique -->
                <div class="separator"></div>
                <!-- debut mentions particuliéres -->
                <table class="table table-striped table-responsive" >
                  <tbody>
                  <tr>
                    <td><h6>Mentions particulières</h6></td>
                  </tr>
                  <tr>
                    <td><div class="alert alert-info" role="alert"> {{ v.mentions }}</div></td>
                  </tr>
                </tbody>
                </table>
                <!-- fin mentions particuliéres -->
              </div>
              <!-- fin v.-->
              <div class="separator"></div>
              <h6 class="title">Titulaire et co-titulaires</h6>
              <!-- debut titulaire et co-titulaire -->
              <table class="table table-striped table-responsive" >
                <tbody>
                <tr >
                  <td class="rd_w350">Nature</td>
                  <td class="info_red">{{ v.titulaire.nature }}</td>
                </tr>
                <tr>
                  <td>Identité</td>
                  <td class="info_red">{{ v.titulaire.identite }}</td>
                </tr>
                <tr>
                  <td>Adresse</td>
                  <td class="info_red">{{ v.titulaire.adresse }}</td>
                </tr>
              </tbody>
              </table>
              <!-- fin tableau titulaire et co-titulaire -->
              <h6 class="title">Certificat d'Immatriculation</h6>
              <!-- debut tableau certificat d'immatriculation -->
              <table class="table table-striped table-responsive" >
                <tbody>
                <tr>
                  <td class="rd_w350">Date de première immatriculation</td>
                  <td class="info_red">{{ v.certificat.premier }}</td>
                </tr>
                <tr>
                  <td>Date du CI</td>
                  <td class="info_red">{{ v.certificat.courant }}</td>
                </tr>
              </tbody>
              </table>
              <!-- debut tableau certificat d'immatriculation -->
              <div class="separator"></div>
              <h6>Opération historique</h6>
              <!-- debut situation administrative -->
              <table class="table table-responsive">
                <tbody>
                <tr>
                  <td class="rd_w350"><h6>Date</h6></td>
                  <td><h6>Nature</h6></td>
                </tr>
                    <tr v-for="(entry, index) in v.historique"
                       :key="index"
                    >
                      <td>{{ entry.date }}</td>  
                      <td class="info_red">{{ entry.nature }}</td>
                    </tr>              </tbody>
              </table>
              <!-- fin situation administrative -->
              <div class="separator"></div>
              <h6>Synthèse</h6>
              <!-- debut synthèse -->

              <!-- fin synthèse -->
            </div>
          </div>
        </div>
        <!-- fin tout voir -->
      </div>
    </div>
    <!-- row -->
  </div>
  <!-- container -->

  <div class="main-container" v-else>
    <div class="danger alert-info" role="alert"> Désolé, nous n'avons pas trouvé de résultat pour cette recherche</div>
  </div>
  </section>
</template>

<script>

import elasticsearchLib from 'elasticsearch'

export default {
  data () {
    return {
      libelleOperation: {
        'CHANG_TIT_NORMAL': 'Changement de titulaire',
        'DECLARATION_CESSION': 'Cession',
        'DECLARATION_ACHAT': 'Achat',
        'IMMAT_NORMALE': 'Immatriculation',
        'REMISE_LOT_TITRE': 'Remise lot',
        'MODIF_ADRESSE': 'Changement d\'adresse',
        'IMMAT_NORMALE_PREM_VO': 'Immatriculation à l\'étranger',
        'DEC_VE': 'Déclaration de véhicule endommagé',
        'PREM_RAP_VE': 'Premier rapport d\'expert',
        'REIMMAT_ETRANGER': 'Ré-immatriculation à l\'étrager',
        'SEC_RAP_VE': 'Second rapport d\'expert'
      },
      plaque: 'AA-086-FS',
      vin: 'VF32M8HZA9Y044370',
      display: false,
      conf: [],
      elasticsearch: null,
      v: {
        np_proprietaires: 3,
        plaque: 'AA-555-AA',
        etranger: true,
        ctec: {
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
    orderedProjects () {
      return this.$lodash.sortBy(this.projects)
    }
  },
  methods: {
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
      return historique.filter(event => this.libelleOperation[event.nature] !== undefined).map(event => {
        return {'date': this.formatDate(event.opa_date), 'nature': this.libelleOperation[event.nature]}
      })
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
      var veh = response.hits.hits[0]._source
      this.vin = veh.vin
      this.v.ctec.vin = veh.vin
      this.plaque = veh.num_plaque
      this.v.plaque = veh.num_plaque
      this.v.ctec.couleur = veh.couleur
      this.v.ctec.cnit = veh.cveh_code_cnit
      this.v.ctec.tvv = veh.CTEC_TYPE_VARIANTE
      this.v.ctec.reception.type = veh.cveh_type_recep
      this.v.ctec.reception.numero = veh.cveh_num_recep
      this.v.ctec.puissance.cylindres = veh.CTEC_CYLINDREE
      this.v.ctec.puissance.nette = veh.CTEC_PUISS_NETTE
      this.v.ctec.puissance.cv = veh.CTEC_PUISS_ADMIN
      this.v.ctec.puissance.norm = veh.CTEC_PUISS_MASS
      this.v.ctec.places.assis = veh.CTEC_PLACES_ASSISES
      this.v.ctec.places.debout = veh.CTEC_PLACES_DEBOUT
      this.v.ctec.db = veh.CTEC_NIVEAU_SONORE
      this.v.ctec.co2 = veh.CTEC_CO2
      this.v.ctec.moteur = veh.CTEC_VITESSE_MOTEUR
      this.v.ctec.marque = veh.marque
      this.v.ctec.modele = veh.modele
      this.v.ctec.genre = veh.CTEC_RLIB_GENRE
      this.v.ctec.categorie = veh.CTEC_RLIB_CATEGORIE
      this.v.ctec.carrosserie.national = veh.CTEC_RLIB_CARROSSERIE
      this.v.ctec.carrosserie.ce = veh.CTEC_RLIB_CARROSSERIE_CE
      this.v.ctec.environnement = veh.CTEC_RLIB_POLLUTION
      this.v.ctec.energie = veh.CTEC_RLIB_ENERGIE
      this.v.ctec.PT.admissible = veh.CTEC_MASSE_F1
      this.v.ctec.PT.AC = veh.CTEC_MASSE_F2
      this.v.ctec.PT.RA = veh.CTEC_MASSE_F3
      this.v.ctec.PT.service = veh.CTEC_MASSE_G
      this.v.ctec.PT.AV = veh.CTEC_POIDS_VIDE

      this.v.titulaire.identite = [veh.pers_raison_soc_tit, veh.pers_siren_tit, veh.pers_prenom_tit].join(' ')
      this.v.titulaire.adresse = veh.adresse
      this.v.certificat.premier = veh.dos_date_prem_immat
      this.v.certificat.courant = veh.dos_date_prem_immat_siv

      this.v.historique = veh.historique
      this.v.np_proprietaires = veh.nb_prop

      this.v.administratif.gages = (veh.Gage === 'Aucune') ? 'Aucun gage' : veh.Gage
      this.v.administratif.suspensions = (veh.immat_susp === 'Aucune') ? 'Aucune suspension' : veh.immat_susp
      this.v.administratif.oppositions = (veh.opposition_veh_endom === 'Aucune') ? 'Aucune opposion' : veh.opposition_veh_endom
      this.v.administratif.procedures = (veh.otci === 'Aucune') ? 'Aucune procédure' : veh.otci
      this.v.administratif.vol = (veh.veh_vole === 'Aucune') ? 'non volé' : 'volé'

      this.v.administratif.titre.vol = (veh.certif_immat_vole === 'Aucune') ? 'Aucune information' : veh.certif_immat_vole
      this.v.administratif.titre.perte = (veh.certif_immat_perdu === 'Aucune') ? 'Aucune information' : veh.certif_immat_perdu
      // this.v.administratif.titre.duplicata = ??
      // this.v.administratif.titre.remise = ??
      this.display = true
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
