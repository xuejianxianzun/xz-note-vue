
<template>
  <UserWrap>
    <h1 slot="title">修改{{ fieldTip }}</h1>
    <span class="link" @click="back()" slot="link">&lt; 返回上一页</span>
    <div slot="content" class="step_wrap">
      <el-steps :active="active" finish-status="success" simple>
        <el-step v-for="item in stepTitle" :title="item" :key="item"></el-step>
      </el-steps>
      <div class="step_con_wrap">
        <div class="step_con" v-if="active === 0">
          <p class="tip">
            我们需要向您的邮箱
            <strong class="themeColor">{{ $store.state.email }}</strong>
            发送一封验证邮件。验证码 10 分钟内有效。
          </p>
          <el-button
            type="primary"
            :disabled="disableBtn1"
            @click="sendVerification"
            >{{ btn1Text }}</el-button
          >
          <span class="sendStatus">{{ sendStatus }}</span>
        </div>
        <div class="step_con" v-if="active === 1">
          <p class="tip">
            请输入您在邮箱中收到的验证码。
            <br />
            如果您未收到邮件，请检查邮件是否在垃圾箱里。
          </p>
          <div class="input_verify_wrap">
            <el-form
              class="verify_form"
              size="medium"
              :model="inputVerify"
              :rules="rules1"
              ref="inputVerify"
              @submit.native.prevent
            >
              <el-form-item prop="verifyEmail">
                <el-input
                  class="verify_input"
                  autofocus
                  v-model="inputVerify.verifyEmail"
                  placeholder="请输入验证码"
                ></el-input>
                <el-button type="primary" @click="checkVerify()"
                  >提交验证码</el-button
                >
                <span class="sendStatus">{{ sendStatus }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="step_con" v-if="active === 2">
          <p class="tip">请输入您的新{{ fieldTip }}。</p>
          <div class="input_new_wrap">
            <el-form
              class="new_form"
              size="medium"
              :model="inputNew"
              :rules="rules2"
              ref="newform"
              @submit.native.prevent
            >
              <el-form-item prop="val">
                <el-input
                  class="new_input"
                  autofocus
                  v-model="inputNew.val"
                  :placeholder="'请输入新的' + fieldTip"
                  :type="inputType"
                ></el-input>
                <el-button type="primary" @click="checkForm()"
                  >修改{{ fieldTip }}</el-button
                >
                <span class="sendStatus">{{ sendStatus }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="step_con" v-if="active === 3">
          <p class="tip">您的{{ fieldTip }}已经修改成功！</p>
          <div class="back">
            <el-button type="primary" @click="back()">返回</el-button>
          </div>
        </div>
      </div>
    </div>
  </UserWrap>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UserWrap from '../components/UserWrap.vue'
import { pubRules } from '../Util'
@Component({
  components: {
    UserWrap
  },
  computed: {}
})
export default class EditUser extends Vue {
  private field: string = ''
  private fieldTip: string = ''
  private stepTitle: string[] = []
  private active: number = 0
  private disableBtn1: boolean = false
  private btn1Time: number = 60
  private btn1Text: string = '发送验证码'
  private inputType: string = ''
  private btn1TextArray: any = {
    usable: '发送验证码',
    disabled: ' 秒后可以重新发送'
  }
  private sendStatus: string = ''
  private inputVerify: { verifyEmail: string } = {
    verifyEmail: ''
  }
  private inputNew: { val: string } = {
    val: ''
  }

  private rules1: any = {
    verifyEmail: pubRules.verifyEmail
  }

  private rules2: any = {}

  private rulesAll = {
    email: pubRules.email,
    pwd: pubRules.pwd
  }

  // 判断是修改邮箱还是修改密码
  private created() {
    if (this.$route.name === 'changeEmail') {
      this.field = 'email'
      this.fieldTip = '邮箱'
      this.inputType = 'text'
      this.rules2 = { val: this.rulesAll.email }
    } else if (this.$route.name === 'changePwd') {
      this.field = 'pwd'
      this.fieldTip = '密码'
      this.inputType = 'password'
      this.rules2 = { val: this.rulesAll.pwd }
    }
    this.stepTitle = [
      '发送验证码',
      '输入验证码',
      `修改${this.fieldTip}`,
      '修改成功'
    ]
  }

  // 发送验证码
  private sendVerification() {
    this.countDown()
    this.$http({
      method: 'get',
      url: 'http://localhost:3000/api/v2/user/profile/verification'
    })
      .then((res) => {
        this.sendStatus = '发送成功'
        this.next()
      })
      .catch((err) => {
        console.log(err)
        this.sendStatus = '发送失败！'
      })
  }

  // 重新发送验证码的倒计时
  private countDown() {
    this.sendStatus = '正在发送中'
    this.disableBtn1 = true
    let timeNumber = this.btn1Time
    this.btn1Text = timeNumber.toString() + this.btn1TextArray.disabled
    const timer = setInterval(() => {
      timeNumber--
      this.btn1Text = timeNumber.toString() + this.btn1TextArray.disabled

      if (timeNumber === 0) {
        clearInterval(timer)
        this.disableBtn1 = false
        this.btn1Text = this.btn1TextArray.usable
      }
    }, 1000)
  }

  // 修改时检查输入的值
  private checkVerify() {
    this.$refs.inputVerify.validate((valid: any) => {
      if (valid) {
        this.verify()
      } else {
        // console.log('valid failed')
        return false
      }
    })
  }

  // 核对验证码
  private verify() {
    this.$http({
      method: 'post',
      url: 'http://localhost:3000/api/v2/user/profile/verification',
      data: {
        verify: this.inputVerify.verifyEmail
      }
    })
      .then((res) => {
        console.log(res.data)
        this.sendStatus = '验证码正确'
        this.next()
        this.inputVerify.verifyEmail = ''
      })
      .catch((err) => {
        console.log(err)
        this.sendStatus = '验证码不正确！'
      })
  }

  // 修改时检查输入的值
  private checkForm() {
    this.$refs.newform.validate((valid: any) => {
      if (valid) {
        this.updataNew()
      } else {
        // console.log('valid failed')
        return false
      }
    })
  }

  // 进行修改
  private updataNew() {
    this.$http({
      method: 'patch',
      url: `http://localhost:3000/api/v2/user/profile/${this.field}`,
      data: {
        data: this.inputNew.val
      }
    })
      .then((res) => {
        console.log(res.data)
        this.inputNew.val = ''
        this.next()
      })
      .catch((err) => {
        console.log(err)
        this.sendStatus = '修改失败！'
      })
  }

  // 下一步
  private next() {
    if (this.active++ > 3) this.active = 0
  }

  private back() {
    window.history.back()
  }
}
</script>

<style lang="less" scoped>
.step_wrap {
  margin-top: 30px;
  .step_con_wrap {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    font-size: 14px;
    color: #444;
    .tip {
      color: #666;
      margin-bottom: 15px;
    }
    .sendStatus {
      padding-left: 20px;
    }
    .verify_input {
      width: 150px;
      margin-right: 10px;
    }
    .new_input {
      width: 250px;
      margin-right: 10px;
    }
    .warn {
      color: #f56c6c;
    }
  }
}
</style>
