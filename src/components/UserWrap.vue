<template>
  <div class="user_page">
    <div class="nav_wrap"></div>
    <div class="con_wrap">
      <slot name="title">
      </slot>
      <div class="nav">
        <slot name="link">
          <router-link :to="'/'" class="link">&lt; 返回主页</router-link>
        </slot>
      </div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { checkToken } from '../Util'
import '../style/userWrap.less'
@Component
export default class UserWrap extends Vue {
  private async beforeCreate() {
    // 如果没有 token，则跳转到登录页
    if (!sessionStorage.getItem('xz-token')) {
      // this.$router.push({ name: 'login' })
    }
    // 如果有 token，根据该 token 获取用户配置信息
    const responseData = await await checkToken(this)
    // 获取配置信息出错，跳转到登录页
    if (responseData.error) {
      // this.$router.push({ name: 'login' })
    }
  }
}
</script>
