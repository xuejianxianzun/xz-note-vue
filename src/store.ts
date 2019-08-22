import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

class State {
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
}

export default new Vuex.Store({
  state: new State(),
  mutations: {
    changeShowTip1(state) {
      state.showTip1 = !state.showTip1
    },
    setShowAgreement(state, val) {
      state.showAgreement = val
    },
    setShowTag(state, val) {
      state.showTag = val
    },
    changeAvatar(state, val) {
      state.avatar = val
    },
    loginState(state, obj) {
      if (!obj.error) {
        state.isLogin = true
        state.user = obj.user
        state.id = obj.id
        state.avatar = obj.avatar || state.avatar
        state.email = obj.email
      }
    },
    logout(state) {
      // 重置所有状态
      state = new State()
    }
  },
  actions: {},
  getters: {
    getAvatarUrl(state){
      return state.avatarPath + state.avatar
    }
  }
})
