import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state:any={
  server_url: 'http://localhost:3000',
  login_url: 'http://localhost:3000/login',
  regist_url: 'http://localhost:3000',
  check_url: 'http://localhost:3000/check',
  note_url: 'http://localhost:3000/notes',
  token: '',
  user: '',
  id: 0,
  avatar: 'default',
  isLogin: false,
  allTag: [], // 存储所有已有的 tag
  showAllTag: 'xznote-all', // 内置的标记，当展示全部 tag 时使用
  showTag: 'xznote-all', // 要展示的 tag
  noteData: []
}
export default new Vuex.Store({
  state:state,
  mutations: {
    saveToken(state, token) {
      state.token = token
    },
    setValue(state, [key, val]: any) {
      state[key] = val
    },
    loginState(state, obj) {
      if (!obj.error) {
        state.isLogin = true
        state.user = obj.user
        state.id = obj.id
        state.avatar = obj.avatar
      }
    },
    logout(state) {
      state.token = ''
      state.isLogin = false
      state.user = ''
      state.id = 0
      state.avatar = 'default'
      state.allTag = new Set()
      state.showTag = 'xznote-all'
      state.noteData = []
    }
  },
  actions: {}
})
