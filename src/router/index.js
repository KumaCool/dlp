import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/actions/login'
import App from '@/App'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: App
    },
    {
      path: '/login',
      name: 'lgoin',
      component: Login
    }
  ]
})
