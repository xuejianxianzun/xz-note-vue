<template>
  <div class="login_page">
    <div class="wrap">
      <div class="con">
        <h1>用户登录</h1>
        <el-form
          class="login_form"
          :model="formData"
          :rules="rules"
          ref="loginform"
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
          <el-form-item>
            <el-button type="primary" @click="checkForm" native-type="submit"
              >提交</el-button
            >
            <el-button @click="goback()">返回</el-button>
          </el-form-item>
          <Tip1 :tipText="tipText"></Tip1>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { checkLogin, showTip1 } from '../Util'
import Tip1 from '../components/Tip1.vue'
@Component({
  components: {
    Tip1: Tip1
  }
})
export default class Login extends Vue {
  private tipText: string = '用户名或密码错误'
  private formData = {
    user: '',
    pwd: ''
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
    ]
  }

  private checkForm() {
    this.$refs.loginform.validate((valid: any) => {
      if (valid) {
        this.login()
      } else {
        return false
      }
    })
  }

  private async login() {
    const cfg = {
      method: 'post',
      url: 'http://localhost:3000/api/v2/login',
      data: {
        user: this.formData.user,
        pwd: this.formData.pwd
      }
    }
    const responseData = await checkLogin(this, cfg, 'index')
    // 登陆出错
    if (responseData.error) {
      showTip1()
    }
  }

  private goback() {
    // window.history.back()
    // 正常情况下有两种方式进入登陆页面： index 和 user 。在未登录状态时， user 页面会自动进入登录页，所以不能再退回 user 页面，否则会出不去了。
    this.$router.push({
      name: 'index'
    })
  }
}
</script>

<style lang="less" scoped>
.login_page {
  height: 100vh;
  position: relative;
  .wrap {
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
    .login_form {
      margin-top: 30px;
    }
  }
}
</style>
