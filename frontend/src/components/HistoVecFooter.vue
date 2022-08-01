<script>
import { defineComponent } from 'vue'

import npmConf from '../../package.json'

import logoHistoVecSvg from '@/assets/img/logo_histovec_simple.svg?url'
import logoSecuriteRoutiereMb90Svg from '@/assets/img/securite_routiere_mb90.svg?url'


export default defineComponent({
  name: 'HistoVecFooter',
  data () {
    return {
      ecosystemLinks: [
        {
          label: 'legifrance.gouv.fr',
          href: 'https://legifrance.gouv.fr',
        },
        {
          label: 'gouvernement.fr',
          href: 'https://gouvernement.fr',
        },
        {
          label: 'service-public.fr',
          href: 'https://service-public.fr',
        },
        {
          label: 'data.gouv.fr',
          href: 'https://data.gouv.fr',
        },

        {
          label: 'interieur.gouv.fr',
          href: 'https://interieur.gouv.fr',
        },
        {
          label: 'securite-routiere.gouv.fr',
          href: 'https://securite-routiere.gouv.fr',
        },
        {
          label: 'immatriculation.ants.gouv.fr',
          href: 'https://immatriculation.ants.gouv.fr',
        },
      ],
      partners: {
        mainPartner: {
          name: 'Sécurité routière',
          href: 'https://securite-routiere.gouv.fr',
          logo: logoSecuriteRoutiereMb90Svg,
          alt: 'Sécurité routière',
        },
      },
      beforeMandatoryLinks: [
        {
          label: 'Plan du site',
          to: '/plan-du-site',
        },
      ],
      images: {
        logoHistoVecSvg,
        logoSecuriteRoutiereMb90Svg,
      },
      licenceText: `HistoVec version ${npmConf.version}`,
    }
  },
})
</script>

<template>
  <!-- @todo @mutualizeCookieEtDonneesPersonnelles:
  Implémenter une props 'no-cookie' sur le DsfrFooter pour fusionner les links /donnees-personnelles et /cookies en un unique link  and label like this /donnees-personnelles-et-cookies
  dans le cas où il n'y aurait pas de cookie utilisé sur le site web (comportement attendu par l'équipe RG2A du BPSA) :
  Cette props 'no-cookie' à true aurait pour effet :
    1 - d'ignorer les props personalDataLink et cookiesLink
    2 - de masquer le HTML associé à ces 2 props
    3 - d'utiliser la props personalDataAndCookiesLink (à implémenter) avec comme valeur par défaut '/donnees-personnelles-et-cookies' et comme label (dans les mandatoryLinks) 'Données personnelles & Gestion des cookies'
  Implémenter la props 'personalDataAndCookiesLink' pour ajouter un élément à la fin des mandatoryLinks (cf -3)

  Pour le moment, les 2 routes (personalDataLink et cookiesLink)redirigent vers la page /donnees-personnelles-et-cookies
  -->
  <DsfrFooter
    a11y-compliance="non conforme"
    :before-mandatory-links="beforeMandatoryLinks"
    :logo-text="['Ministère', 'de l’intérieur']"
    home-link="/accueil"
    a11y-compliance-link="/accessibilite"
    legal-link="/mentions-legales"
    personal-data-link="/donnees-personnelles-et-cookies"
    cookies-link="/donnees-personnelles-et-cookies"
    no-cookie
    :partners="partners"
    :ecosystem-links="ecosystemLinks"
    operator-link-text="Logo HistoVec"
    operator-to="/accueil"
    :operator-img-src="images.logoHistoVecSvg"
    operator-img-alt="Logo HistoVec"
    :licence-text="licenceText"
    licence-to=""
    licence-name="copyright © 2018"
  >
    <!--
      @todo @license: Quelle licence utiliser ? Copyright non approprié ? CECILL ?
    -->
    <template #description>
      <div>
        <p>
          HistoVec : un service proposé par la délégation à la sécurité routière.
        </p>
        <p>
          Jouez la transparence : partagez l'historique de votre véhicule.
        </p>
      </div>
    </template>
  </DsfrFooter>
</template>


