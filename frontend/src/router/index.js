import Vue from 'vue'
import Router from 'vue-router'


function loadView(view) {
  return () => import(/* webpackChunkName: "component-[request]" */ `@/components/${view}.vue`)
}

import Home from '@/components/Home'
const Search = loadView('Search')
const Report = loadView('Report')
const Faq = loadView('infos/Faq')
const Legal = loadView('infos/Legal')
const Buyer = loadView('infos/Buyer')
import NotFound from '@/components/infos/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/' + process.env.VUE_APP_TITLE,
  routes: [
    {name: 'root', path: '/', redirect: { name: 'home' }, meta: { title: 'HistoVec - Accueil' }},
    {name: 'home', path: '/home', component: Home, meta: { title: 'HistoVec - Accueil' }},
    {name: 'search', path: '/search', component: Search, meta: { title: 'HistoVec - Recherche' }},
    {name: 'report', path: '/report', component: Report, meta: { title: 'HistoVec - Rapport' }},
    {name: 'faq', path: '/faq', component: Faq, meta: { title: 'HistoVec - FAQ' }},
    {name: 'legal', path: '/legal', component: Legal, meta: { title: 'HistoVec - Mentions Légales' }},
    {name: 'buyer', path: '/buyer', component: Buyer, meta: { title: 'HistoVec - Acheteur' }},
    {name: 'notfound', path: '/*', component: NotFound, meta: { title: 'HistoVec - Page non trouvée' }}
  ]
})
