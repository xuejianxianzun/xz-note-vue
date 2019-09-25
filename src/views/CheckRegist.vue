<template>
  <div class="check_regist_page login_regist_page">
    <div class="login_regist_wrap">
      <div class="con">
        <h1>验证您的账号</h1>
        <div class="success_tip">
          <p v-if="result === 0">正在验证您的账号……</p>
          <p v-if="result === -1">验证失败！</p>
          <p v-if="result === 1">恭喜您，注册成功！</p>
          <div class="btn_wrap" v-if="result === -1">
            <el-button type="primary" @click="goHome()">转到首页</el-button>
          </div>
          <div class="btn_wrap" v-if="result === 1">
            <el-button type="primary" @click="goLogin()">转到登陆页面</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class CkeckRegist extends Vue {
  private result: number = 0 // 验证结果
  // 验证
  private async beforeCreate() {
    const key = this.$route.params.key.toString()
    this.$http({
      method: 'get',
      url: `${this.$store.state.apiPath}/checkregist/${key}`
    })
      .then((res) => {
        this.result = 1
      })
      .catch(() => {
        this.result = -1
      })
  }
  // 跳转到首页
  private goHome() {
    this.$router.push({
      name: 'index'
    })
  }
  // 跳转到登陆页面
  private goLogin() {
    this.$router.push({
      name: 'login'
    })
  }
}
</script>
