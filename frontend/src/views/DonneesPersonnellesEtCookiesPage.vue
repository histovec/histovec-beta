<script>
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import { mailTo } from '@/utils/email.js'
import {
  HISTOVEC_BASE_URL,
  ANTS_PERSONAL_DATA_EMAIL, UTAC_PERSONAL_DATA_EMAIL, HISTOVEC_SUPPORT_EMAIL, OPPOSITION_PERSONAL_DATA_EMAIL,
  READ_OR_UPDATE_ANTS_PERSONAL_DATA_EMAIL, READ_OR_UPDATE_UTAC_PERSONAL_DATA_EMAIL, SEND_LIMITATION_PERSONAL_DATA_EMAIL, SEND_OPPOSITION_PERSONAL_DATA_EMAIL,
} from '@/constants/email.js'

export default defineComponent({
  name: 'DonneePersonnellesPage',

  components: { RouterLink },

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
    this.readOrUpdateAntsPersonalDataEmail = mailTo(READ_OR_UPDATE_ANTS_PERSONAL_DATA_EMAIL)
    this.readOrUpdateUtacPersonalDataEmail = mailTo(READ_OR_UPDATE_UTAC_PERSONAL_DATA_EMAIL)
    this.sendLimitationPersonalDataEmail = mailTo(SEND_LIMITATION_PERSONAL_DATA_EMAIL)
    this.sendOppositionPersonalDataEmail = mailTo(SEND_OPPOSITION_PERSONAL_DATA_EMAIL)
  },
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
            text: 'Données personnelles et Gestion des cookies',
          },
        ]"
      />
    </div>

    <div class="fr-col-12">
      <h1>Données personnelles et Gestion des cookies</h1>

      <h5>
        Introduction
      </h5>
      <div>
        Conformément à la loi n° 78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés
        modifiée et au règlement général sur la protection des données (RGPD), la déléguée interministérielle à la
        sécurité routière (Place Beauvau 75800 Paris CEDEX 08), met en œuvre le service HistoVec (Historique des
        Véhicules) dont les finalités sont les suivantes :
        <ul class="fr-ml-4w  fr-pl-0">
          <li>Permettre aux propriétaires de véhicules de générer et de consulter l'historique et les informations techniques et administratives du véhicule ;</li>
          <li>Permettre de communiquer ce rapport à un acheteur potentiel ;</li>
          <li>Editer le certificat de situation administrative prévu à l’article R. 322-4 du code de la route.</li>
        </ul>
      </div>

      <h5>
        Données collectées
      </h5>
      <div>
        Ce téléservice a pour fondement juridique l’article 6 .1.e) du RGPD : « l'exécution d'une mission d'intérêt
        public ou relevant de l'exercice de l'autorité publique dont est investi le responsable du traitement ».
        Il collecte les catégories de données suivantes :
        <ul class="fr-ml-4w  fr-pl-0">
          <li>Les données d’identification des personnes physiques ou morales, propriétaire du véhicule (Nom/Prénom ou Raison Sociale/n° S&#8203;I&#8203;R&#8203;E&#8203;N et/ou n° SIRET) ;</li>
          <li>Les données d’identification du véhicule (numéro d’immatriculation, numéro VIN, numéro de formule du certificat d’immatriculation ou date du certificat d'immatriculation) ;</li>
          <li>Les données d’historique du véhicule (notamment date de mise en circulation, date de première immatriculation, marque, modèle, couleur, puissance CV, date de sinistre, état de vol, état de perte, gages, oppositions, procédures, résultats des contrôles techniques, kilométrages) ;</li>
          <li>Traces fonctionnelles : deux traceurs utilisés par l'observatoire de la qualité des démarches numériques. Ces traceurs sont activés par les utilisateurs qui donnent leurs avis sur le site HistoVec, à destination de l'observatoire de la qualité des démarches numériques. Ils portent sur l’identifiant de session, et la langue et la mesure d'audience.</li>
          <li>Statistiques.</li>
        </ul>
      </div>

      <p>
        Les données d’identification des personnes et d’historique du véhicule sont collectées dans le Système d’immatriculation des Véhicules (SIV) et l’UTAC-OTC.
      </p>
      <p>
        Elles sont destinées à la Délégation à la sécurité routière et à la Direction du Numérique (DNUM) du ministère de l’intérieur et aux titulaires de certificats d’immatriculation, utilisateurs de l’application web
        <router-link
          class="fr-link"
          to="/accueil"
        >
          {{ HISTOVEC_BASE_URL }}
        </router-link>
        , qui peuvent les communiquer à des acheteurs potentiels. Elles sont communiquées conformément aux dispositions des articles L. 330-2 et suivants du code de la route.
      </p>
      <p>
        Les données proviennent du SIV et sont disponibles pour la publication sur le site chaque jour.
      </p>
      <p>
        Les données relatives aux résultats des contrôles techniques et au kilométrage des véhicules proviennent de l’UTAC –OTC. HistoVec interroge la base de données de l’UTAC-OTC lors de chaque consultation.
      </p>

      <h5>
        Conservation des données
      </h5>
      <p>
        Les durées de conservation des données sont les suivantes :
      </p>
    </div>
  </div>
  <div class="fr-grid-row  fr-grid-row--gutters  fr-grid-row--center">
    <div class="fr-col-12  fr-col-md-10  fr-col-lg-10  fr-col-xl-10">
      <DsfrTable
        :title="'Durée de conservation des données personnelles'"
        :no-caption="true"
        :headers="[
          {
            text: 'Type de données',
            headerAttrs: {scope: 'col'}
          },
          {
            text: 'Durée de conservation',
            headerAttrs: {scope: 'col'}
          }
        ]"
        :rows="[
          [
            'Issues du SIV, notamment les données d’identification du véhicule (numéro d’immatriculation, numéro VIN, numéro de formule du certificat d’immatriculation… )',
            '1 mois',
          ],
          [
            'Issues de l’organisme technique central du contrôle technique des véhicules (UTAC-OTC)',
            '24 heures après chaque interrogation du système d’information de l’UTAC-OTC',
          ],
          [
            'Traceurs de session',
            'A chaque redémarrage du navigateur',
          ],
          [
            'Traceur « id » / Mesure d\'audience',
            '1 an',
          ],
          [
            'Données statistiques',
            '5 ans',
          ],
        ]"
      />
    </div>
  </div>
  <div class="fr-grid-row  fr-grid-row--gutters">
    <div class="fr-col-12">
      <h5>
        Droit d'accès et de modification
      </h5>
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
      <p>Ce téléservice est contrôlé par le délégué ministériel à la protection des données du ministère de l’intérieur (Délégué ministériel à la protection des données – Ministère de l’intérieur – Place Beauvau – 75008 Paris Cedex 08). Vous pouvez aussi déposer une réclamation auprès de la Commission nationale de l’informatique et des libertés (CNIL – 3 place de Fontenoy – TSA 80715 – 75334 Paris Cedex 07).</p>
    </div>
  </div>
</template>
