<script>
import { defineComponent } from 'vue'

import logoHistoVecSvg from '@/assets/img/logo_histovec_simple.svg?url'
import logoSecuriteRoutiereMb90Svg from '@/assets/img/securite_routiere_mb90.svg?url'

import '@/assets/css/background.css'

export default defineComponent({
  name: 'HistoVecFooter',
  data () {
    return {
      contentLinks: [
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
      mandatoryLinks: [
          {
            label: 'Plan du site',
            to: '/plan-du-site',
          },
          {
            label: 'Accessibilité : non conforme',
            to: '/accessibilite',
          },
          {
            label: 'Mentions légales',
            to: '/mentions-legales',
          },
          {
            label: 'Données personnelles et Gestion des cookies',
            to: '/donnees-personnelles-et-cookies',
          },
        ],
      images: {
        logoHistoVecSvg,
        logoSecuriteRoutiereMb90Svg,
      },
    }
  },
})
</script>

<template>
  <footer class="fr-footer" role="contentinfo" id="footer">
    <div class="fr-container">
      <div class="fr-footer__body">
        <div class="fr-footer__brand fr-enlarge-link background-default-white">
          <p class="fr-logo">
            Ministère
            <br>de l’intérieur
          </p>
          <router-link class="fr-footer__brand-link" to="/" title="Ministère de l’intérieur - HistoVec - Retour à l’accueil du site">
            <img class="fr-footer__logo footer__logo__histovec" :src='images.logoHistoVecSvg' alt="" />
          </router-link>
        </div>
        <div class="fr-footer__content">
          <p class="fr-footer__content-desc">HistoVec : un service proposé par la délégation à la sécurité routière.
          </p>
          <p class="fr-footer__content-desc">Jouez la transparence : partagez l'historique de votre véhicule.
          </p>
          <ul class="fr-footer__content-list">
            <li v-for="(contentLink, index) in contentLinks"
                :key="index"
                class="fr-footer__content-item"
            >
              <a class="fr-footer__content-link" target="_blank" :href="contentLink.href">{{ contentLink.label }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="fr-footer__partners">
        <h4 class="fr-footer__partners-title">Nos partenaires</h4>
        <div class="fr-footer__partners-logos">
          <div class="fr-footer__partners-main background-default-white">
            <a id="securiteRoutiereIconeImage" class="fr-footer__partners-link" rel="noopener noreferrer" target="_blank" href="https://securite-routiere.gouv.fr" title="Securité routière - Lien vers le site securite-routiere.gouv.fr">
              <img class="fr-footer__logo footer__logo__securiteRoutiere" :src='images.logoSecuriteRoutiereMb90Svg' alt="" />
            </a>
          </div>
        </div>
      </div>
      <div class="fr-footer__bottom">
        <ul class="fr-footer__bottom-list">
          <li v-for="(mandatoryLink, index) in mandatoryLinks"
              :key="index"
              class="fr-footer__bottom-item"
          >
            <router-link class="fr-footer__bottom-link" :to="mandatoryLink.to">{{ mandatoryLink.label }}</router-link>
          </li>
        </ul>
        <div class="fr-footer__bottom-copy">
          <p>Sauf mention contraire, tous les contenus de ce site sont sous <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank">licence etalab-2.0</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
<style scoped>

#securiteRoutiereIconeImage:after {
  content: none;
}

.footer__logo__histovec{
  height: 5rem;
}

.footer__logo__securiteRoutiere{
  height: 5rem;
}
</style>

