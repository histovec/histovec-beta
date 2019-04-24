<template>
  <div>
    <!-- breadcrumb start -->
    <div class="breadcrumb-container">
      <div class="container">
        <ol class="breadcrumb">
          <li>
            <i class="fa fa-home pr-10"></i>
            <a href="home">Accueil</a>
          </li>
          <li class="active">
            Besoin d'aide
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
            style="background-image:url(assets/images/poignee_de_main.jpg); background-position: 50% 50%"
          >
            <div class="container">
              <div class="row justify-content-lg-center">
                <div class="col-lg-12">
                  <h2 class="text-center mt-4">
                    <div>
                      <strong>Achetez</strong> en confiance un
                      <strong>véhicule d'occasion</strong>
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
              <span class="text-defaut">B</span>esoin d'aide
            </h3>
            <div class="separator-2"></div>
            <!-- page-title end -->
          </div>
          <!-- main end -->
        </div>
      </div>
    </section>
    <div class="container">
      <div class="row">
        <div class="col-lg-12 mb-20">
          <p>
            Voici les questions les plus fréquemment posées. Si vous ne trouvez
            pas dans cette liste la réponse à votre interrogation,
            <a
              :href="'mailto:histovec@interieur.gouv.fr?subject=Besoin%20d%20aide'"
            >contactez-nous</a>
          </p>
          <accordion
            :content="faqContent(mailBody)"
            :initial-active="activeQuestion"
            @click="highlightQuestion"
          />
        </div>
      </div>
      <!-- row -->
    </div>
    <!-- container -->
  </div>
</template>

<script>
import Accordion from '@/components/infos/Accordion'
import faqContent from './faq-content'
import delay from 'delay'

export default {
  components: {
    Accordion,
  },

  data() {
    return {
      faqContent,
      activeQuestion: this.$route.hash.substring(1),
    }
  },

  computed: {
    mailBody() {
      var text = encodeURI(
        'Bonjour,\n\nL\'équipe HistoVec vous remercie d\'avoir utilisé le site, votre recherche a été infructueuse, nous sommes désolés pour ce désagrément.\n Histovec n\'est pas supporté par des navigateurs trop anciens, nous vous conseillons l\'utilisation de versions récentes de Firefox ou chrome.\n\nPour vous aider, nous avons besoin des informations que vous avez utilisé pour consulter l\'historique de votre véhicule.\n\nPour un particulier \nNom (de naissance): \nPrénom(s): \nDate de naissance (du titulaire): \nNuméro d\'immatriculation: \nNuméro de formule: \nou\nDate du certificat (FNI avant 2009):\n\nPour une entreprise\nRaison sociale: \nNuméro de siren: \nNuméro d\'immatriculation: \nNuméro de formule:\nou\nDate du certificat (FNI avant 2009):\n\n\nNous pourrons ainsi vous répondre rapidement',
      )
      return text
    },
  },

  mounted() {
    if (this.activeQuestion) {
      this.highlightQuestion(this.activeQuestion)
    }

    this.$http
      .put(
        this.apiUrl +
          'log/' +
          this.$cookie.get('userId') +
          '/' +
          this.$route.path.replace(/^\/\w+\//, ''),
      )
      .catch(() => {})
  },

  methods: {
    async highlightQuestion(id) {
      const hash = `#${id}`
      this.activeQuestion = id
      await delay(10)
      this.$scrollTo(hash)
      this.$router.push({ name: 'faq', hash })
    }
  },

}
</script>
