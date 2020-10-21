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
            :style="{ backgroundImage: `url('${imagePoigneeDeMain}')`, backgroundPosition: '50% 50%' }"
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
              <span class="text-defaut">Besoin d'aide</span>
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
              title="Contact"
              @click="needHelp"
            >
              contactez-nous
            </a>
          </p>
          <accordion
            :content="faqContent()"
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
import imagePoigneeDeMain from '@/assets/img/poignee_de_main.jpg'


export default {
  components: {
    Accordion,
  },

  data() {
    return {
      faqContent,
      activeQuestion: this.$route.hash.substring(1),

      // images
      imagePoigneeDeMain,
    }
  },

  mounted() {
    if (this.activeQuestion) {
      this.highlightQuestion(this.activeQuestion)
    }
    this.$store.dispatch('log', this.$route.path)
  },

  methods: {
    async needHelp () {
      await this.$store.dispatch('toggleContactModal', { subject: this.contact.subject.default })
    },
    async highlightQuestion(id) {
      const hash = `#${id}`
      this.activeQuestion = id
      setTimeout(() => {
        this.$scrollTo(hash)
        this.$router.push({ name: 'faq', hash })
      }, 10)
    }
  },

}
</script>
