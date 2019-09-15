<template>
  <div class="topbar">
    <div class="logo">
      <h1 class="logo_text">仙尊记事本</h1>
    </div>
    <div class="center">
      <div class="search_wrap">
        <el-input
          v-model="$store.state.searchText"
          placeholder="请输入搜索内容"
          size="medium"
          clearable
          :disabled="!$store.state.isLogin"
        >
        </el-input>
      </div>
    </div>
    <div class="right">
      <user-menu></user-menu>
    </div>
  </div>
</template>

<script lang="ts">
import UserMenu from './UserMenu.vue'
import { Component, Watch, Vue } from 'vue-property-decorator'
@Component({
  components: {
    UserMenu
  }
})
export default class BlogHeader extends Vue {
}
</script>

<style lang="less" scoped>
@left_width: 220px;
.topbar {
  height: 100%;
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  .logo {
    padding-left: 10px;
    max-width: @left_width;
    margin-right: 20px;
    .logo_text {
      font-size: 22px;
      font-weight: normal;
    }
  }
  .center {
    flex: 1;
    width: 100%;
    padding-left: 5px;
    padding-right: 30px;
    display: flex;
    .search_wrap {
      margin-right: 100px;
      max-width: 300px;
    }
  }
  .right {
    float: right;
    padding-right: 10px;
  }
}
@media screen and (min-width: 640px) {
  .logo {
    width: @left_width !important;
  }
}
@media screen and (max-width: 640px) {
  .search_wrap {
    display: none;
  }
}
</style>

<style lang="less">
.search_wrap {
  .el-button {
    padding: 12px 15px;
  }
  .el-icon-search {
    font-size: 20px;
  }
  .el-input__inner{
    border-radius: 15px;
  }
}
</style>
