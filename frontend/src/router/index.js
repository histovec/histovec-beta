import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Search from '@/components/Search'
import Report from '@/components/Report'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {name: 'root', path: '/', redirect: { name: 'home' }},
    {name: 'home', path: '/home', component: Home},
    {name: 'search', path: '/search', component: Search},
    {name: 'report', path: '/report', component: Report}
  ]
})
