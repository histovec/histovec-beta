<template>
    <main role="main">
      <!-- banner start -->
      <div class="banner clearfix">
        <!-- slideshow start -->
        <!-- ================ -->
        <div class="slideshow">
          <!-- slider revolution start -->
          <div class="slider-banner-container" >
            <div class="slider-banner-fullwidth" ><!-- #BeginLibraryItem "/Library/slider.lbi" -->
              <ul class="slides">
                <!-- slide 1 start -->
                <li>
                  <!-- main image -->
                  <img src="assets/images/tableau_de_bord/28.jpg" class="img-responsive" alt="slidebg1" data-bgposition="center top" data-bgrepeat="no-repeat" data-bgfit="cover">
                  <!-- Transparent Background -->
                  <div class="tp-caption dark-translucent-bg"
              									data-x="center"
              									data-y="bottom"
              									data-speed="600"
              									data-start="0"> </div>
                  <!-- LAYER NR. 1 -->
                  <div class="tp-caption sfb fadeout large_white"
              									data-x="left"
              									data-y="20"
              									data-speed="500"
              									data-start="1000"
              									data-easing="easeOutQuad">Protéger les acheteurs d’un véhicule d’occasion </div>
                  <!-- LAYER NR. 2 -->
                  <div class="tp-caption sfb fadeout large_white tp-resizeme hidden-xs"
              									data-x="left"
              									data-y="80"
              									data-speed="500"
              									data-start="1300"
              									data-easing="easeOutQuad">
                    <div class="separator-2 light"></div>
                  </div>
                  <!-- LAYER NR. 3 -->
                  <div class="tp-caption sfb fadeout medium_white hidden-xs"
              									data-x="left"
              									data-y="100"
              									data-speed="500"
              									data-start="1300"
              									data-easing="easeOutQuad"
              									data-endspeed="600" style=" word-wrap: break-word;">
