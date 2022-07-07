<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import { mailTo } from '@/utils/email.js'
import { HISTOVEC_BASE_URL, HISTOVEC_SUPPORT_EMAIL, REPORT_ACCESSIBILITY_ERROR_EMAIL } from '@/constants/email.js'


export default defineComponent({
  name: 'AccessibilitePage',

  components: { RouterLink },

  data () {
    return {
      // url
      HISTOVEC_BASE_URL,

      // email
      HISTOVEC_SUPPORT_EMAIL,
    }
  },

  created () {
    this.reportAccessibilityErrorEmail = mailTo(REPORT_ACCESSIBILITY_ERROR_EMAIL)
  },
})
</script>

<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="[
          {
            to: '/accueil',
            text: 'Accueil',
          },
          {
            text: 'Accessibilité',
          },
        ]"
      />
    </div>

    <div class="fr-col-12">
      <h1>Accessibilité</h1>

      <h5 class="fr-blue-title">
        Introduction
      </h5>
      <p>
        Cette page vise à vous guider dans l'utilisation du site.
      </p>
      <p>
        L'initiative internationale pour l'accessibilité du Web (WAI) définit l'accesibilité du Web comme suite :
      </p>
      <p>
        L'accessibilité du Web signifie que les personnes en situation de handicap peuvent utiliser le Web, et qu'elles peuvent contribuer sur le Web.
      </p>
      <p>
        L'accessibilité du Web comprend tous les handicaps qui affectent l'accès au Web, ce qui inclut les handicaps visuels, auditifs, physiques, de parole, cognitifs et neurologiques.
      </p>
      <p>
        <!-- @todo: quelle url ? -->
        <a
          class="fr-link"
          href="https://www.google.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Voir l'introduction de la WAI
        </a>
      </p>
      <p>
        L'équipe du site HistoVec s'engage à rendre son site accessible conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.
      </p>
      <p>
        Cette déclaration d'accessibilité s'applique à
        <router-link
          class="fr-link"
          to="/accueil"
        >
          {{ HISTOVEC_BASE_URL }}
        </router-link>
      </p>

      <h5 class="fr-blue-title">
        Etat de conformité
      </h5>
      <p>
        <router-link
          class="fr-link"
          to="/accueil"
        >
          {{ HISTOVEC_BASE_URL }}
        </router-link>
        est en totale conformité avec le référentiel général d'amélioration de l'accessibilité.
      </p>

      <h5 class="fr-blue-title">
        Résultat des tests
      </h5>
      <p>
        L'audit de conformité réalisée par XXX révèle que 100% des critères du RGAA 4.1 sont respectés.
      </p>

      <h5 class="fr-blue-title">
        Date de déclaration
      </h5>
      <p>
        Cette déclaration a été établie le JJ MM AAA.
      </p>

      <h5 class="fr-blue-title">
        Technologies utilisées pour la réalisation de ce site
      </h5>
      <p>
        <ul class="fr-ml-4w fr-pl-0">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>Vue.js</li>
        </ul>
      </p>

      <h5 class="fr-blue-title">
        Agents utilisateurs, technologies d'assistance et outils utilisés pour vérifier l'accessibilité
      </h5>
      <p>
        Les tests des pages web ont été effectuées avec les combinaisons de navigateurs web et lecteurs d'écran suivants :
      </p>
      <p>
        <ul class="fr-ml-4w fr-pl-0">
          <li>XXX et XXX</li>
          <li>XXX et XXX</li>
          <li>XXX et XXX</li>
        </ul>
      </p>
      <p>
        L'évaluation de l'accessibilité est le résultat de tests manuels, assistés par des outils (feuilles CSS dédiées, extensions HeadingsMaps et WebDeveloper Toolbar, Color Contrast Analyser).
      </p>

      <h5 class="fr-blue-title">
        Pages du site ayant fait l'objet de la vérification de conformité
      </h5>
      <p>
        <ul class="fr-ml-4w fr-pl-0">
          <li>Accueil</li>
          <li>Propriétaire</li>
          <li>Rapport propriétaire</li>
          <li>Acheteur</li>
          <li>Rapport acheteur</li>
          <li>FAQ & Liens utiles</li>
          <li>Contact</li>
          <li>Plan du site</li>
          <li>Accessibilité</li>
          <li>Mentions légales</li>
          <li>Données personnelles</li>
        </ul>
      </p>

      <h5 class="fr-blue-title">
        Signaler un dysfonctionnement
      </h5>
      <p>
        Si, malgré notre vigilance, vous rencontriez le moindre problème d'accessibilité sur notre site, n'hésitez pas à nous écrire à
        <a
          class="fr-link"
          :href="reportAccessibilityErrorEmail"
        >
          {{ HISTOVEC_SUPPORT_EMAIL }}
        </a>
      </p>

      <h5 class="fr-blue-title">
        Voie de recours
      </h5>
      <p>
        Si vous constatez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du site,
        vous rencontriez le moindre problème d'accessibilité sur notre site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse rapide de notre part,
        vous êtes en droit de faire parvenir vos doléances ou une demande de saisie au Défenseur des droits.
      </p>
      <p>Plusieurs moyens sont à votre disposition :</p>
      <p>
        <ul class="fr-ml-4w fr-pl-0">
          <li>
            <!-- @todo: quelle url ? -->
            <a
              class="fr-link"
              href="https://www.google.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              le formulaire de contact en ligne
            </a>
          </li>
          <li>
            <!-- @todo: quelle url ? -->
            <a
              class="fr-link"
              href="https://www.google.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              la liste du ou des délégués de votre région
            </a>
            avec leurs informations de contact direct
          </li>
          <li>
            <!-- @todo: quelle url ? -->
            <a
              class="fr-link"
              href="https://www.google.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              en langue des signes française
            </a>
          </li>
          <li>
            leur adresse postale : <br />
            le Défenseur des droits <br />
            Libre réponse 71120 <br />
            75342 Paris CEDEX 07
          </li>
        </ul>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* @todo centralize these rules in common CSS file as a .histovec-fr-title-link class */
[href] {
  background-image: none;
}

.fr-title-link {
  text-decoration: none;
  color: var(--blue-france-sun-113-625);
}
</style>
