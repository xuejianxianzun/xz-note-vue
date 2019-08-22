<template>
  <div class="user_page">
    <div class="nav_wrap"></div>
    <div class="con_wrap">
      <h1>{{ title }}</h1>
      <div class="nav">
        <span class="link" @click="back()">&lt; 返回上一页</span>
      </div>
      <div class="step_wrap">
        <el-steps :active="active" finish-status="success" simple>
          <el-step title="验证邮箱"></el-step>
          <el-step title="重设邮箱"></el-step>
          <el-step title="修改成功"></el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import '../style/user.less'
@Component
export default class ModifyProfile extends Vue {
  private field: string = ''
  private title: string = ''
  private active:number = 0

  private created() {
    if (this.$route.name === 'changeEmail') {
      this.field = 'email'
      this.title = '修改邮箱'
    } else if (this.$route.name === 'changePwd') {
      this.field = 'pwd'
      this.title = '修改密码'
    }
  }

  private next() {
    if (this.active++ > 2) this.active = 0
  }

  private back() {
    window.history.back()
  }
}
</script>
