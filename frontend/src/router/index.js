import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Search from '@/components/Search'
import Report from '@/components/Report'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {name: 'root', path: '/histovec/', redirect: { name: 'home' }},
    {name: 'home', path: '/histovec/home', component: Home},
    {name: 'search', path: '/histovec/search', component: Search},
    {name: 'report', path: '/histovec/report', component: Report}
  ]
})
