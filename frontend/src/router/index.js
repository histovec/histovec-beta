import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Search from '@/components/Search'
import Report from '@/components/Report'
import Faq from '@/components/Faq'
import Legal from '@/components/Legal'
import Contact from '@/components/Contact'
import Feedback from '@/components/Feedback'
import Buyer from '@/components/Buyer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {name: 'root', path: '/histovec/', redirect: { name: 'home' }},
    {name: 'home', path: '/histovec/home', component: Home},
    {name: 'search', path: '/histovec/search', component: Search},
    {name: 'report', path: '/histovec/report', component: Report},
    {name: 'faq', path: '/histovec/faq', component: Faq},
    {name: 'legal', path: '/histovec/legal', component: Legal},
    {name: 'contact', path: '/histovec/contact', component: Contact},
    {name: 'feedback', path: '/histovec/feedback', component: Feedback},
    {name: 'buyer', path: '/histovec/buyer', component: Buyer}
  ]
})
