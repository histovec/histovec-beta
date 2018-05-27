<template>
  <div>
  <!-- breadcrumb start -->
  <div class="breadcrumb-container">
    <div class="container">
      <ol class="breadcrumb">
        <li><i class="fa fa-home pr-10"></i><a href="index.html">Accueil</a></li>
        <li class="active">Contact</li>
      </ol>
    </div>
  </div>
  <!-- breadcrumb end -->
  <!-- section -->
  <section class="main-container">
    <div class="container">
      <div class="row">
        <!-- section start -->
        <section class="dark-translucent-bg fixed-bg pv-40" style="background-image:url(assets/images/acheteur_3.jpg);">
          <div class="container">
            <div class="row justify-content-lg-center">
              <div class="col-lg-12">
                <h2 class="text-center mt-4"><span class="bold_6">Achetez</span> en confiance un <span class="bold_6">véhicule d'occassion</span></h2>
                <div class="separator with-icon"><i class="fa fa-car bordered"></i></div>
              </div>
            </div>
          </div>
        </section>
        <!-- section end -->
        <!-- debut image fixe
        <div class="col-md-12"> <img src="assets/images/corporate-1-slider-slide-2.jpg" class="img-responsive" alt="slidebg2" data-bgposition="center top" data-bgrepeat="no-repeat" data-bgfit="cover"></div>
  <!-- fin image fixe -->
      </div>
    </div>
  </section>
  <!-- section -->
  <!-- main-container start -->
  <!-- ================ -->
  <section class="main-container">
    <div class="container">
      <div class="row">
        <!-- main start -->
        <!-- ================ -->
        <div class="main col-md-9">
          <!-- page-title start -->
          <!-- ================ -->
          <h3 class="page-title"><span class="text-defaut">C</span>ontactez-nous</h3>
          <div class="separator-2"></div>
          <!-- page-title end -->
          <div class="contact-form">
            <form id="contact-form-with-recaptcha" class="margin-clear row" role="form">
              <div class="col-md-4">
                <div class="form-group has-feedback">
                  <label for="name">Nom <span class="color-danger">*</span></label>
                  <input type="text" class="form-control" id="name" name="name" placeholder="" v-model="nom">
                  <i class="fa fa-user form-control-feedback"></i>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group has-feedback">
                  <label for="prenom">Prénom <span class="color-danger">*</span></label>
                  <input type="text" class="form-control" id="prenom" name="prenom" placeholder="" v-model="prenom">
                  <i class="fa fa-user form-control-feedback"></i>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group has-feedback">
                  <label for="email">Courriel <span class="color-danger">*</span></label>
                  <input type="email" class="form-control" id="email" name="email" placeholder="" v-model="email">
                  <i class="fa fa-envelope form-control-feedback"></i>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group has-feedback">
                  <label for="subject">Objet <span class="color-danger">*</span></label>
                  <input type="text" class="form-control" id="subject" name="subject" placeholder="" v-model="object">
                  <i class="fa fa-navicon form-control-feedback"></i>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group has-feedback">
                  <label for="message">Message <span class="color-danger">*</span></label>
                  <textarea class="form-control" rows="6" id="message" name="message" placeholder="" v-model="message"></textarea>
                  <i class="fa fa-pencil form-control-feedback"></i>
                </div>
              </div>
              <div class="col-md-12 center">
                <a :href="mailTo" class="btn btn-animated btn-default">Envoyer <i class="fa fa-send-o"></i></a>
              </div>
            </form>
          </div>
        </div>
        <!-- main end -->
      </div>
    </div>
  </section>
  <!-- main-container end -->
</div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      nom: '',
      prenom: '',
      object: '',
      email: '',
      message: ''
    }
  },
  computed: {
    mailTo () {
      return 'mailto:histovec@interieur.gouv.fr?subject=' + encodeURI('Histovec - ' + this.object) + '&body=' + this.mailBody + '&reply-to:' + this.mail
    },
    mailBody () {
      return encodeURI(this.message + '\n' + this.prenom + ' ' + this.nom + '\n')
    }

  }
}
</script>
