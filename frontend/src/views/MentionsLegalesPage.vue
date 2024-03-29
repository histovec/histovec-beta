<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import '@/assets/stylesheets/globale.css'

import { mailTo } from '@/utils/email.js'
import {
  HISTOVEC_BASE_URL,
  ANTS_PERSONAL_DATA_EMAIL, UTAC_PERSONAL_DATA_EMAIL, HISTOVEC_SUPPORT_EMAIL, OPPOSITION_PERSONAL_DATA_EMAIL,
  REPRODUCTION_REQUEST_EMAIL, READ_OR_UPDATE_ANTS_PERSONAL_DATA_EMAIL, READ_OR_UPDATE_UTAC_PERSONAL_DATA_EMAIL, SEND_LIMITATION_PERSONAL_DATA_EMAIL, SEND_OPPOSITION_PERSONAL_DATA_EMAIL,
} from '@/constants/email.js'
import api from '@/api/index.js'
import { DsfrBreadcrumb } from '@gouvminint/vue-dsfr';

export default defineComponent({
  name: 'MentionsLegalesPage',

  components: { DsfrBreadcrumb, RouterLink },

  data () {
    return {
      expandedId: undefined,

      // url
      HISTOVEC_BASE_URL,

      // email
      ANTS_PERSONAL_DATA_EMAIL,
      UTAC_PERSONAL_DATA_EMAIL,
      HISTOVEC_SUPPORT_EMAIL,
      OPPOSITION_PERSONAL_DATA_EMAIL,
    }
  },

  created () {
    api.log('/legal')
    this.reproductionRequestEmail = mailTo(REPRODUCTION_REQUEST_EMAIL)
    this.readOrUpdateAntsPersonalDataEmail = mailTo(READ_OR_UPDATE_ANTS_PERSONAL_DATA_EMAIL)
    this.readOrUpdateUtacPersonalDataEmail = mailTo(READ_OR_UPDATE_UTAC_PERSONAL_DATA_EMAIL)
    this.sendLimitationPersonalDataEmail = mailTo(SEND_LIMITATION_PERSONAL_DATA_EMAIL)
    this.sendOppositionPersonalDataEmail = mailTo(SEND_OPPOSITION_PERSONAL_DATA_EMAIL)
  },
})
</script>

