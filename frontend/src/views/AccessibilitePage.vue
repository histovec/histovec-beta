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

      <h2>
        Introduction
      </h2>

      <p>
        Cette page vise à vous guider dans l'utilisation du site.
      </p>
      <p>
        L'initiative internationale pour l'accessibilité du Web (WAI) définit l'accessibilité du Web comme suit :
      </p>
      <p>
        L'accessibilité du Web signifie que les personnes en situation de handicap peuvent utiliser le Web, et qu'elles peuvent contribuer sur le Web.
      </p>
      <p>
        L'accessibilité du Web comprend tous les handicaps qui affectent l'accès au Web, ce qui inclut les handicaps visuels, auditifs, physiques, de parole, cognitifs et neurologiques.
      </p>
      <p>
        <a
          class="fr-link"
          href="https://www.w3.org/WAI/"
          rel="noopener noreferrer"
          title="WAI"
          target="_blank"
        >
          Voir l'introduction de la WAI
        </a>
      </p>
      <h2>
        Déclaration d’accessibilité
      </h2>
      <p>
        L'équipe du site HistoVec s'engage à rendre son site internet accessible conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.
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

      <h3>
        État de conformité
      </h3>
      <p>
        Le site HistoVec est non conforme avec le référentiel général d'amélioration de l'accessibilité.
      </p>

      <h4>
        Résultat des tests
      </h4>
      <p>
        L'audit de conformité réalisé en interne révèle que :
      </p>
      <ul class="fr-ml-4w  fr-pl-0 fr-mb-3w">
        <li>41% des critères RGAA sont respectés.</li>
      </ul>

      <h3>
        Contenus non accessibles
      </h3>
      <p>
        Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.
      </p>
      <h4>
        Non conformités
      </h4>
      <ul class="fr-ml-4w  fr-pl-0 fr-mb-3w">
        <li>Images : alternative textuelle des images à améliorer pour distinguer des éléments pertinents des éléments de décoration</li>
        <li>Couleurs : contraste sur l'utilisation des couleurs à améliorer pour favoriser la lisibilité</li>
        <li>Tableaux : configuration des titres et entêtes de tableaux à améliorer</li>
        <li>Liens : pertinence des informations associées aux liens à améliorer</li>
        <li>Scripts : gestion de la compatibilité avec les dispositifs d'assistance à améliorer</li>
        <li>Éléments obligatoires : structure HTML des pages à améliorer</li>
        <li>Structuration de l'information : gestion de la structure de l'information à améliorer (titres, tableaux, etc.)</li>
        <li>Présentation de l'information : affichage de l'information à améliorer en fonction des conditions d'accès (utilisation d'une liseuse, utilisation d'un zoom, désactivation CSS, etc.)</li>
        <li>Formulaires : manipulation et navigation dans les formulaires à améliorer</li>
        <li>Navigation : gestion de la navigation à améliorer (tabulation au clavier, liens d'évitement, etc.)</li>
        <li>Consultation : accessibilité des informations du rapport et du certificat de situation administrative à améliorer</li>
      </ul>

      <h3>
        Établissement de cette déclaration d’accessibilité
      </h3>
      <p>
        Cette déclaration a été établie le 15 novembre 2022. Elle a été mise à jour le 15 novembre 2022.
      </p>
      <h4>
        Technologies utilisées pour la réalisation du site web
      </h4>
      <ul class="fr-ml-4w  fr-pl-0 fr-mb-3w">
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
        <li>Vue.js</li>
      </ul>

      <h4>
        Environnement de test
      </h4>
      <p>
        Agents utilisateurs, technologies d'assistance et outils utilisés pour vérifier l'accessibilité :
      </p>
      <ul class="fr-ml-4w  fr-pl-0 fr-mb-3w">
        <li>Technologie d'assistance : NVDA</li>
        <li>Navigateur : Firefox</li>
        <li>Système d'exploitation : Windows 10</li>
      </ul>
      <h4>
        Les outils utilisés lors de l’évaluation
      </h4>
      <ul class="fr-ml-4w  fr-pl-0 fr-mb-3w">
        <li>
          Validateur du code :
          <a
            class="fr-link"
            href="https://validator.w3.org/"
            rel="noopener noreferrer"
            title="validator.w3.org"
            target="_blank"
          >
            validator.w3.org
          </a>
        </li>
        <li>Vérification des contrastes de couleur :</li>
        <ul class="fr-ml-4w  fr-pl-0 sous-liste">
          <li>
            <a
              class="fr-link"
              href="https://webaim.org/resources/contrastchecker/"
              rel="noopener noreferrer"
              title="webaim.org"
              target="_blank"
            >
              https://webaim.org/resources/contrastchecker/
            </a>
          </li>
          <li>WCAG Contrast checker (plugin)</li>
        </ul>
        <li>Désactivation du JavaScript : JavaScript Switcher</li>
        <li>Outillage web : Web Developer (plugin)</li>
        <li>Outils d’évaluation de pages web (plugins) :</li>
        <ul class="fr-ml-4w  fr-pl-0 sous-liste">
          <li>Tanaguru webext</li>
          <li>Axe DevTools</li>
          <li>Wave (webaim)</li>
        </ul>
      </ul>
      <h4>
        Pages du site ayant fait l’objet de la vérification de conformité
      </h4>
      <ul class="fr-ml-4w  fr-pl-0 fr-mb-3w">
        <li>Accueil</li>
        <li>Propriétaire</li>
        <li>Rapport propriétaire / acheteur</li>
        <li>Acheteur</li>
        <li>FAQ et Liens utiles</li>
        <li>Contact</li>
        <li>Plan du site</li>
        <li>Accessibilité</li>
        <li>Mentions légales</li>
        <li>Données personnelles et Gestion des cookies</li>
      </ul>

      <h3>
        Retour d'information et contact
      </h3>
      <p>
        Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable du site internet pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.
      </p>
      <ul class="fr-ml-4w  fr-pl-0 fr-mb-3w">
        <li>
          Envoyer un message <router-link
            class="fr-link"
            to="/contact"
          >
            via le formulaire de contact
          </router-link>
        </li>
        <li>
          Envoyer un mail à <a
            class="fr-link"
            :href="reportAccessibilityErrorEmail"
            title="Envoyer un mail au support"
          >
            {{ HISTOVEC_SUPPORT_EMAIL }}
          </a>
        </li>
      </ul>

      <h3>
        Voies de recours
      </h3>
      <p>
        Cette procédure est à utiliser dans le cas suivant.
      </p>
      <p>
        Vous avez signalé au responsable du site internet un défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un des services du portail et vous n’avez pas obtenu de réponse satisfaisante.
      </p>
      <ul class="fr-ml-4w  fr-pl-0 fr-mb-3w">
        <li>
          Écrire un message au Défenseur des droits (
          <a
            class="fr-link"
            href="https://formulaire.defenseurdesdroits.fr/"
            rel="noopener noreferrer"
            target="_blank"
            title="https://formulaire.defenseurdesdroits.fr/"
          >
            https://formulaire.defenseurdesdroits.fr/
          </a>
          ).
        </li>
        <li>
          Contacter le délégué du Défenseur des droits dans votre région (
          <a
            class="fr-link"
            href="https://www.defenseurdesdroits.fr/saisir/delegues"
            rel="noopener noreferrer"
            target="_blank"
            title="https://www.defenseurdesdroits.fr/saisir/delegues"
          >
            https://www.defenseurdesdroits.fr/saisir/delegues
          </a>
          ).
        </li>
        <li>
          Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) :<br />
          Défenseur des droits<br />
          Libre réponse 71120<br />
          75342 Paris CEDEX 07
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

.sous-liste {
  list-style-type: circle;
}
</style>
