<template>
  <div>
    <UserWrap>
      <h1 slot="title">重置密码</h1>
      <div slot="content">
        <div class="found_con_wrap">
          <el-steps :active="step" finish-status="success" simple>
            <el-step
              v-for="item in stepTitle"
              :title="item"
              :key="item"
            ></el-step>
          </el-steps>
          <div class="step_con_wrap">
            <div class="step1" v-show="step === 0">
              <p class="found_tip">
                请输入您的用户名，我们将会向您的邮箱发送一封邮件。
              </p>
              <el-form
                class="found_form"
                size="medium"
                :model="foundFormData"
                :rules="rules"
                label-width="100px"
                ref="found_form"
                @submit.native.prevent
              >
                <el-form-item label="用户名：" prop="user">
                  <el-input
                    class="new_input"
                    autofocus
                    v-model="foundFormData.user"
                    placeholder="请输入您的用户名"
                  ></el-input>
                </el-form-item>
                <el-form-item label="验证码：" prop="verifyCode">
                  <el-input
                    class="verify_input1"
                    placeholder="请输入验证码"
                    v-model="foundFormData.verifyCode"
                  ></el-input>
                  <Verify></Verify>
                </el-form-item>
                <el-form-item class="el_buttons">
                  <el-button
                    type="primary"
                    @click="checkForm"
                    native-type="submit"
                    :disabled="disableBtn1"
                    >提交</el-button
                  >
                  <el-button @click="goback()">返回</el-button>
                </el-form-item>
                <Tip1>
                  <span slot="tipText">{{ tipText }}</span>
                </Tip1>
              </el-form>
            </div>
            <div class="step2" v-show="step === 1">
              <p class="found_tip">
                发信成功，请您稍后查看邮件获取验证码。
                <br />
                如果您没有收到邮件，请检查它是否被放入了垃圾箱。
              </p>
              <el-form
                class="found_form"
                size="medium"
                :model="rpFormData"
                :rules="rules2"
                label-width="100px"
                ref="rp_form"
                @submit.native.prevent
              >
                <el-form-item label="验证码：" prop="verifyCode">
                  <el-input
                    autofocus
                    v-model="rpFormData.verifyCode"
                    required
                    name="verifyCode"
                    placeholder="请输入您的验证码"
                    autocomplete="nope"
                  ></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="pwd">
                  <el-input
                    class=""
                    placeholder="请输入您的新密码"
                    v-model="rpFormData.pwd"
                    autocomplete="new-password"
                    name="pwd"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item class="el_buttons">
                  <el-button
                    type="primary"
                    @click="checkForm"
                    native-type="submit"
                    :disabled="disableBtn1"
                    >提交</el-button
                  >
                  <el-button @click="goback()">返回</el-button>
                </el-form-item>
                <Tip1>
                  <span slot="tipText">{{ tipText }}</span>
                </Tip1>
              </el-form>
            </div>
            <div class="step3" v-show="step === 2">
              <p class="found_tip">
                重置密码成功！请使用新密码登录。
              </p>
              <div class="btn_wrap">
                <el-button type="primary" @click="goback()">返回</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserWrap>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UserWrap from '../components/UserWrap.vue'
import { pubRules, showTip1 } from '../Util'
import Tip1 from '../components/Tip1.vue'
import Verify from '../components/Verify.vue'
@Component({
  components: {
    UserWrap,
    Verify,
    Tip1
  }
})
export default class Found extends Vue {
  private step = 0
  private tipText: string = ''
  private disableBtn1: boolean = false
  private stepTitle: string[] = ['验证用户名', `重置密码`, '完成修改']

  // 验证用户名时的表单数据
  private foundFormData = {
    user: '',
    verifyCode: ''
  }

  // 验证用户名时的验证规则
  private rules = {
    user: pubRules.user,
    verifyCode: pubRules.verifyCode
  }

  // 输入新密码的表单的数据
  private rpFormData = {
    verifyCode: '',
    pwd: ''
  }

  // 输入新密码的表单的验证规则
  private rules2 = {
    pwd: pubRules.pwd,
    verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
  }

  // 修改时检查输入的值
  private checkForm() {
    if (this.step === 0) {
      ;(this.$refs.found_form as any).validate((valid: any) => {
        if (valid) {
          this.found()
        } else {
          return false
        }
      })
    } else {
      ;(this.$refs.rp_form as any).validate((valid: any) => {
        if (valid) {
          this.resetPwd()
        } else {
          return false
        }
      })
    }
  }

  // 发送验证邮件
  private found() {
    this.disableBtn1 = true
    this.$http({
      method: 'get',
      url: `${this.$store.state.apiPath}/user/profile/found/${this.foundFormData.user}`
    })
      .then((res) => {
        // 发信成功
        this.step = 1
        this.$store.commit('setUser', this.foundFormData.user)
        this.disableBtn1 = false
      })
      .catch((err) => {
        const res = err.response
        if (res.status === 404) {
          this.tipText = '无效的用户名'
          // 404 表示没有这个用户
        } else if (res.status === 500) {
          // 500 表示存在这个用户但发信失败
          this.tipText = '未能成功发送邮件'
        } else {
          this.tipText = '发生了未知错误'
        }
        showTip1()
        this.disableBtn1 = false
      })
  }

  // 重设密码
  private resetPwd() {
    this.disableBtn1 = true
    this.$http({
      method: 'post',
      url: `${this.$store.state.apiPath}/user/profile/pwd`,
      data: {
        user: this.$store.state.user,
        verifyCode: this.rpFormData.verifyCode,
        pwd: this.rpFormData.pwd
      }
    })
      .then((res) => {
        // 重设成功
        this.step = 2
      })
      .catch((err) => {
        const res = err.response
        this.tipText = '修改失败，可能是验证码不正确。'
        showTip1()
        this.disableBtn1 = false
      })
  }

  // 返回登陆页面
  private goback() {
    this.$router.push({
      name: 'login'
    })
  }
}
</script>

<style lang="less" scoped>
.found_con_wrap {
  margin-top: 30px;
}
.step_con_wrap {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
  font-size: 14px;
  color: #444;
  .found_tip {
    text-align: center;
    color: #555;
    font-size: 16px;
    line-height: 1.8;
  }
  .btn_wrap {
    text-align: center;
    margin-top: 20px;
  }
  .found_form {
    padding: 30px;
    width: 420px;
    margin: 0 auto;
  }
  .found_form .new_input {
    max-width: 250px;
  }
}
</style>
