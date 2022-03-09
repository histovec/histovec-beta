import Vue from 'vue'
import Router from 'vue-router'


function loadView(view) {
  return () => import(/* webpackChunkName: "component-[request]" */ `@/components/${view}.vue`)
}

import Home from '@/components/Home'
const Search = loadView('Search')
const Report = loadView('Report')
const Faq = loadView('infos/Faq')
const LegalNotice = loadView('infos/LegalNotice')
const InformationNotices = loadView('infos/InformationNotices')
const Buyer = loadView('infos/Buyer')
import Unavailable from '@/components/infos/Unavailable'
import NotFound from '@/components/infos/NotFound'

Vue.use(Router)

const isHistovecUnavailable = false
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
  base: '/' + process.env.VUE_APP_TITLE,
  routes,
  // Scroll top for every route navigation
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
