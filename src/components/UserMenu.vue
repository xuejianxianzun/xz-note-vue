<template>
  <div class="user_menu">
    <div class="no_login" v-if="!$store.state.isLogin">
      <router-link to="/login" class="menu_item">登陆</router-link>
      <router-link to="/register">注册</router-link>
    </div>
    <div class="logined" v-if="$store.state.isLogin">
      <div class="img_wrap menu_item">
        <div class="img_box">
          <router-link :to="'/user'" title="用户后台">
            <img
              :src="$store.getters.getAvatarUrl"
              class="avatar_img"
              alt="avatar"
            />
          </router-link>
        </div>
      </div>
      <div class="user_name menu_item">
        <router-link :to="'/user'" title="用户后台">后台</router-link>
      </div>
      <div class="logout" @click="logout" title="退出登陆">登出</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getUserProfile } from '../Util'
@Component({
  computed: {},
  components: {}
})
export default class UserMenu extends Vue {
  private logout() {
    this.$store.commit('logout')
    // 清空 token
    sessionStorage.removeItem('xz-token')
  }

  private test = Vue.prototype.test

  private async beforeCreate() {
    // 获取用户配置信息
    const responseData = await await getUserProfile(this)
    // 登陆出错
    if (responseData.error) {
      if (
        responseData.status === 403 &&
        responseData.data.message === 'jwt expired'
      ) {
        // token 过期，需要重新登陆
        // Element_UI.Message('登陆已过期，需要重新登陆。')
        console.log('登陆已过期，需要重新登陆。')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user_menu {
  height: 100%;
  display: flex;
  align-items: center;
  color: #fff;
  flex-wrap: nowrap;
  flex-shrink: 0;
  .no_login,
  .logined {
    flex-shrink: 0;
  }
  .menu_item {
    margin-right: 20px;
  }
  .logined {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    .img_box {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      overflow: hidden;
      transition: all 0.5s;
    }
    .img_wrap:hover .img_box {
      transform: scale(1.1);
    }
    .logout {
      cursor: pointer;
    }
  }
  a {
    color: #fff;
  }
}
</style>
