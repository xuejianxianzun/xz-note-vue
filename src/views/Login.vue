<template>
  <div class="login_page login_regist_page">
    <div class="login_regist_wrap">
      <div class="con">
        <h1>用户登录</h1>
        <el-form
          class="main_form"
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
          <el-form-item label="验证码：" prop="verifyCode">
            <el-input
              class="verify_input1"
              placeholder="请输入验证码"
              v-model="formData.verifyCode"
            ></el-input>
            <Verify></Verify>
          </el-form-item>
          <router-link :to="{ name: 'foundPwd' }" class="forget"
            >忘记密码</router-link
          >
          <el-form-item class="el_buttons">
            <el-button type="primary" @click="checkForm" native-type="submit"
              >提交</el-button
            >
            <el-button @click="goback()">返回</el-button>
          </el-form-item>
          <Tip1>
            <span slot="tipText">{{ tipText }}</span>
          </Tip1>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getUserProfiles, showTip1, pubRules } from '../Util'
import Tip1 from '../components/Tip1.vue'
import Verify from '../components/Verify.vue'
@Component({
  components: {
    Tip1,
    Verify
  }
})
export default class Login extends Vue {
  // 提示文本
  private tipText: string = '用户名或密码错误'

  // 表单数据
  private formData = {
    user: '',
    pwd: '',
    verifyCode: ''
  }

  // 验证规则
  private rules = {
    user: pubRules.user,
    pwd: pubRules.pwd,
    verifyCode: pubRules.verifyCode
  }

  // 验证表单
  private checkForm() {
    ;(this.$refs.loginform as any).validate((valid: any) => {
      if (valid) {
        this.login()
      } else {
        return false
      }
    })
  }

  // 登录
  private async login() {
    const cfg = {
      method: 'post',
      url: `${this.$store.state.apiPath}/login`,
      data: {
        user: this.formData.user,
        pwd: this.formData.pwd
      }
    }
    const responseData = await getUserProfiles.call(this, cfg, 'index')

    // 登录出错
    if (responseData.error) {
      showTip1()
    }
  }

  // 返回首页
  private goback() {
    // window.history.back()
    // 正常情况下有两种方式进入登录页面： index 和 user 。在未登录状态时， user 页面会自动进入登录页，所以不能再退回 user 页面，否则会无法回到主页。
    this.$router.push({
      name: 'index'
    })
  }
}
</script>

<style lang="less" scoped>
.login_page {
  .login_regist_wrap {
    height: 430px;
  }
  .forget {
    display: inline-block;
    font-size: 14px;
    color: #888;
    padding-left: 100px;
    margin-bottom: 20px;
  }
}
</style>
