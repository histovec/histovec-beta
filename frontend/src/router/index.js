import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Search from '@/components/Search'
import Result from '@/components/Result'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {name: 'root', path: '/', redirect: { name: 'home' }},
    {name: 'home', path: '/home', component: Home},
    {name: 'search', path: '/search', component: Search},
    {name: 'result', path: '/result', component: Result}
  ]
})
