<template>
  <main role="main">
    <div
      class="banner banner-big-height padding-bottom-clear"
      :style="{ backgroundImage: `url('${imageAccueil}')`, backgroundSize: '1200px', backgroundPosition: '50% -50px' }"
    >
      <div class="container">
        <div class="row justify-content-lg-center">
          <div class="col-lg-12 text-center pv-20 pvm0">
            <h1 class="title color-white">
              Jouez la transparence
            </h1>
            <p class="text-center color-white txt-small-20">
              En partageant l'historique du véhicule
            </p>
          </div>
        </div>
      </div>
    </div>
    <section class="light-gray-bg pv-20 clearfix">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <div class="pv-20 ph-20 feature-box bordered_spec shadow_spec text-center">
              <!-- debut bouton vendeur -->
              <router-link
                class="btn radius-30 btn-default btn-animated btn-lg"
                :to="{ name: 'search', params: {t: 'particulier'}}"
              >
                Propriétaire
                <i class="fa fa-handshake-o"></i>
              </router-link>
              <!-- fin bouton vendeur -->
              <div class="separator clearfix"></div>
              <p>
                <span class="text-defaut text-defaut-i-g">Rassurez</span> vos acheteurs potentiels avec le <span class="text-defaut text-defaut-i-g">rapport</span>
                <br />
                et obtenez votre <span class="text-defaut text-defaut-i-g">certificat de non gage</span>.
              </p>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="pv-20 ph-20 feature-box bordered_spec shadow_spec text-center ">
              <!-- debut bouton acheteur -->
              <router-link
                class="btn radius-30 btn-warning btn-animated btn-lg"
                :to="{ name: 'buyer' }"
              >
                Acquéreur
                <i class="fa fa-users"></i>
              </router-link>
              <!-- fin bouton acheteur -->
              <div class="separator clearfix"></div>
              <p>
                Achetez en <span class="text-defaut text-defaut-i-g">confiance</span> :
                <br />
                demandez le <span class="text-defaut text-defaut-i-g">rapport</span> au vendeur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="row">
        <div class="col-lg-12 text-center">
          <h1 class="title large">
            Comment ça <span class="text-defaut">marche</span>
          </h1>
          <div class="separator"></div>
        </div>
        <div class="col-md-4 ">
          <div class="pv-20 ph-20 feature-box-2 light-gray-bg boxed shadow object-non-visible animated object-visible">
            <span class="icon without-bg"><i class="fa fa-drivers-license-o"></i></span>
            <div class="body">
              <h4 class="title m-g-10">
                <span class="text-defaut-g">1</span> - Identifiez-vous
              </h4>
              <p class="m-g-10">
                Le vendeur renseigne son identité et les informations d’identification du véhicule.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4 ">
          <div class="pv-20 ph-20 feature-box-2 light-gray-bg boxed shadow object-non-visible animated object-visible">
            <span class="icon without-bg"><i class="fa fa-search"></i></span>
            <div class="body">
              <h4 class="title m-g-10">
                <span class="text-defaut-g">2</span> - Générez le rapport...
              </h4>
              <p class="m-g-10">
                Le vendeur consulte son rapport HistoVec et partage le lien à l'acheteur.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4 ">
          <div class="pv-20 ph-20 feature-box-2 light-gray-bg boxed shadow object-non-visible animated object-visible">
            <span class="icon without-bg"><i class="fa fa-share"></i></span>
            <div class="body">
              <h4 class="title m-g-10">
                <span class="text-defaut-g">3</span> - Partagez-le !
              </h4>
              <p class="m-g-10">
                L’acheteur consulte le rapport HistoVec sur le site officiel de l’administration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dark-bg">
      <div class="container">
        <div class="row justify-content-lg-center">
          <div class="col-lg-12">
            <h2 class="text-center mt-4">
              L’administration agit pour la sécurité routière
            </h2>
            <h3 class="large text-center p-b-10">
              Toute demande de renseignement ou de correction de votre dossier
              doit être adressée à l'Agence Nationale des titres Sécurisés
              <a
                class="link-default"
                href="https://immatriculation.ants.gouv.fr/Questions-frequentes/Demarche-Je-souhaite-faire-une-autre-demande/"
                rel="noopener noreferrer"
                target="_blank"
              >
                ANTS
                <i class="fa fa-external-link"></i>
              </a>
            </h3>
          </div>
        </div>
      </div>
    </div>

    <section class="light-gray-bg pv-30 clearfix">
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col-lg-12">
            <h2 class="text-center">
              Nos <strong>garanties !</strong>
            </h2>
            <div class="separator"></div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4">
            <div
              class="pv-30 ph-20 feature-box bordered shadow text-center object-non-visible animated object-visible fadeInDownSmall"
              data-animation-effect="fadeInDownSmall"
              data-effect-delay="100"
            >
              <span class="icon default-bg circle"><i class="fa fa-thumbs-o-up"></i></span>
              <h3>
                Officiel
              </h3>
              <div class="separator clearfix"></div>
              <p>
                Données officielles du <span class="text-defaut text-defaut-i-g">Ministère de l’Intérieur</span> issues du
                <a
                  href="https://immatriculation.ants.gouv.fr/Tout-savoir-sur-le-SIV/Le-Systeme-d-Immatriculation-des-Vehicules-SIV"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Système d'Immatriculation des Véhicules"
                >
                  SIV
                </a>
              </p>
            </div>
          </div>
          <div class="col-lg-4">
            <div
              class="pv-30 ph-20 feature-box bordered shadow text-center object-non-visible animated object-visible fadeInDownSmall"
              data-animation-effect="fadeInDownSmall"
              data-effect-delay="150"
            >
              <span class="icon default-bg circle"><i class="fa fa-lock"></i></span>
              <h3>
                Confidentiel
              </h3>
              <div class="separator clearfix"></div>
              <p>
                Seul le <span class="text-defaut text-defaut-i-g">propriétaire</span> peut partager ses informations avec un acheteur potentiel.
              </p>
            </div>
          </div>
          <div class="col-lg-4">
            <div
              class="pv-30 ph-20 feature-box bordered shadow text-center object-non-visible animated object-visible fadeInDownSmall"
              data-animation-effect="fadeInDownSmall"
              data-effect-delay="200"
            >
              <span class="icon default-bg circle"><i class="fa fa-euro"></i></span>
              <h3>
                Gratuit
              </h3>
              <div class="separator clearfix"></div>
              <p>
                Un service public <span class="text-defaut text-defaut-i-g">gratuit</span> pour les propriétaires et les acheteurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="dark-bg default-hovered footer-top animated-text">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="call-to-action text-center">
              <div class="row">
                <div class="col-sm-8">
                  <h2>
                    Consulter un exemple de rapport...
                  </h2>
                  <h6>
                    <img
                      :src="imageExempleRapportTiny"
                      width="1044"
                      height="113"
                      alt="type véhicule, puissance fiscale, propriétaire actuel, depuis quelle année, nombre de propriétaires"
                    >
                  </h6>
                </div>
                <div class="col-sm-4">
                  <p class="mt-10">
                    <button
                      class="btn btn-animated btn-lg btn-gray"
                      @click="modal = true"
                    >
                      Voir un exemple
                      <i class="fa fa-file-text-o pl-20"></i>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="light-gray-bg pv-20 clearfix">
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col-lg-12">
            <h2 class="text-center">
              Bon à savoir
            </h2>
            <div class="separator"></div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="pv-20 ph-20 feature-box bordered_spec shadow_spec">
              <div class="text-center">
                <span class="icon default-bg circle"><i class="fa fa-handshake-o"></i></span>
                <h3>
                  Vendeur
                </h3>
                <div class="separator clearfix"></div>
              </div>
              <div>
                <ul>
                  <li>
                    Prendre connaissance des démarches
                    (
                    <a
                      href="https://www.service-public.fr/particuliers/vosdroits/F1707"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Service Public
                    </a>
                    )
                  </li>
                  <li>
                    Télécharger un certificat de situation administrative
                    (
                    <a
                      href="/histovec/search"
                    >
                      HistoVec
                    </a>
                    )
                  </li>
                  <li>
                    Déclarer la cession d'un véhicule
                    (
                    <a
                      href="https://immatriculation.ants.gouv.fr/Questions-frequentes/Vendre-ou-donner-mon-vehicule/Commencer-une-declaration-de-cession"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      ANTS
                    </a>
                    )
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="pv-20 ph-20 feature-box bordered_spec shadow_spec">
              <div class="text-center">
                <span class="icon default-bg circle"><i class="fa fa-users"></i></span>
                <h3>
                  Acheteur
                </h3>
                <div class="separator clearfix"></div>
              </div>
              <div>
                <ul>
                  <li>
                    Prendre connaissance des démarches
                    (
                    <a
                      href="https://www.service-public.fr/particuliers/vosdroits/F24254"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Service Public
                    </a>
                    )
                  </li>
                  <li>
                    Faire une demande de changement de titulaire du certificat d'immatriculation
                    (
                    <a
                      href="https://immatriculation.ants.gouv.fr/Questions-frequentes/Acheter-ou-recevoir-un-vehicule-d-occasion/Realiser-la-teleprocedure-J-achete-ou-je-recois-un-vehicule-d-occasion"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      ANTS
                    </a>
                    )
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div v-if="modal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <button
                    type="button"
                    class="close"
                    @click="modal = false"
                  >
                    <span aria-hidden="true">&times;</span><span class="sr-only">Fermer</span>
                  </button>
                  <h6 class="modal-title">
                    Exemple de rapport
                  </h6>
                </div>
                <div
                  class="modal-body"
                  style="height: 350px; overflow-y: auto;"
                >
                  <img
                    :src="imageExempleRapportFull"
                    class="img-responsive"
                    style="margin: 0 auto;"
                  >
                </div>
                <div class="modal-footer">
                  <a
                    class="btn radius-30 btn btn-animated btn-default"
                    href="#"
                    @click="modal = false"
                  >
                    Fermer
                    <i class="fa fa-close"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </main>
</template>

<script>

import imageAccueil from '@/assets/img/accueil.jpg'
import imageExempleRapportTiny from '@/assets/img/exemple_rapport.png'
import imageExempleRapportFull from '@/assets/img/exemple_rapport_g.png'

export default {
  components: {
  },
  data () {
    return {
      modal: false,

      // images
      imageAccueil,
      imageExempleRapportTiny,
      imageExempleRapportFull,
    }
  },
  created () {
    this.$store.dispatch('log', this.$route.path)
  }
}
</script>
