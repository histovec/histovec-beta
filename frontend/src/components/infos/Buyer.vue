<template>
  <div>
    <div class="breadcrumb-container">
      <div class="container">
        <ol class="breadcrumb">
          <li>
            <i class="fa fa-home pr-10"></i><a href="home">Accueil</a>
          </li>
          <li class="active">
            Acheteur
          </li>
        </ol>
      </div>
    </div>
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
    <section class="main-container">
      <div class="container">
        <div class="row">
          <div class="main col-md-12">
            <h3 class="title">
              <span class="text-defaut">A</span>cheteur
            </h3>
            <div class="separator-2"></div>
          </div>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="row">
        <div class="col-lg-12 mb-20">
          Vous souhaitez acquérir un véhicule d’occasion, vous avez fait une sélection parmi des annonces, demandez au vendeur de partager l'historique de son véhicule.
          <br /><br />
          HistoVec permet au vendeur de partager avec un acheteur intéressé l’historique des faits marquants du véhicule enregistrés dans le fichier national du SIV (Système d’Immatriculation des Véhicules), notamment :
          <ul>
            <li>
              date de mise en circulation
            </li>
            <li>
              changements de propriétaire
            </li>
            <li>
              sinistres à réparation contrôlée
            </li>
            <li>
              situation administrative (gage, opposition, vol, …) etc.
            </li>
          </ul>
          En acheteur éclairé, vous pourrez prendre votre décision en toute quiétude.
          <!-- accordion end -->
        </div>
      </div>
      <!-- row -->
      <div class="col-md-12 p-h-10">
        <p>
          Vous pouvez envoyer un courriel au vendeur en utilisant le bouton ci-dessous. Il s'agit d'un modèle qui peut vous aider, mais vous pouvez utiliser d'autres moyens pour lui faire part de votre demande.
        </p>
        <p>
          Cette option ne fonctionne que si votre navigateur est configuré pour ouvrir les liens courriel.
          <br />
        </p>
        <p class="text-center">
          <a
            :href="askReportEmail"
            class="btn radius-30 btn-default btn-animated btn"
          >
            Je demande le rapport au vendeur <i class="fa fa-send"></i>
          </a>
        </p>
      </div>
    <!-- container -->
    </div>
  </div>
</template>

<script>
import { mailTo } from '../../utils/email'
import { ASK_REPORT_EMAIL } from '../../constants/email'

import imagePoigneeDeMain from '@/assets/img/poignee_de_main.jpg'

export default {
  data () {
    return {
      // images
      imagePoigneeDeMain,
    }
  },
  created () {
    this.$store.dispatch('log', this.$route.path)
    this.askReportEmail = mailTo(ASK_REPORT_EMAIL)
  }
}
</script>
