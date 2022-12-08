<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import '@/assets/stylesheets/globale.css'

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

      <ul class="fr-raw-list">
        <li class="fr-h5">
          <router-link
            to="/accueil"
          >
            Accueil
          </router-link>
        </li>

        <li class="fr-h5 fr-ml-3w">
          <router-link
            to="/proprietaire"
          >
            Propriétaire
          </router-link>
        </li>

        <li class="fr-h5 fr-ml-5w">
          Rapport propriétaire
        </li>

        <li class="fr-h5 fr-ml-3w">
          <router-link
            to="/acheteur"
          >
            Acheteur
          </router-link>
        </li>

        <li class="fr-h5 fr-ml-5w">
          Rapport acheteur
        </li>

        <li class="fr-h5 fr-ml-3w">
          <router-link
            to="/faq"
          >
            FAQ & Liens utiles
          </router-link>
        </li>

        <li class="fr-h5 fr-ml-3w">
          <router-link
            to="/contact"
          >
            Contact
          </router-link>
        </li>

        <li class="fr-h5">
          <router-link
            to="/plan-du-site"
          >
            Plan du site
          </router-link>
        </li>

        <li class="fr-h5">
          <router-link
            to="/accessibilite"
          >
            Accessibilité
          </router-link>
        </li>

        <li class="fr-h5">
          <router-link
            to="/mentions-legales"
          >
            Mentions légales
          </router-link>
        </li>

        <li class="fr-h5 ">
          <router-link
            to="/donnees-personnelles-et-cookies"
          >
            Données personnelles & Gestion des cookies
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