Des affaires récentes mettant en
lumière des véhicules gravement endommagés remis
en circulation <br/> alors qu’ils étaient dangereux. <br/> HistoVec permet le renforcement de l’information
des consommateurs sur l’état des véhicules <br/>
véhicules en offrant la consultation de leur historique </div>
                  <!-- LAYER NR. 4
                  <div class="tp-caption sfb fadeout small_white"
              									data-x="left"
              									data-y="260"
              									data-speed="500"
              									data-start="1600"
              									data-easing="easeOutQuad"
              									data-endspeed="600"><a href="#" class="btn radius-50 btn-dark btn-animated">Lire la suite... <i class="fa fa-arrow-right"></i></a> <span class="pl-5 pr-5">or</span> <a href="../page-contact.html" class="btn radius-50 btn-default btn-animated">Contact <i class="fa fa-envelope"></i></a></div>-->
                </li>
                <!-- slide 1 end -->
                <!-- slide 2 start -->
                <li>
                  <!-- main image -->
                  <img src="assets/images/tableau_de_bord/23.jpg" class="img-responsive" alt="slidebg2" data-bgposition="center top" data-bgrepeat="no-repeat" data-bgfit="cover">
                  <!-- Transparent Background -->
                  <div class="tp-caption dark-translucent-bg"
              									data-x="center"
              									data-y="bottom"
              									data-speed="600"
              									data-start="0"> </div>
                  <!-- LAYER NR. 1 -->
                  <div class="tp-caption sfb fadeout text-center large_white"
              									data-x="center"
              									data-y="20"
              									data-speed="500"
              									data-start="1000"
              									data-easing="easeOutQuad">Un service public gratuit </div>
                  <!-- LAYER NR. 2 -->
                  <div class="tp-caption sfb fadeout text-center large_white tp-resizeme hidden-xs"
              									data-x="center"
              									data-y="80"
              									data-speed="500"
              									data-start="1300"
              									data-easing="easeOutQuad">
                    <div class="separator light"></div>
                  </div>
                  <!-- LAYER NR. 3 -->
                  <div class="tp-caption sfb fadeout medium_white text-center hidden-xs"
              									data-x="center"
              									data-y="100"
              									data-speed="500"
              									data-start="1300"
              									data-easing="easeOutQuad"
              									data-endspeed="600">Parce que la sécurité doit être accessible à tous, <br/>
                                l'historique officiel du véhicule peut être fourni gratuitement par le titulaire du véhicule
                              <br/> à ses acheteurs potentiels </div>
                  <!-- LAYER NR. 4
                  <div class="tp-caption sfb fadeout small_white text-center"
              									data-x="center"
              									data-y="260"
              									data-speed="500"
              									data-start="1600"
              									data-easing="easeOutQuad"
              									data-endspeed="600"><a href="#" class="btn radius-50 btn-dark btn-animated">Lire la suite... <i class="fa fa-arrow-right"></i></a> <span class="pl-5 pr-5">or</span> <a href="../page-contact.html" class="btn radius-50 btn-default btn-animated">Contact <i class="fa fa-envelope"></i></a> </div>-->
                </li>
                <!-- slide 2 end -->
              </ul>
    <!-- #EndLibraryItem --><div class="tp-bannertimer"></div>
            </div>
          </div>
          <!-- slider revolution end -->
        </div>
        <!-- slideshow end -->
      </div>
      <!-- banner end -->
      <!-- section start -->
      <section class="light-gray-bg clearfix">
        <div class="container">
          <div class="row pv-10">
            <div class="col-lg-3" >
              <div class="ph-20 pv-15 feature-box bordered_spec shadow_spec text-center ">
                <!-- debut bouton acheteur -->
                <router-link class="btn radius-30 btn-dark btn-animated btn-lg" :to="{ name: 'search', query: {t: 'particulier'}}">Vendeur <i class="fa fa-handshake-o"></i></router-link>
                <!-- fin bouton acheteur -->
                <div class="separator clearfix"></div>
                <p> Vendez en <b>transparence</b> : fournissez <b>gratuitement</b> à vos acheteurs potentiels le rapport de l'historique votre véhicule</p>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="ph-20 pv-15 feature-box bordered_spec shadow_spec text-center ">
                <!-- debut bouton acheteur -->
                <a href="acheteur.html" class="btn radius-30 btn-default btn-animated btn-lg">Acheteur <i class="fa fa-user"></i></a>
                <!-- fin bouton acheteur -->
                <div class="separator clearfix"></div>
                <p>Achetez en <b>confiance</b> : demandez au vendeur le rapport <b>officiel</b> et gratuit de l’historique du véhicule</p>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="ph-20 pv-15 feature-box bordered_spec shadow_spec text-center ">
                <!-- debut bouton acheteur -->
                <router-link class="btn radius-30 btn-warning btn-animated btn-lg" :to="{ name: 'search', query: {t: 'pro'}}">Professionnel <i class="fa fa-users"></i></router-link>
                <!-- fin bouton acheteur -->
                <div class="separator clearfix"></div>
                <p> <b>Accélérez</b> vos ventes : renseignez vos acheteurs avec les rapports complets sur vos véhicules</p>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="ph-20 pv-15 feature-box bordered_spec shadow_spec text-center ">
                <!-- debut bouton acheteur -->
                <a href="vendeur.html" class="btn radius-30 btn-danger btn-animated btn-lg">Loueur <i class="fa fa-car"></i></a>
                <!-- fin bouton acheteur -->
                <div class="separator clearfix"></div>
                <p><b>Evaluez</b> votre parc : consultez l'historique complet vos véhicules pour mieux les valoriser et les gérer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- section end -->
      <!-- section start -->
      <div class="dark-bg default-hovered footer-top animated-text">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="call-to-action text-center">
                <div class="row">
                  <div class="col-sm-8" style="max-height: 200px; ">
                    <img class="center-block media-object img-responsive" style="filter: blur(2px); object-fit: cover;height:200px; " src="assets/images/rapport.png" alt="immatriculation"/>
                    <h2 style="font-weight: 600; color: #000d">Consultez un exemple de rapport</h2>
                  </div>
                  <div class="col-sm-4">
                    <p class="mt-10"><a href="#" class="btn btn-animated btn-lg btn-gray" data-toggle="modal" data-target=".bs-example-modal-lg">Voir<i class="fa fa-file-text-o pl-20"></i></a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- section end -->
      <!-- debut modal -->
      <div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Fermer</span></button>
              <h4 class="modal-title" id="myLargeModalLabel">Exemple de rapport</h4>
            </div>
            <div class="modal-body">
              <p>Consectetur adipisicing elit. Nemo architecto debitis dolorum ullam in ut sint, odit maiores eaque explicabo, repellendus minima soluta sunt! Nisi minima blanditiis voluptate, ut atque.</p>
              <p>Culpa expedita! Quisquam, itaque officiis nisi nam doloribus explicabo possimus, dolorum alias provident maxime temporibus, enim voluptatibus! Molestias, accusantium cum impedit sint velit exercitationem deserunt, corporis magni provident earum, ullam iusto voluptatem iste animi inventore ab cupiditate quod laborum quasi libero doloremque obcaecati eius. Ut, reprehenderit optio unde accusantium quia qui! Debitis delectus corporis aspernatur nemo aut, odio harum ea repellendus quidem, saepe, incidunt? Assumenda deserunt unde minima aspernatur ducimus velit molestiae, minus eius inventore, dolore temporibus odio distinctio optio.</p>
            </div>
            <div class="modal-footer"> <a href="#" class="btn radius-30 btn btn-animated btn-default" data-dismiss="modal">Fermer <i class="fa fa-close"></i></a> </div>
          </div>
        </div>
      </div>
      <!-- fin modal -->
      <!-- section start -->
      <section class="light-gray-bg pv-30 clearfix">
        <div class="container">
          <div class="row justify-content-md-center">
            <div class="col-lg-12">
              <h2 class="text-center">Nos <strong>garanties !</strong></h2>
              <div class="separator"></div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4">
              <div class="pv-30 ph-20 feature-box bordered shadow text-center object-non-visible animated object-visible fadeInDownSmall" data-animation-effect="fadeInDownSmall" data-effect-delay="100"> <span class="icon default-bg circle"><i class="fa fa-thumbs-o-up"></i></span>
                <h3>Officiel</h3>
                <div class="separator clearfix"></div>
                <p>Données officilelles du <span class="text-defaut text-defaut-i-g">Ministère de l’Intérieur</span> du Système d’Immatriculation des Véhicules.</p>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="pv-30 ph-20 feature-box bordered shadow text-center object-non-visible animated object-visible fadeInDownSmall" data-animation-effect="fadeInDownSmall" data-effect-delay="150"> <span class="icon default-bg circle"><i class="fa fa-lock"></i></span>
                <h3>Confidentiel</h3>
                <div class="separator clearfix"></div>
                <p>Seul le <span class="text-defaut text-defaut-i-g">propriétaire</span> peut partager ses informations à un acheteur potentiel.</p>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="pv-30 ph-20 feature-box bordered shadow text-center object-non-visible animated object-visible fadeInDownSmall" data-animation-effect="fadeInDownSmall" data-effect-delay="200"> <span class="icon default-bg circle"><i class="fa fa-euro"></i></span>
                <h3>Gratuit</h3>
                <div class="separator clearfix"></div>
                <p>Un service public <span class="text-defaut text-defaut-i-g">gratuit</span> pour les propriétaires et les acheteurs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- section end -->
      <!-- section start -->
      <section class="dark-translucent-bg fixed-bg pv-30" style="background-image:url(assets/images/tableau_de_bord/41.jpg);">
        <div class="container">
          <div class="row justify-content-lg-center">
            <div class="col-lg-12">
              <h2 class="text-center mt-4"><span class="bold_6">L’administration</span> agit pour pour la <span class="bold_6">sécurité routière</span></h2>
              <div class="separator with-icon"><i class="fa fa-car bordered"></i></div>
              <p class="large text-center bold_4">Ce site est mis en oeuvre par le ministère de l’intérieur dans le cadre de la mesure 16 décidées par le Gouvernement en janvier 2018 afin de mieux protéger les acheteurs de céhicules d’oaccasion (cf . <a href="#">dossier de presse</a>) </p>
            </div>
          </div>
          <div class="row">
            <div class="clients-container">
              <div class="clients">
                <div class="client-image"> <img src="assets/images/logos_metiers/logo_mi.png" width="63" height="79"></div>
                <div class="client-image"> <img src="assets/images/logos_metiers/securite_routiere_200.png" width="200" height="153" alt=""> </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- section end -->
      <!-- section start -->
      <div class="row">
        <div class="col-lg-12 text-center pv-20"> <br>
          <h1 class="title large">Comment ça <span class="text-defaut">marche</span> </h1>
          <div class="separator"></div>
        </div>
        <div class="col-md-4 ">
          <div class="pv-20 ph-20 feature-box-2 light-gray-bg boxed shadow object-non-visible animated object-visible fadeInDownSmall" data-animation-effect="fadeInDownSmall" data-effect-delay="100"> <span class="icon without-bg"><i class="fa fa-desktop"></i></span>
            <div class="body">
              <h4 class="title m-g-10"><span class="text-defaut-g">1</span> - Identification du véhicule</h4>
              <p class="m-g-10">Le vendeur renseigne les informations d’identification du véhicule.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 ">
          <div class="pv-20 ph-20 feature-box-2 light-gray-bg boxed shadow object-non-visible animated object-visible fadeInDownSmall" data-animation-effect="fadeInDownSmall" data-effect-delay="100"> <span class="icon without-bg"><i class="fa fa-drivers-license-o"></i></span>
            <div class="body">
              <h4 class="title m-g-10"><span class="text-defaut-g">2</span> - Rapport HistoVec</h4>
              <p class="m-g-10">Le vendeur consulte son rapport HistoVec et partage le lien à l'acheteur.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 ">
          <div class="pv-20 ph-20 feature-box-2 light-gray-bg boxed shadow object-non-visible animated object-visible fadeInDownSmall" data-animation-effect="fadeInDownSmall" data-effect-delay="100"> <span class="icon without-bg"><i class="fa fa-search"></i></span>
            <div class="body">
              <h4 class="title m-g-10"><span class="text-defaut-g">3</span> - Consulter le rapport</h4>
              <p class="m-g-10">L’acheteur consulte le rapport HistoVec sur le site officiel de l’administration.</p>
            </div>
          </div>
        </div>
      </div>
      <!-- section end -->
      <br>
      <div class="separator"></div>
      <br>
      <!-- section start -->
      <section class="light-gray-bg pv-30 clearfix">
        <div class="container">
          <div class="row pv-10">
            <div class="col-lg-3" >
              <div class="ph-20 pv-15 feature-box bordered_spec shadow_spec text-center ">
                <!-- debut bouton acheteur -->
                <router-link class="btn radius-30 btn-dark btn-animated btn-lg" :to="{ name: 'search', query: {t: 'particulier'}}">Vendeur <i class="fa fa-handshake-o"></i></router-link>
                <!-- fin bouton acheteur -->
                <div class="separator clearfix"></div>
                <p> Vendez en <b>transparence</b> : fournissez <b>gratuitement</b> à vos acheteurs potentiels le rapport de l'historique votre véhicule</p>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="ph-20 pv-15 feature-box bordered_spec shadow_spec text-center ">
                <!-- debut bouton acheteur -->
                <a href="acheteur.html" class="btn radius-30 btn-default btn-animated btn-lg">Acheteur <i class="fa fa-user"></i></a>
                <!-- fin bouton acheteur -->
                <div class="separator clearfix"></div>
                <p>Achetez en <b>confiance</b> : demandez au vendeur le rapport <b>officiel</b> et gratuit de l’historique du véhicule</p>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="ph-20 pv-15 feature-box bordered_spec shadow_spec text-center ">
                <!-- debut bouton acheteur -->
                <router-link class="btn radius-30 btn-warning btn-animated btn-lg" :to="{ name: 'search', query: {t: 'pro'}}">Professionnel <i class="fa fa-users"></i></router-link>
                <!-- fin bouton acheteur -->
                <div class="separator clearfix"></div>
                <p> <b>Accélérez</b> vos ventes : renseignez vos acheteurs avec les rapports complets sur vos véhicules</p>
              </div>
            </div>
            <div class="col-lg-3">
              <div class="ph-20 pv-15 feature-box bordered_spec shadow_spec text-center ">
                <!-- debut bouton acheteur -->
                <a href="vendeur.html" class="btn radius-30 btn-danger btn-animated btn-lg">Loueur <i class="fa fa-car"></i></a>
                <!-- fin bouton acheteur -->
                <div class="separator clearfix"></div>
                <p><b>Evaluez</b> votre parc : consultez l'historique complet vos véhicules pour mieux les valoriser et les gérer.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- section end --><!-- #BeginLibraryItem "/Library/footer.lbi" --><!-- footer start -->
    </main>
</template>
