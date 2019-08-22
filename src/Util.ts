import axios from 'axios'
import store from './store'

// 登陆，以及检查登陆状态。参数 cfg 是网络请求参数， routerName 是成功后要跳转的路由 name
export const checkLogin = async function(
  thiz: any,
  cfg: any,
  routerName?: string
) {
  try {
    const res = await axios(cfg)
    const data = res.data
    if (!data.error) {
      // 保存cookie
      sessionStorage.setItem('xz-token', data.body.token)
      store.commit('loginState', Object.assign(data.body.userinfo, data.err))
      if (routerName) {
        thiz.$router.push({
          name: routerName
        })
      }
    } else {
      store.commit('loginState', { error: true })
    }
    return Promise.resolve(data)
  } catch (error) {
    // 捕获一些错误，如 401, 403
    store.commit('loginState', { error: true })
    return {
      error: true
    }
  }
}

export const getUserProfile = async function(thiz: any) {
  // 如果存在 token 信息，则尝试获取用户信息。如果成功会获得新的 token
  if (sessionStorage.getItem('xz-token') && !store.state.isLogin) {
    const cfg = {
      method: 'get',
      url: 'http://localhost:3000/api/v2/user/profile/all'
    }
    return await checkLogin(thiz, cfg)
  } else {
    // 没有 token 信息，不尝试获取。
    return Promise.resolve({})
  }
}

// 显示 Tip1 组件的提示文字。通过改变 store 里的状态实现。
export const showTip1 = function() {
  store.commit('changeShowTip1')
  setTimeout(() => {
    store.commit('changeShowTip1')
  }, 1500)
}
