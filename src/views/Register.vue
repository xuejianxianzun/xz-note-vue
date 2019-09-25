<template>
  <div class="register_page login_regist_page">
    <div class="login_regist_wrap">
      <div class="con">
        <h1 v-if="step === 0">用户注册</h1>
        <h1 v-if="step === 1">即将完成</h1>
        <el-form
          v-if="step === 0"
          class="main_form"
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
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="pwd2">
            <el-input
              placeholder="请再次输入密码"
              v-model="formData.pwd2"
              maxlength="30"
              show-word-limit
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input
              placeholder="该邮箱将会作为您的密保邮箱"
              maxlength="50"
              v-model="formData.email"
              show-word-limit
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
          <el-form-item prop="agree">
            <el-checkbox v-model="formData.agree">同意使用协议</el-checkbox>
            <span class="see" @click="see()">查看使用协议</span>
          </el-form-item>
          <el-form-item class="el_buttons">
            <el-button type="primary" @click="checkForm()" native-type="submit"
              >提交</el-button
            >
            <el-button @click="goback()">返回</el-button>
          </el-form-item>
          <Tip1>
            <span slot="tipText">{{ tipText }}</span>
          </Tip1>
        </el-form>
        <div class="success_tip" v-if="step === 1">
          <p>
            您的账号需要验证邮箱方可使用。
            <br>
            我们将会向您填写的邮箱中发送一封验证邮件，请您查收。
            <br />
            如果您没有收到邮件，请检查它是否被放入了垃圾箱。
            <br>
            现在您可以关闭此页面了。
          </p>
          <div class="btn_wrap">
            <el-button type="primary" @click="step = 0">确定</el-button>
          </div>
        </div>
      </div>
    </div>
    <Agreenment></Agreenment>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Agreenment from '../components/Agreement.vue'
import { getUserProfiles, showTip1, pubRules } from '../Util'
import Tip1 from '../components/Tip1.vue'
import Verify from '../components/Verify.vue'
@Component({
  components: {
    Agreenment,
    Tip1,
    Verify
  }
})
export default class Register extends Vue {
  private tipTextAll: string[] = ['该用户名已被使用', '发信失败，可能是邮箱地址错误']
  private tipText: string = this.tipTextAll[0]
  private step: number = 0

  // 表单数据
  private formData = {
    user: '',
    pwd: '',
    pwd2: '',
    email: '',
    agree: true,
    verifyCode: ''
  }

  // 验证两次输入的密码是否一致
  private checkPwd2 = (rule: any, value: string, callback: any) => {
    if (value !== this.formData.pwd) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }

  // 验证同意使用协议
  private checkAgreen = (rule: any, value: boolean, callback: any) => {
    if (!value) {
      callback(new Error('不同意使用协议无法进行注册!'))
    } else {
      callback()
    }
  }

  // 验证规则
  private rules = {
    user: pubRules.user,
    pwd: pubRules.pwd,
    pwd2: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        min: 8,
        max: 30,
        message: '长度必须在 8 到 30 个字符之间',
        trigger: 'blur'
      },
      { validator: this.checkPwd2, trigger: 'blur' }
    ],
    verifyCode: pubRules.verifyCode,
    email: pubRules.email,
    agree: [{ validator: this.checkAgreen, trigger: 'change' }]
  }

  // 验证表单
  private checkForm() {
    ;(this.$refs.registerform as any).validate((valid: any) => {
      if (valid) {
        this.register()
      } else {
        return false
      }
    })
  }

  // 显示用户协议
  private see() {
    this.$store.commit('setShowAgreement', true)
  }

  // 注册
  private async register() {
    this.$http({
      method: 'post',
      url: `${this.$store.state.apiPath}/register`,
      data: this.formData
    })
      .then((res) => {
        this.step = 1
      })
      .catch((err) => {
        if (err.response.data.message === 'user exists') {
          this.tipText = this.tipTextAll[0]
          showTip1()
        }
        if (err.response.status === 500) {
          this.tipText = this.tipTextAll[1]
          showTip1()
        }
      })
  }

  // 返回上一页
  private goback() {
    window.history.back()
  }

  // 到用户页面
  private goUser() {
    this.$router.push({
      name: 'user'
    })
  }
}
</script>

<style lang="less" scoped>
.register_page {
  .login_regist_wrap {
    height: 587px;
  }
  .see {
    color: #888;
    cursor: pointer;
  }
}
</style>
