<template>
  <div class="user_menu">
    <div
      class="no_login"
      v-if="!this.$store.state.isLogin"
    >
      <router-link
        to="/login"
        class="menu_item"
      >登陆</router-link>
      <router-link to="/login">注册</router-link>
    </div>
    <div
      class="logined"
      v-if="this.$store.state.isLogin"
    >
      <div class="img_box menu_item">
        <router-link :to="'/user/'+this.$store.state.id">
          <img
            :src="setAvatar"
            class="avatar_img"
            alt="avatar"
          >
        </router-link>
      </div>
      <div class="user_name menu_item">
        <router-link :to="'/user/'+this.$store.state.id">后台</router-link>
      </div>
      <div
        class="logout"
        @click="logout"
      >登出</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({
  computed: {
    setAvatar() {
      if (this.$store.state.avatar !== 'default') {
        return this.$store.state.avatar
      } else {
        return require('../assets/avatar.jpg')
      }
    }
  }
})
export default class UserMenu extends Vue {
  private logout() {
    this.$store.commit('logout')
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
  .no_login,.logined {
    flex-shrink: 0;
  }
  .menu_item {
    margin-right: 20px;
  }
  .img_box {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }
  .logined {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    .logout {
      cursor: pointer;
    }
  }
  a {
    color: #fff;
  }
}
</style>
