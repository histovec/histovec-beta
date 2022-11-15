<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import { mailTo } from '@/utils/email.js'
import { HISTOVEC_SUPPORT_EMAIL, REPORT_ACCESSIBILITY_ERROR_EMAIL } from '@/constants/email.js'


export default defineComponent({
  name: 'AccessibilitePage',

  components: { RouterLink },

  data () {
    return {
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
      <h5 class="fr-blue-title">
        Déclaration d’accessibilité
      </h5>
      <p>
        L'équipe du site HistoVec s'engage à rendre son site internet accessible conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.
      </p>
      <p>
        Cette déclaration d'accessibilité s'applique à
        <router-link
          class="fr-link"
          to="/accueil"
        >
          HistoVec
        </router-link>
      </p>

      <h5 class="fr-blue-title">
        État de conformité
      </h5>
      <p>
        <router-link
          class="fr-link"
          to="/accueil"
        >
          HistoVec
        </router-link>
        n’est pas en conformité avec le référentiel général d'amélioration de l'accessibilité. La non-conformité est énumérées ci-dessous.
      </p>

      <h5 class="fr-blue-title">
        Résultat des tests
      </h5>
      <p>
        L'audit de conformité réalisée en interne révèle que :
      </p>
      <p>
        <ul class="fr-ml-4w  fr-pl-0">
          <li>41% des critères du RGAA 4.1 sont respectés.</li>
          <li>Le taux moyen de conformité du service en ligne s’élève à 50%.</li>
        </ul>
      </p>

      <h5 class="fr-blue-title">
        Contenus non accessibles
      </h5>
      <p>
        Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.
      </p>
      <p>
        Non conformité :
      </p>
      <p>
        <ul class="fr-ml-4w  fr-pl-0">
          <li>Images</li>
          <li>Cadres</li>
          <li>Couleurs</li>
          <li>Multimédia</li>
          <li>Tableaux</li>
          <li>Liens</li>
          <li>Scripts</li>
          <li>Éléments obligatoires</li>
          <li>Structuration de l'information</li>
          <li>Présentation de l'information</li>
          <li>Formulaires</li>
          <li>Navigation</li>
          <li>Consultation</li>
        </ul>
      </p>

      <h5 class="fr-blue-title">
        Établissement de cette déclaration d’accessibilité
      </h5>
      <p>
        Cette déclaration a été établie le 15 novembre 2022. Elle a été mise à jour le 15 novembre 2022.
      </p>
      <p>
        Technologies utilisées pour la réalisation du site web :
      </p>
      <p>
        <ul class="fr-ml-4w  fr-pl-0">
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
        Les tests des pages web ont été effectués avec les combinaisons de navigateurs web et lecteurs d'écran suivants :
      </p>
      <p>
        <ul class="fr-ml-4w  fr-pl-0">
          <li>Technologie d'assistance : NVDA</li>
          <li>Navigateur : Firefox</li>
          <li>Système d'exploitation : Windows 10</li>
        </ul>
      </p>
      <p>
        Les outils suivants ont été utilisés lors de l’évaluation :
      </p>
      <p>
        <ul class="fr-ml-4w  fr-pl-0">
          <li>validator.w3.org pour l'utilisation : Validateur du code</li>
          <li>https://webaim.org/resources/contrastchecker/ pour l'utilisation : Vérification des contrastes de couleur</li>
          <li>WCAG Contrast checker pour l'utilisation : Vérification des contrastes de couleur (plugin)</li>
          <li>JavaScript Switcher pour l'utilisation : Désactivation du JavaScript</li>
          <li>Web Developer pour l'utilisation : Outillage web (plugin)</li>
          <li>Tanaguru webext pour l'utilisation : Outil d’évaluation de pages web (plugin)</li>
          <li>Axe DevTools pour l'utilisation : Outil d’évaluation de pages web (plugin)</li>
          <li>Wave (webaim) pour l'utilisation : Outil d’évaluation de pages web (plugin)</li>
        </ul>
      </p>
      <p>
        Pages du site ayant fait l’objet de la vérification de conformité :
      </p>
      <p>
        <ul class="fr-ml-4w  fr-pl-0">
          <li>Accueil</li>
          <li>Propriétaire</li>
          <li>Rapport propriétaire</li>
          <li>Acheteur</li>
          <li>FAQ & Liens utiles</li>
          <li>Contact</li>
          <li>Plan du site</li>
          <li>Accessibilité</li>
          <li>Mentions légales</li>
          <li>Données personnelles</li>
        </ul>
      </p>

      <h5 class="fr-blue-title">
        Retour d'information et contact
      </h5>
      <p>
        Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable du site internet pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.
      </p>
      <p>
        <ul class="fr-ml-4w  fr-pl-0">
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
      </p>

      <h5 class="fr-blue-title">
        Voies de recours
      </h5>
      <p>
        Cette procédure est à utiliser dans le cas suivant.
      </p>
      <p>
        Vous avez signalé au responsable du site internet un défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un des services du portail et vous n’avez pas obtenu de réponse satisfaisante.
      </p>
      <p>
        <ul class="fr-ml-4w  fr-pl-0">
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
            Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) Défenseur des droits.<br />
            Libre réponse 71120 75342 Paris CEDEX 07
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
