import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface StateInterface {
  user: string
  id: number
  avatar: string
  avatarPath: string
  email: string
  isLogin: boolean
  allTag: string[]
  showAllTag: string
  showTag: string
  searchText: string
  noteData: object[]
  showAgreement: boolean
  showTip1: boolean
  verifyCode: string
  apiPath:string
}

class State implements StateInterface {
  public user: string = ''
  public id: number = -1
  public avatar: string = 'default_avatar.jpg'
  public avatarPath: string = '/avatar/' // public 文件夹不需要写出来
  public email: string = ''
  public isLogin: boolean = false
  public allTag: string[] = [] // 存储所有已有的 tag
  public showAllTag: string = 'xznote-all' // 内置的标记，当展示全部 tag 时使用
  public showTag: string = 'xznote-all' // 要展示的 tag
  public searchText: string = '' // 搜索文本
  public noteData: object[] = [] // 所有笔记
  public showAgreement: boolean = false
  public showTip1: boolean = false
  public verifyCode: string = ''
  public apiPath:string = 'http://localhost:3000/api/v2'
}

export default new Vuex.Store({
  state: new State(),
  mutations: {
    changeShowTip1(state) {
      state.showTip1 = !state.showTip1
    },
    setShowAgreement(state, val:boolean) {
      state.showAgreement = val
    },
    setUser(state, val:string) {
      state.user = val
    },
    setShowTag(state, val:string) {
      state.showTag = val
    },
    setVerify(state, val:string){
      state.verifyCode = val
    },
    loginState(state, obj) {
      if (!obj.error) {
        state.isLogin = true
        state.user = obj.user
        state.id = obj.id
        state.avatar = obj.avatar || state.avatar
        state.email = obj.email
      }
    }
  },
  actions: {},
  getters: {
    getAvatarUrl(state){
      return state.avatarPath + state.avatar
    }
  }
})
