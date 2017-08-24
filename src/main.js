// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'
import store from './store'
import ComMiddle from './components/com-middle.vue'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.component('com-middle', ComMiddle)

// 设置API路径
axios.defaults.baseURL = 'http://116.62.225.78:8180'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
