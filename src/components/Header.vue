<template>
  <div class="topbar">
    <div class="logo">logo</div>
    <div class="center">center</div>
    <div class="right">
      <user-menu></user-menu>
    </div>
  </div>
</template>

<script lang="ts">
import UserMenu from './UserMenu.vue'
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    UserMenu: UserMenu
  }
})
export default class BlogHeader extends Vue {}
</script>

<style lang="less" scoped>
@left_width: 220px;
.topbar {
  padding: 0 20px;
  height: 100%;
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  .logo {
    max-width: @left_width;
    margin-right: 20px;
  }
  .center {
    flex: 1;
    width: 100%;
  }
  .right {
  float:right;
  }
}
</style>
