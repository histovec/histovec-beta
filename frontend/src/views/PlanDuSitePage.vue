<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import '@/views/css/views.css'

export default defineComponent({
  name: 'PlanDuSitePage',

  components: { RouterLink },
})
</script>

<template>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="[
          {
            to: '/accueil',
            text: 'Accueil',
          },
          {
            text: 'Plan du site',
          },
        ]"
      />
    </div>

    <div class="fr-col-12">
      <h1>Plan du site</h1>

      <h3 class="histovec-fr-text">
        <router-link
          to="/accueil"
        >
          Accueil
        </router-link>
      </h3>

      <h4 class="histovec-fr-text  fr-ml-3w">
        <router-link
          to="/proprietaire"
        >
          Propriétaire
        </router-link>
      </h4>

      <h5 class="fr-ml-5w">
        Rapport propriétaire
      </h5>

      <h4 class="histovec-fr-text  fr-ml-3w">
        <router-link
          to="/acheteur"
        >
          Acheteur
        </router-link>
      </h4>

      <h5 class="fr-ml-5w">
        Rapport acheteur
      </h5>

      <h4 class="histovec-fr-text  fr-ml-3w">
        <router-link
          to="/faq"
        >
          FAQ & Liens utiles
        </router-link>
      </h4>

      <h4 class="histovec-fr-text  fr-ml-3w">
        <router-link
          to="/contact"
        >
          Contact
        </router-link>
      </h4>

      <h3 class="histovec-fr-text">
        <router-link
          to="/plan-du-site"
        >
          Plan du site
        </router-link>
      </h3>

      <h3 class="histovec-fr-text">
        <router-link
          to="/accessibilite"
        >
          Accessibilité
        </router-link>
      </h3>

      <h3 class="histovec-fr-text">
        <router-link
          to="/mentions-legales"
        >
          Mentions légales
        </router-link>
      </h3>

      <h3 class="histovec-fr-text">
        <router-link
          to="/donnees-personnelles-et-cookies"
        >
          Données personnelles & Gestion des cookies
        </router-link>
      </h3>
    </div>
  </div>
</template>

<style scoped>
[href] {
  background-image: none;
}

</style>
