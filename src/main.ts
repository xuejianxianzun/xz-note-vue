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
    request.headers.Authorization = store.state.token
    // 再发送给后台
    return request
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
// 拦截返回
axios.interceptors.response.use(
  (response) => {
    return response
  },
  function(error) {
    console.log(error.response)
    if (
      error.response.status == 500 &&
      error.response.data.message === 'jwt expired'
    ) {
      // token 过期，需要重新登陆
      Element_UI.Message('登陆已过期，需要重新登陆。')
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
