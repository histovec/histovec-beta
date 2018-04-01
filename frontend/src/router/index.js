import Vue from 'vue'
import Router from 'vue-router'

import Search from '@/components/Search'
import Result from '@/components/Result'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {name: 'root', path: '/', redirect: { name: 'search' }},
    {name: 'search', path: '/search', component: Search},
    {name: 'result', path: '/result', component: Result}
  ]
})
