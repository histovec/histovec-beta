import { createRouter, createWebHistory } from 'vue-router'

import AccueilPage from '@/views/AccueilPage.vue'

const AccessibilitePage = () => import('@/views/AccessibilitePage.vue')
const AcheteurPage = () => import('@/views/AcheteurPage.vue')
const ContactPage = () => import('@/views/ContactPage.vue')
const DonneesPersonnellesPage = () => import('@/views/DonneesPersonnellesPage.vue')
const FAQPage = () => import('@/views/FAQPage.vue')
const MentionsLegalesPage = () => import('@/views/MentionsLegalesPage.vue')
const PlanDuSitePage = () => import('@/views/PlanDuSitePage.vue')
const ProprietairePage = () => import('@/views/ProprietairePage.vue')
const RapportAcheteurPage = () => import('@/views/RapportAcheteurPage.vue')
const RapportVendeurPage = () => import('@/views/RapportVendeurPage.vue')

const NotFoundPage = () => import('@/views/error/NotFoundPage.vue')
const ServiceUnavailablePage = () => import('@/views/error/ServiceUnavailablePage.vue')


const routes = (
  import.meta.env.VITE_IS_HISTOVEC_UNAVAILABLE === 'true' ?
  [
    { path: '/', name: 'root', redirect: { name: 'serviceIndisponible' }, meta: { title: 'HistoVec - Service indisponible' } },
    { path: '/service-indisponible', name: 'serviceIndisponible', component: ServiceUnavailablePage, meta: { title: 'HistoVec - Service indisponible' } },
    { path: '/:pathMatch(.*)*', name: 'pageNonTrouvee', redirect: { name: 'serviceIndisponible' }, meta: { title: 'HistoVec - Service indisponible' } },
  ] :
  [
    { path: '/', name: 'root', redirect: { name: 'accueil' }, meta: { title: 'HistoVec - Accueil' } },
    { path: '/accueil', name: 'accueil', component: AccueilPage, meta: { title: 'HistoVec - Accueil' } },
    { path: '/proprietaire', name: 'proprietaire', component: ProprietairePage, meta: { title: 'HistoVec - Propriétaire' } },
    { path: '/acheteur', name: 'acheteur', component: AcheteurPage, meta: { title: 'HistoVec - Acheteur' } },
    { path: '/rapport-acheteur', name: 'rapportAcheteur', component: RapportAcheteurPage, meta: { title: 'HistoVec - Rapport acheteur' } },
    { path: '/rapport-vendeur', name: 'rapportVendeur', component: RapportVendeurPage, meta: { title: 'HistoVec - Rapport vendeur' } },
    { path: '/faq', name: 'faq', component: FAQPage, meta: { title: 'HistoVec - FAQ & Liens utiles' } },
    { path: '/contact', name: 'contact', component: ContactPage, meta: { title: 'HistoVec - Contact' } },
    { path: '/plan-du-site', name: 'planDuSite', component: PlanDuSitePage, meta: { title: 'HistoVec - Plan du site' } },
    { path: '/accessibilite', name: 'accessibilite', component: AccessibilitePage, meta: { title: 'HistoVec - Accessibilité' } },
    { path: '/mentions-legales', name: 'mentionsLegales', component: MentionsLegalesPage, meta: { title: 'HistoVec - Mentions légales' } },
    { path: '/donnees-personnelles', name: 'donneesPersonnelles', component: DonneesPersonnellesPage, meta: { title: 'HistoVec - Données personnelles' } },

    // Errors pages
    { path: '/service-indisponible', name: 'serviceIndisponible', component: ServiceUnavailablePage, meta: { title: 'HistoVec - Service indisponible' } },
    { path: '/:pathMatch(.*)*', name: 'pageNonTrouvee', component: NotFoundPage, meta: { title: 'HistoVec - Page non trouvée' } },
  ]
)

export default createRouter({
  history: createWebHistory(`/${import.meta.env.VITE_TITLE}`),
  routes,
  scrollBehavior () {
    // Scroll top for every route navigation
    return {
      top: 0,
      left: 0,
      behavior: 'smooth',
    }
  },
})
