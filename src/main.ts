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

Vue.prototype.changeData = function() {
  // changeData是函数名
  alert('执行成功')
}

// axios 拦截器
axios.interceptors.request.use(
  (request) => {
    request.headers.Authorization = sessionStorage.getItem('xz-token')
    // 再发送给后台
    return request
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
// 拦截返回
// 现在实际上没有起什么作用
// axios.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   function(error) {
//     if (!error.response) {
//       return error
//     }
//     // return Promise.reject(error)
//   }
// )

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
