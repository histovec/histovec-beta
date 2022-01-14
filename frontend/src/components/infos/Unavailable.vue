<template>
  <div>
    <!-- breadcrumb start -->
    <div class="breadcrumb-container">
      <div class="container">
        <ol class="breadcrumb">
          <li>
            <i class="fa fa-home pr-10"></i><a href="home">Accueil</a>
          </li>
          <li class="active">
            Mentions légales
          </li>
        </ol>
      </div>
    </div>
    <!-- breadcrumb end -->
    <!-- section -->
    <section class="main-container">
      <div class="container">
        <div class="row">
          <!-- section start -->
          <section
            class="dark-translucent-bg"
            :style="{ backgroundImage: `url('${imagePoigneeDeMain}')`, backgroundPosition: '50% 50%' }"
          >
            <div class="container">
              <div class="row justify-content-lg-center">
                <div class="col-lg-12">
                  <h2 class="text-center mt-4">
                    <div>
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
    <!-- section -->
    <!-- main-container start -->
    <section class="main-container">
      <div class="container">
        <div class="row">
          <!-- main start -->
          <div class="main col-md-12">
            <!-- page-title start -->
            <h3 class="title">
              <span class="text-defaut">503</span>
            </h3>
            <div class="separator-2"></div>
            <!-- page-title end -->
          </div>
          <!-- main end -->
          <div class="container">
            <div class="row">
              <div class="col-lg-12 no-margin">
                <p>Le service HistoVec est indisponible et l'historique des véhicules n'est actuellement pas consultable.</p>
                <p>Si vous souhaitez vendre votre véhicule, nous vous invitons à télécharger le certificat de situation administrative auprès de l’'Agence Nationale des Titres Sécurisés.</p>
                <p>Veuillez nous excuser pour la gêne occasionnée.</p>
                <br>
                <br>
                <div class="col-xs-8 col-xs-offset-2 col-sm-4 col-sm-offset-4">
                  <a
                    class="btn btn-default btn-m center-block m-h-05"
                    href="https://siv.interieur.gouv.fr/map-usg-ui/do/accueil_certificat"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Obtenir le CSA à jour via l'ANTS
                  </a>
                </div>
              </div>
            </div>
            <!-- row -->
          </div>
          <!-- container -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import imagePoigneeDeMain from '@/assets/img/poignee_de_main.jpg'

export default {
  data () {
    return {
      // images
      imagePoigneeDeMain,
    }
  },
  created () {
    this.$store.dispatch('log', 'unavailable' )
  }
}
</script>
