import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {name: 'root', path: '/', redirect: { name: 'home' }},
    {name: 'home', path: '/home', component: Home}
  ]
})
