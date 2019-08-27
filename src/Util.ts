import axios from 'axios'
import store from './store'

// 获取、更新用户数据的请求都可以走这里。会返回新的 token 用来更新前台的用户信息
// 登陆，注册，获取用户配置，检查登陆状态，修改用户资料。
// 参数 cfg 是网络请求参数， routerName 是成功后要跳转的路由 name
export const getUserProfiles = async function(
  thiz: any,
  cfg: any,
  routerName?: string
) {
  try {
    const res = await axios(cfg)
    const data = res.data
    if (!data.error) {
      // 保存 token
      sessionStorage.setItem('xz-token', data.body.token)
      // 保存用户资料
      store.commit('loginState', Object.assign(data.body.userinfo, data.err))
      // 如有必要可以进行跳转
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
    if (error.response && error.response.data) {
      return error.response.data
    } else {
      return {
        error: true
      }
    }
  }
}

// 如果存在 token 信息，则尝试获取用户信息。如果成功会获得新的 token
export const checkToken = async function(thiz: any) {
  if (sessionStorage.getItem('xz-token') && !store.state.isLogin) {
    const cfg = {
      method: 'get',
      url: 'http://localhost:3000/api/v2/user/profile/all'
    }
    return await getUserProfiles(thiz, cfg)
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
  }, 3000)
}

// 检查输入的邮箱是否正确
const emailReg: RegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
const checkEmail = (rule: any, value: string, callback: any): void => {
  if (!emailReg.test(value)) {
    callback(new Error('邮箱格式错误!'))
  } else {
    callback()
  }
}

// 检查输入的验证码是否正确
const checkVerifyCode2 = function(
  rule: any,
  value: string,
  callback: any
): void {
  const code = store.state.verifyCode.toLowerCase()
  if (!code || !value || code !== value.toLowerCase()) {
    callback(new Error('验证码错误!'))
  } else {
    callback()
  }
}

// 公用校验规则
export const pubRules: {
  user: object[]
  pwd: object[]
  email: object[]
  verifyCode: object[]
  verifyEmail: object[]
} = {
  user: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 3,
      max: 30,
      message: '长度必须在 3 到 30 个字符之间',
      trigger: 'blur'
    }
  ],
  pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 8,
      max: 30,
      message: '长度必须在 8 到 30 个字符之间',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      validator: checkEmail,
      trigger: 'blur'
    }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: checkVerifyCode2,
      trigger: 'blur'
    }
  ],
  verifyEmail: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      min: 6,
      max: 6,
      message: '验证码长度错误',
      trigger: 'blur'
    }
  ]
}
