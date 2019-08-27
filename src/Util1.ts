import Vue from 'vue'
import store from './store'
// 检查输入的验证码是否正确
Vue.prototype.checkVerifyCode = function(
  rule: any,
  value: string,
  callback: any
): void {
  console.log(this)

  const code = store.state.verifyCode.toLowerCase()
  if (!code || !value || code !== value.toLowerCase()) {
    callback(new Error('验证码错误!'))
  } else {
    callback()
  }
}
