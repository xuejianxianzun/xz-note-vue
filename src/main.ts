import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element_UI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/common.less'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(Element_UI)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

// axios 拦截器
axios.interceptors.request.use(
  (request) => {
    // 携带 token
    request.headers.Authorization = sessionStorage.getItem('xz-token')
    return request
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
