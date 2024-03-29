import { createRouter, createWebHistory } from 'vue-router'

import AccueilPage from '@/views/AccueilPage.vue'
import { TYPE_RAPPORT } from '../constants/type'

const AccessibilitePage = () => import('@/views/AccessibilitePage.vue')
const AcheteurPage = () => import('@/views/AcheteurPage.vue')
const ContactPage = () => import('@/views/ContactPage.vue')
const DonneesPersonnellesEtCookiesPage = () => import('@/views/DonneesPersonnellesEtCookiesPage.vue')
const FAQPage = () => import('@/views/FAQPage.vue')
const MentionsLegalesPage = () => import('@/views/MentionsLegalesPage.vue')
const PlanDuSitePage = () => import('@/views/PlanDuSitePage.vue')
const ProprietairePage = () => import('@/views/ProprietairePage.vue')
const RapportPage = () => import('@/views/RapportPage.vue')
const NotFoundPage = () => import('@/views/error/NotFoundPage.vue')
const UnavailableServicePage = () => import('@/views/error/UnavailableServicePage.vue')
const UnintendedErrorPage = () => import('@/views/error/UnintendedErrorPage.vue')


// @flag @makeSiteUnavailable
const isHistoVecUnavailable = false

const routes = (
  isHistoVecUnavailable ?
  [
    { path: '/', name: 'root', redirect: { name: 'serviceIndisponible' }, meta: { title: 'HistoVec - Service indisponible' } },
    { path: '/service-indisponible', name: 'serviceIndisponible', component: UnavailableServicePage, meta: { title: 'HistoVec - Service indisponible' } },
    { path: '/:pathMatch(.*)*', name: 'pageNonTrouvee', redirect: { name: 'serviceIndisponible' }, meta: { title: 'HistoVec - Service indisponible' } },
  ] :
  [
    { path: '/', name: 'root', redirect: { name: 'accueil' }, meta: { title: 'HistoVec - Accueil' } },
    { path: '/accueil', name: 'accueil', component: AccueilPage, meta: { title: 'HistoVec - Accueil' } },
    { path: '/proprietaire', name: 'proprietaire', component: ProprietairePage, meta: { title: 'HistoVec - Propriétaire' } },
    { path: '/acheteur', name: 'acheteur', component: AcheteurPage, meta: { title: 'HistoVec - Acheteur' } },
    { path: '/rapport-acheteur', name: 'rapportAcheteur', component: RapportPage, props: () => ({ typeRapport: TYPE_RAPPORT.ACHETEUR }), meta: { title: 'HistoVec - Rapport acheteur' } },
    { path: '/rapport-vendeur', name: 'rapportVendeur', component: RapportPage, props: () => ({ typeRapport: TYPE_RAPPORT.VENDEUR }), meta: { title: 'HistoVec - Rapport vendeur' } },
    { path: '/faq', name: 'faq', component: FAQPage, meta: { title: 'HistoVec - FAQ et Liens utiles' } },
    { path: '/contact', name: 'contact', component: ContactPage, meta: { title: 'HistoVec - Contact' } },
    { path: '/plan-du-site', name: 'planDuSite', component: PlanDuSitePage, meta: { title: 'HistoVec - Plan du site' } },
    { path: '/accessibilite', name: 'accessibilite', component: AccessibilitePage, meta: { title: 'HistoVec - Accessibilité' } },
    { path: '/mentions-legales', name: 'mentionsLegales', component: MentionsLegalesPage, meta: { title: 'HistoVec - Mentions légales' } },
    { path: '/donnees-personnelles-et-cookies', name: 'donneesPersonnelles', component: DonneesPersonnellesEtCookiesPage, meta: { title: 'HistoVec - Données personnelles et Gestion des cookies' } },
    {
      path: '/report',
      name: 'ancienRapport',
      redirect: to => {
        const { id, key } = to.query
        if (id && key) {
          // Rétrocompatibilité de l'ancien rapport acheteur
          return { path: '/rapport-acheteur', query: { id: to.query.id, key: to.query.key } }
        }
        // Ancien rapport vendeur non fonctionnel (le format du cache du rapport vendeur a changé) => on invalide l'ancien cache en forçant une nouvelle recherche via le formulaira de la page Propriétaire
        // On force aussi à utiliser la nouvelle url /rapport-vendeur
        return { path: '/proprietaire' }
      },
      meta: { title: 'HistoVec - Ancien rapport' },
    },

    // Errors pages
    { path: '/erreur-inattendue', name: 'erreurInattendue', component: UnintendedErrorPage,
      props: route => ({
        title: route.query.title,
        errorTitle: route.query.errorTitle,
        errorMessages: route.query.errorMessages ? JSON.parse(route.query.errorMessages) : undefined,
        primaryAction: route.query.primaryAction ? JSON.parse(route.query.primaryAction) : undefined,
        secondaryAction: route.query.secondaryAction ? JSON.parse(route.query.secondaryAction) : undefined,
      }),
      meta: { title: 'HistoVec - Erreur inattendue' },
    },
    { path: '/service-indisponible', name: 'serviceIndisponible', component: UnavailableServicePage,
      props: route => ({
        title: route.query.title,
        errorTitle: route.query.errorTitle,
        errorMessages: route.query.errorMessages ? JSON.parse(route.query.errorMessages) : undefined,
        primaryAction: route.query.primaryAction ? JSON.parse(route.query.primaryAction) : undefined,
        secondaryAction: route.query.secondaryAction ? JSON.parse(route.query.secondaryAction) : undefined,
      }),
      meta: { title: 'HistoVec - Service indisponible' },
    },
    { path: '/:pathMatch(.*)*', name: 'pageNonTrouvee', component: NotFoundPage,
      props: route => ({
        title: route.query.title,
        errorTitle: route.query.errorTitle,
        errorMessages: route.query.errorMessages ? JSON.parse(route.query.errorMessages) : undefined,
        primaryAction: route.query.primaryAction ? JSON.parse(route.query.primaryAction) : undefined,
        secondaryAction: route.query.secondaryAction ? JSON.parse(route.query.secondaryAction) : undefined,
      }),
      meta: { title: 'HistoVec - Page non trouvée' },
    },
  ]
)

export default createRouter({
  history: createWebHistory(`/${import.meta.env.VITE_TITLE}`),
  routes,
  scrollBehavior () {
    // Scroll top for every route navigation
    let element = '#header'

    if (window.location.hash) {
      element = window.location.hash
    }

    return {
      el: element,
      top: 0,
      left: 0,
      behavior: 'smooth',
    }
  },
})
