import Vue from 'vue'
import Router from 'vue-router'


import Home from '@/components/HomePage.vue'
const Search = () => import('../components/SearchPage.vue')
const Report = () => import('../components/ReportPage.vue')
const Faq = () => import('../components/infos/FaqPage.vue')
const LegalNotice = () => import('../components/infos/LegalNoticePage.vue')
const InformationNotices = () => import('../components/infos/InformationNoticesPage.vue')
const Buyer = () => import('../components/infos/BuyerPage.vue')
import Unavailable from '@/components/infos/UnavailablePage.vue'
import NotFound from '@/components/infos/NotFoundPage.vue'

Vue.use(Router)

const isHistovecUnavailable = import.meta.env.VITE_IS_HISTOVEC_UNAVAILABLE === 'true'
// eslint-disable-next-line no-console
console.log(`isHistovecUnavailable = ${isHistovecUnavailable}`)

let routes = []

if (isHistovecUnavailable) {
  routes = [
    {name: 'root', path: '/', redirect: { name: 'unavailable' }, meta: { title: 'HistoVec - Service indisponible' }},
    {name: 'unavailable', path: '/unavailable', component: Unavailable, meta: { title: 'HistoVec - Service indisponible' }},
    {name: 'notfound', path: '/*', redirect: { name: 'unavailable' }, meta: { title: 'HistoVec - Service indisponible' }}
  ]
} else {
  routes = [
    {name: 'root', path: '/', redirect: { name: 'home' }, meta: { title: 'HistoVec - Accueil' }},
    {name: 'home', path: '/home', component: Home, meta: { title: 'HistoVec - Accueil' }},
    {name: 'search', path: '/search', component: Search, meta: { title: 'HistoVec - Recherche' }},
    {name: 'report', path: '/report', component: Report, meta: { title: 'HistoVec - Rapport' }},
    {name: 'faq', path: '/faq', component: Faq, meta: { title: 'HistoVec - FAQ' }},
    {name: 'legal-notice', path: '/legal-notice', component: LegalNotice, meta: { title: 'HistoVec - Mentions Légales' }},
    {name: 'information-notices', path: '/information-notices', component: InformationNotices, meta: { title: 'HistoVec - Mentions d\'information' }},
    {name: 'buyer', path: '/buyer', component: Buyer, meta: { title: 'HistoVec - Acheteur' }},
    {name: 'unavailable', path: '/unavailable', component: Unavailable, meta: { title: 'HistoVec - Service indisponible' }},
    {name: 'not-found', path: '/*', component: NotFound, meta: { title: 'HistoVec - Page non trouvée' }}
  ]
}

export default new Router({
  mode: 'history',
  base: `/${import.meta.env.VITE_TITLE}`,
  routes,
  // Scroll top for every route navigation
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
