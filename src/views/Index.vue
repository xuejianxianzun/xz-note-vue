<template>
  <el-container class="blog_wrap">
    <el-header class="blog_header">
      <blog-header></blog-header>
    </el-header>
    <el-container class="blog_center">
      <aside class="blog_left">
        <blog-aside></blog-aside>
      </aside>
      <el-main class="blog_main">
        <notelist></notelist>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BlogHeader from '../components/Header.vue'
import Notelist from '../components/NoteList.vue'
import BlogAside from '../components/Aside.vue'
@Component({
  components: {
    BlogHeader: BlogHeader,
    Notelist: Notelist,
    BlogAside: BlogAside
  }
})
export default class Index extends Vue {
  private chkLogin() {
    this.$http({
      method: 'get',
      url: this.$store.state.check_url,
      headers: {
        Authorization: this.$store.state.token
      }
    })
      .then((res) => {
        if (!res.data.error) {
          console.log('login success')
          this.$store.commit('loginState', true)
          this.$store.commit('saveUserInfo', res.data)
          // tianjia zhushi
        } else {
          this.$store.commit('loginState', false)
          console.log('need login')
        }
      })
      .catch((err) => {
        console.log(err.response)
        this.$store.commit('loginState', false)
        if (err.response.status === 403) {
          console.log('403')
        }
      })
  }
  private goLogin() {
    this.$router.push({
      name: 'login'
    })
  }
}
</script>

<style lang="less" scoped>
@left_width: 220px;
.blog_wrap {
  max-height: 100vh;

  .blog_header {
    padding: 0;
    height: 60px !important;
    background: #178bf1;
    color: #fff;
    a {
      color: #fff;
    }
  }

  .blog_center {
    height: 100vh;
    .blog_left {
      width: @left_width;
      flex-shrink: 0;
      padding-top: 15px;
      background: #f3f3f3;
    }
    .blog_main {
      flex: 1;
      padding: 15px 15px 0 25px;
      box-shadow: -1px 1px 2px #ddd;
      background: #f8f8f8;
    }
  }
}

@media screen and (max-width: 500px) {
  .blog_left {
    width: 120px!important;
  }
}
</style>
