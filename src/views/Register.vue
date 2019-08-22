<template>
  <div class="register_page">
    <div class="form_wrap">
      <h1>用户注册</h1>
      <el-form
        class="register_form"
        :model="formData"
        :rules="rules"
        ref="registerform"
        label-width="100px"
        size="medium"
        @submit.native.prevent
      >
        <el-form-item label="用户名：" prop="user">
          <el-input
            placeholder="请输入用户名"
            v-model="formData.user"
            maxlength="30"
            show-word-limit
            required
            autofocus
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="pwd">
          <el-input
            placeholder="请输入密码"
            v-model="formData.pwd"
            maxlength="30"
            show-word-limit
            show-password
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="pwd2">
          <el-input
            placeholder="请再次输入密码"
            v-model="formData.pwd2"
            maxlength="30"
            show-word-limit
            show-password
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input
            placeholder="请输入邮箱地址"
            maxlength="50"
            v-model="formData.email"
            show-word-limit
            required
          ></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="formData.agree">同意使用协议</el-checkbox>
          <span class="see" @click="see()">查看使用协议</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkForm()" native-type="submit"
            >提交</el-button
          >
          <el-button @click="goback()">返回</el-button>
        </el-form-item>
        <Tip1 :tipText="tipText"></Tip1>
      </el-form>
    </div>
    <Agreenment></Agreenment>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Agreenment from '../components/Agreement.vue'
import { checkLogin, showTip1 } from '../Util'
import Tip1 from '../components/Tip1.vue'
@Component({
  components: {
    Agreenment: Agreenment,
    Tip1: Tip1
  }
})
export default class Register extends Vue {
  private tipText: string = '用户名已被占用'

  private formData = {
    user: '',
    pwd: '',
    pwd2: '',
    email: '',
    agree: true
  }

  private showLoginFalse: boolean = false

  private checkPwd2 = (rule: any, value: string, callback: any) => {
    if (value !== this.formData.pwd) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }

  private emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
  private checkEmail = (rule: any, value: string, callback: any) => {
    if (!this.emailReg.test(value)) {
      callback(new Error('邮箱格式错误!'))
    } else {
      callback()
    }
  }

  private checkAgreen = (rule: any, value: string, callback: any) => {
    if (!value) {
      callback(new Error('不同意使用协议无法进行注册!'))
    } else {
      callback()
    }
  }

  private rules = {
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
        min: 6,
        max: 30,
        message: '长度必须在 6 到 30 个字符之间',
        trigger: 'blur'
      }
    ],
    pwd2: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        min: 6,
        max: 30,
        message: '长度必须在 6 到 30 个字符之间',
        trigger: 'blur'
      },
      { validator: this.checkPwd2, trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      {
        validator: this.checkEmail,
        trigger: 'blur'
      }
    ],
    agree: [{ validator: this.checkAgreen, trigger: 'change' }]
  }

  private checkForm() {
    this.$refs.registerform.validate((valid: any) => {
      if (valid) {
        this.register()
      } else {
        // console.log('valid failed')
        return false
      }
    })
  }

  private see() {
    this.$store.commit('setShowAgreement', true)
  }

  private test = Vue.prototype.test

  private async register() {
    const cfg = {
      method: 'post',
      url: 'http://localhost:3000/api/v2/register',
      data: this.formData
    }
    const data = await checkLogin(this, cfg, 'index')
    if (data.error) {
      if (data.message === 'user exists') {
        showTip1()
      }
    }
  }

  private goback() {
    window.history.back()
  }
}
</script>

<style lang="less" scoped>
.register_page {
  height: 100vh;
  position: relative;
  .form_wrap {
    width: 500px;
    position: absolute;
    z-index: 1;
    padding: 30px;
    border-radius: 10px;
    border: 1px solid #eee;
    background: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    h1 {
      text-align: center;
      font-weight: normal;
      line-height: 1.5;
    }
    .register_form {
      margin-top: 30px;
      .see {
        color: #888;
        cursor: pointer;
      }
    }
  }
}
</style>
