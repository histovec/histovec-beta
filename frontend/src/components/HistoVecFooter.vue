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
  <!-- @todo: implement 'no-cookie' props in DsfrFooter to merge /donnees-personnelles and /cookies links and label like this :
    to: '/donnees-personnelles-et-cookies'
    label: 'Données personnelles & Gestion des cookies'
    and mask "Gestion des cookies" link
    (Comportement attendu par l'équipe RG2A du BPSA)

    For now, both routes redirect to /donnees-personnelles-et-cookies page
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
      @todo: quel licence utiliser ? Copyright non approprié d'après la Simon DSR
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


