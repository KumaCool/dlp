// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import App from './App'
import router from './router'
import store from './store'
import ComMiddle from './components/com-middle.vue'
import './assets/css/ionicons.less'

Vue.use(ElementUI)
// Vue.use(VueAxios, axios)
Vue.component('com-middle', ComMiddle)

// 设置API路径与跨域
// axios.defaults.baseURL = '/api'
// axios.defaults.withCredentials = true
// axios.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'}

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  store.dispatch('webconfig')
  store.dispatch('perRelation')
  next()
})
// router.afterEach((to, from, next) => {
//   store.dispatch('perRelation')
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<router-view></router-view>'
  // components: { App }
})
