import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import User from './views/User.vue'
import EditUser from './views/EditUser.vue'
import Found from './views/Found.vue'
import CheckRegist from './views/CheckRegist.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/user/email',
      name: 'changeEmail',
      component: EditUser
    },
    {
      path: '/user/password',
      name: 'changePwd',
      component: EditUser
    },
    {
      path: '/user/foundpwd',
      name: 'foundPwd',
      component: Found
    },
    {
      path: '/checkregist/:key',
      name: 'checkregist',
      component: CheckRegist
    }
  ]
})
