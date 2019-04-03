import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Search from '@/components/Search'
import Report from '@/components/Report'
import Faq from '@/components/infos/Faq'
import Legal from '@/components/infos/Legal'
import Contact from '@/components/feedback/Contact'
import Feedback from '@/components/feedback/Feedback'
import Buyer from '@/components/infos/Buyer'
import NotFound from '@/components/infos/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/histovec',
  routes: [
    { name: 'root', path: '/', redirect: { name: 'home' }, meta: { title: 'Histovec - Accueil' } },
    { name: 'home', path: '/home', component: Home, meta: { title: 'Histovec - Accueil' } },
    { name: 'search', path: '/search', component: Search, meta: { title: 'Histovec - Recherche' } },
    { name: 'report', path: '/report', component: Report, meta: { title: 'Histovec - Rapport' } },
    { name: 'faq', path: '/faq', component: Faq, meta: { title: 'Histovec - FAQ' } },
    { name: 'legal', path: '/legal', component: Legal, meta: { title: 'Histovec - Mentions Légales' } },
    { name: 'contact', path: '/contact', component: Contact, meta: { title: 'Histovec - Contact' } },
    { name: 'feedback', path: '/feedback', component: Feedback, meta: { title: 'Histovec - Signaler un erreur' } },
    { name: 'buyer', path: '/buyer', component: Buyer, meta: { title: 'Histovec - Acheteur' } },
    { name: 'notfound', path: '/*', component: NotFound, meta: { title: 'Histovec - Page non trouvée' } }
  ]
})
