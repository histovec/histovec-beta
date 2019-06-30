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
  routes: [
    {name: 'root', path: '/histovec/', redirect: { name: 'home' }, meta: { title: 'Histovec - Accueil' }},
    {name: 'home', path: '/histovec/home', component: Home, meta: { title: 'Histovec - Accueil' }},
    {name: 'search', path: '/histovec/search', component: Search, meta: { title: 'Histovec - Recherche' }},
    {name: 'report', path: '/histovec/report', component: Report, meta: { title: 'Histovec - Rapport' }},
    {name: 'faq', path: '/histovec/faq', component: Faq, meta: { title: 'Histovec - FAQ' }},
    {name: 'legal', path: '/histovec/legal', component: Legal, meta: { title: 'Histovec - Mentions Légales' }},
    {name: 'buyer', path: '/histovec/buyer', component: Buyer, meta: { title: 'Histovec - Acheteur' }},
    {name: 'notfound', path: '/histovec/*', component: NotFound, meta: { title: 'Histovec - Page non trouvée' }}
  ]
})
