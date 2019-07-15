<template>
  <div class="login_page">
    <div class="wrap">
      <div class="con">
        <h1>用户登录</h1>
        <el-form
          class="login_form"
          :model="formData"
          label-width="80px"
          size="medium"
          @submit.native.prevent
        >
          <el-form-item label="用户名：">
            <el-input
              placeholder="请输入用户名"
              v-model="formData.user"
              maxlength="30"
              show-word-limit
              required
            ></el-input>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input
              placeholder="请输入密码"
              v-model="formData.pwd"
              maxlength="30"
              show-word-limit
              show-password
              required
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="邮箱：">
            <el-input
              placeholder="请输入邮箱地址"
              v-model="formData.email"
              maxlength="50"
              required
            ></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-checkbox v-model="formData.agree">同意使用协议</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="checkForm"
              native-type="submit"
            >提交</el-button>
            <el-button @click="goback()">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Login extends Vue {
  private formData = {
    user: '',
    pwd: '',
    agree: true
  }
  private checkForm() {
    if (!this.formData.user || !this.formData.pwd || !this.formData.agree) {
      console.log('false')
      return false
    } else {
      this.login()
    }
  }
  private async login() {
    this.$http({
      method: 'post',
      url: this.$store.state.login_url,
      data: {
        user: this.formData.user,
        pwd: this.formData.pwd
      }
    })
      .then((res) => {
        console.log(res.data)
        const data = res.data
        if (!data.error) {
          // save token
          this.$store.commit('saveToken', data.body.token)
          this.$store.commit(
            'loginState',
            Object.assign(data.body.userinfo, data.err)
          )
          this.$router.push({
            name: 'index'
          })
        }
      })
      .catch((err) => {
        console.log(err)
        this.$store.commit('loginState', { error: true })
      })
  }
  private goback() {
    window.history.back()
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
