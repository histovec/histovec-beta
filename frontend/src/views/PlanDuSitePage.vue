<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'PlanDuSitePage',

  components: { RouterLink },
})
</script>

<template>
  <div
    class="fr-grid-row fr-grid-row--gutters"
    style="margin-top: 5rem"
  >
    <div class="fr-col-12">
      <h1>Plan du site</h1>

      <h3 class="fr-title-link">
        <router-link
          to="/accueil"
        >
          Accueil
        </router-link>
      </h3>

      <h4 class="fr-title-link fr-ml-3w">
        <router-link
          to="/proprietaire"
        >
          Propriétaire
        </router-link>
      </h4>

      <h5 class="fr-ml-6w">
        Rapport propriétaire
      </h5>

      <h4 class="fr-title-link fr-ml-3w">
        <router-link
          to="/acheteur"
        >
          Acheteur
        </router-link>
      </h4>

      <h5 class="fr-ml-6w">
        Rapport acheteur
      </h5>

      <h4 class="fr-title-link fr-ml-3w">
        <router-link
          to="/faq"
        >
          FAQ & Liens utiles
        </router-link>
      </h4>

      <h4 class="fr-title-link fr-ml-3w">
        <router-link
          to="/contact"
        >
          Contact
        </router-link>
      </h4>

      <h3 class="fr-title-link">
        <router-link
          to="/plan-du-site"
        >
          Plan du site
        </router-link>
      </h3>

      <h3 class="fr-title-link">
        <router-link
          to="/accessibilite"
        >
          Accessibilité
        </router-link>
      </h3>

      <h3 class="fr-title-link">
        <router-link
          to="/mentions-legales"
        >
          Mentions légales
        </router-link>
      </h3>

      <h3 class="fr-title-link">
        <router-link
          to="/donnees-personnelles"
        >
          Données personnelles
        </router-link>
      </h3>
    </div>
  </div>
</template>

<style scoped>

[href] {
  background-image: none;
}

.fr-title-link {
  text-decoration: none;
  color: #000091;
  /* @todo: how to import DSFR CSS variable --blue-france-sun-113-625 ? */
}
</style>