<template>
  <div
    class="fr-grid-row fr-grid-row--gutters"
  >
    <div class="fr-col-12">
      <DsfrBreadcrumb
        class="fr-mb-0"
        :links="[
          {
            to: '/accueil',
            text: 'Accueil',
          },
          {
            text: 'Mentions légales',
          },
        ]"
      />
    </div>
    <div class="fr-col-12">
      <h1>Mentions légales</h1>

      <h2>
        Informations éditeurs
      </h2>
      <p>
        Ce site est géré par la Délégation à la sécurité routière (DSR) du ministère de l’intérieur, Place Beauvau 75800 PARIS CEDEX 08 Tél. : 01 49 27 49 27.
      </p>
      <p>
        Il est hébergé par la Direction du numérique (DNUM) du ministère de l’intérieur - Place Beauvau - 75800 Paris CEDEX 08.
      </p>

      <h3>
        Directeur de la publication
      </h3>
      <p>
        Marie GAUTIER-MELLERAY, déléguée interministérielle à la sécurité routière.
      </p>

      <h3>
        Avertissement
      </h3>
      <p>
        Malgré tout le soin apporté à la mise en ligne des informations, des erreurs typographiques ou des inexactitudes techniques ne peuvent être exclues. Le ministère de l’intérieur se réserve le droit de les corriger à tout moment dès qu’elles sont portées à sa connaissance.
      </p>
      <p>
        Les informations présentées contenues sur le site
        <router-link
          class="fr-link"
          to="/accueil"
        >
          {{ HISTOVEC_BASE_URL }}
        </router-link>
        sont susceptibles de faire l’objet de mise à jour à tout moment.
      </p>

      <h3>
        Crédits
      </h3>
      <p>
        Le ministère de l'intérieur est titulaire des droits relatifs à la propriété intellectuelle des contenus (infographies et autres éléments techniques et graphiques), disponibles sur le site
        <router-link
          class="fr-link"
          to="/accueil"
        >
          {{ HISTOVEC_BASE_URL }}
        </router-link>
        .
      </p>
      <p>
        Ces éléments sont couverts par des droits de propriété intellectuelle de tiers. En application du code de la propriété intellectuelle, toute reproduction ou représentation partielle ou totale pour quelque usage que ce soit est interdite sans l'accord préalable des titulaires de droits. Pour toute demande de reproduction,
        <a
          class="fr-link"
          :href="reproductionRequestEmail"
        >
          contactez-nous
        </a>
        .
      </p>
      <p>
        Sauf mention contraire, les photographies sont issues du site
        <a
          class="fr-link"
          href="http://picjumbo.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          picjumbo.com
        </a>
        et libres de droits.
      </p>

      <h2>
        Conception et réalisation
      </h2>
      <p>
        Conception et réalisation direction du numérique du ministère de l'intérieur avec le bureau de l'expertise automobile (BEA) de la Délégation à la sécurité routière (
        <a
          class="fr-link"
          href="https://www.securite-routiere.gouv.fr/mieux-nous-connaitre/qui-sommes-nous-0/la-delegation-la-securite-routiere"
          rel="noopener noreferrer"
          target="_blank"
        >
          DSR
        </a>
        ).
      </p>

      <h3>
        Liens hypertextes entrants
      </h3>
      <p>
        Tout site public ou privé est autorisé à établir, sans autorisation préalable, un lien hypertexte vers le site HistoVec.
        En revanche les pages du site
        <router-link
          class="fr-link"
          to="/accueil"
        >
          {{ HISTOVEC_BASE_URL }}
        </router-link>
        ne doivent pas être imbriquées à l’intérieur des pages d’un autre site : rien ne doit méprendre le visiteur sur l’origine d’une page vue.
        Le ministère de l'intérieur se réserve le droit de demander la suppression d'un lien qu'il estime non-conforme à l'objet du site, à ses missions ou plus généralement à l'éthique d'un portail public.
        L’autorisation de mise en place d’un lien est valable pour tout support, à l’exception de ceux diffusant des informations à caractère polémique, pornographique, xénophobe ou pouvant, dans une plus large mesure, porter atteinte à la sensibilité du plus grand nombre.
      </p>

      <h3>
        Liens hypertextes sortants
      </h3>
      <p>
        Le site indique en permanence l'identité des sites externes indiqués en lien, et ce sur toutes les pages. Néanmoins, ces pages web dont les adresses URL sont régulièrement vérifiées ne font pas partie du site et par conséquent n'engagent en rien la responsabilité du site
        <router-link
          class="fr-link"
          to="/accueil"
        >
          {{ HISTOVEC_BASE_URL }}
        </router-link>
        .
      </p>

      <h3>
        Code applicatif open source
      </h3>
      <p>
        Conformément à la
        <a
          class="fr-link"
          href="https://www.legifrance.gouv.fr/dossierlegislatif/JORFDOLE000031589829/"
          rel="noopener noreferrer"
          target="_blank"
        >
          loi pour une République numérique
        </a>
        , le code de l'application HistoVec est libre et opensource, publié sous
        <a
          class="fr-link"
          href="https://www.gnu.org/licenses/lgpl-3.0.fr.html"
          rel="noopener noreferrer"
          target="_blank"
        >
          licence LGPL
        </a>
        sur
        <a
          class="fr-link"
          href="https://github.com/histovec/histovec-beta"
          rel="noopener noreferrer"
          target="_blank"
        >
          Github
        </a>.
      </p>

      <h2>
        Stabilité des adresses
      </h2>
      <p>Nous essayons de maintenir des adresses URL de pages stables. Toutefois, ce site pouvant faire à tout moment l’objet de réorganisations, nous ne pouvons pas garantir la stabilité de l’adresse des pages internes du site.</p>

      <h2>
        Droit d’auteur
      </h2>
      <p>Les contenus disponibles sur ce site sont protégés par le droit d’auteur. Aux termes des dispositions de l’article L. 122-4 du code de la propriété intellectuelle, vous ne pouvez reproduire tout ou partie de ces œuvres sans en avoir obtenu l’autorisation expresse au préalable.</p>

      <h3>
        Limitations de responsabilité
      </h3>
      <p>Le site HistoVec fournit les informations issues du système d’immatriculation des véhicules (SIV). La responsabilité de l'éditeur ne peut être engagée sur des inexactitudes concernant les informations fournies, qu’elles proviennent d’erreurs issues du Système d’immatriculation des véhicules ou du traitement relatif à la gestion du contrôle technique des véhicules mis en œuvre par l’Organisme Technique Central, ou d’anomalies de traitement informatique.</p>
      <p>Les modalités d’exercice des droits d’accès, de rectification, d’effacement et d’opposition sont décrits ci-dessous.</p>
      <p>
        S’agissant des informations issues du système d’immatriculation des véhicules fournies par HistoVec, les droits d’accès et de rectification, respectivement prévus aux articles 15 et 16 du RGPD, des données issues du système d’immatriculation des véhicules s’exercent en justifiant son identité, par voie électronique (
        <a
          class="fr-link"
          :href="readOrUpdateAntsPersonalDataEmail"
        >
          {{ ANTS_PERSONAL_DATA_EMAIL }}
        </a>
        ) ou par voie postale auprès de l’Agence Nationale des Titres Sécurisés - 18 rue Irénée Carré - BP 70474 - 08101 Charleville-Mézières.
      </p>
      <p>
        S’agissant des informations issues de l’UTAC-OTC relatives au contrôle technique et au kilométrage des véhicules consultables sur HistoVec, les droits d’accès et de rectification des données s’exercent en justifiant son identité, par voie électronique (
        <a
          class="fr-link"
          :href="readOrUpdateUtacPersonalDataEmail"
        >
          {{ UTAC_PERSONAL_DATA_EMAIL }}
        </a>
        ) ou par voie postale auprès de l’UTAC-OTC : UTAC UdS -  Union Technique de l'Automobile, du Motocycle et du Cycle Union de Syndicats -  Autodrome de Linas-Montlhéry - BP 20212 -  91311 Montlhéry Cedex.
      </p>
      <p>
        En ce qui concerne le droit à la limitation des données prévu à l’article 18 du RGPD, toute personne concernée peut en faire la demande auprès de la DSR par courriel adressé à l’adresse suivante :
        <a
          class="fr-link"
          :href="sendLimitationPersonalDataEmail"
        >
          {{ HISTOVEC_SUPPORT_EMAIL }}
        </a>
        . Chaque demande sera étudiée au cas par cas pour déterminer si elle est légitime.
      </p>
      <p>
        Le droit d’opposition, prévu à l’article 21 du RGPD, s’exerce en justifiant son identité, par voie postale (place Beauvau – 75800 PARIS cedex 08) ou par voie électronique (
        <a
          class="fr-link"
          :href="sendOppositionPersonalDataEmail"
        >
          {{ OPPOSITION_PERSONAL_DATA_EMAIL }}
        </a>
        ) auprès de la Délégation à la sécurité routière du ministère de l’intérieur.
      </p>
      <p>Le droit à l’effacement, prévu à l’article 17 du RGPD, ne s’applique pas dans la mesure où le téléservice est nécessaire à l’exécution d’une mission d’intérêt public.</p>

      <h3>
        Disponibilité
      </h3>
      <p>
        Le ministère de l’intérieur s’efforce de donner accès en continu au site. Néanmoins, la responsabilité du ministère de l’intérieur ne peut être engagée en cas de non accessibilité à son site internet et à l’ensemble des téléservices proposés.
        <br>
        Le ministère de l’intérieur se réserve le droit de ne pouvoir garantir l’accessibilité à son site et à l’ensemble des téléservices proposés en cas de force majeure, notamment en cas de panne ou d’intention technique de maintenance.
        <br>
        Site optimisé pour Firefox 45+ et Chrome 50+.
      </p>

      <h3>
        Propriété intellectuelle et droits d'utilisation
      </h3>
      <p>
        L'utilisateur s'engage, sous peine de voir sa responsabilité civile et/ou pénale engagée, à ne pas utiliser le site HistoVec pour :
        <ul class="fr-ml-4w  fr-pl-0">
          <li>Transmettre par quelque procédé que ce soit (e-mail ou autres), tout contenu incluant des programmes, des codes, des virus, etc. destinés à détruire ou limiter les fonctionnalités du site Internet de l’éditeur ;</li>
          <li>Transmettre par quelque procédé que ce soit dans les services interactifs proposés sur le site Internet de l’éditeur, tout contenu illicite ou nuisible, et notamment des photos ou messages à caractère injurieux, insultant, diffamant, dénigrant, dégradant, raciste, xénophobe, sexiste, pornographique, menaçant ou qui pourrait inciter à la haine ou au harcèlement et allant à l'encontre du droit au respect de la vie privée ou sans rapport avec les thèmes proposés ;</li>
          <li>Transmettre par quelque procédé que ce soit, tout contenu et notamment des photos violant les droits de la propriété intellectuelle, industrielle, les droits de la personne, etc.</li>
        </ul>
      </p>

      <h2>
        Autre
      </h2>
      <div class="fr-col-12">
        <DsfrAccordionsGroup>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Textes de référence"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p class="fr-text--xl">
                Code de la consommation :
                <a
                  class="fr-link"
                  href="https://www.legifrance.gouv.fr/codes/id/LEGISCTA000032227144/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  articles L131-1 à L131-4
                </a>
              </p>
              <p>
                Obligation générale d'information précontractuelle
              </p>

              <p class="fr-text--xl">
                Code de la consommation :
                <a
                  class="fr-link"
                  href="https://www.legifrance.gouv.fr/codes/id/LEGISCTA000032807114/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  article R111-1
                </a>
              </p>
              <p>
                Obligation générale d'information précontractuelle
              </p>

              <p class="fr-text--xl">
                Loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique :
                <a
                  class="fr-link"
                  href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000032236011/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  article 19
                </a>
                et
                <a
                  class="fr-link"
                  href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000018048180/2022-05-11"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  article 20
                </a>
              </p>

              <p class="fr-text--xl">
                Loi n°2004-575 du 21 juin 2004 pour la confiance dans
                l'économie numérique :
                <a
                  class="fr-link"
                  href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000045292730/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  article 6
                </a>
              </p>
            </DsfrAccordion>
          </li>
          <li>
            <DsfrAccordion
              class="background-accordeon-white"
              title="Pour en savoir plus"
              :expanded-id="expandedId"
              @expand="expandedId = $event"
            >
              <p class="fr-text--xl">
                Obligations en cas d'utilisation de
                <a
                  class="fr-link"
                  href="https://www.cnil.fr/fr/site-web-cookies-et-autres-traceurs"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  cookies et autres traceurs
                </a>
              </p>
              <p>
                Commission nationale de l'informatique et des libertés (Cnil)
              </p>
            </DsfrAccordion>
          </li>
        </DsfrAccordionsGroup>
      </div>
    </div>
  </div>
</template>
