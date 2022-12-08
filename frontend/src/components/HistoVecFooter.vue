<script>
import { defineComponent } from 'vue'

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
          alt: 'Redirection vers le site securite-routiere.gouv.fr',
        },
      },
      beforeMandatoryLinks: [
        {
          label: 'Plan du site',
          to: '/plan-du-site',
        },
      ],
      mandatoryLinks: [
          {
            label: 'Accessibilité : non conforme',
            to: '/accessibilite',
          },
          {
            label: 'Mentions légales',
            to: '/mentions-legales',
          },
          {
            label: 'Données personnelles & Gestion des cookies',
            to: '/donnees-personnelles-et-cookies',
          },
        ],
      images: {
        logoHistoVecSvg,
        logoSecuriteRoutiereMb90Svg,
      },
      licenceText: 'Sauf mention contraire, tous les contenus de ce site sont sous ',
    }
  },
})
</script>

<template>
  <DsfrFooter
    :before-mandatory-links="beforeMandatoryLinks"
    :mandatory-links="mandatoryLinks"
    :logo-text="['Ministère', 'de l’intérieur']"
    home-link="/accueil"
    no-cookie
    :partners="partners"
    :ecosystem-links="ecosystemLinks"
    operator-link-text="Logo HistoVec"
    operator-to="/accueil"
    :operator-img-src="images.logoHistoVecSvg"
    operator-img-alt="Logo HistoVec"
    :licence-text="licenceText"
    licence-to="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
    licence-name="licence etalab-2.0"
  >
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


