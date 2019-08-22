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
        <div :class="{search_tip:true,search_tip_show:!!$store.state.searchText}">
          <p v-show="$store.state.searchText">"<span class="word">{{$store.state.searchText}}</span>" 的搜索结果</p>
        </div>
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
export default class Index extends Vue {}
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
      border-left: 1px solid #ddd;
      background: #f8f8f8;
      .search_tip {
        height: 0;
        transition: all 0.3s;
        overflow: hidden;
        box-sizing: content-box;
        p {
          text-align: center;
          .word {
            font-weight: bold;
            color: #178bf1;
            font-size: 1.2em;
          }
        }
      }
      .search_tip_show {
        height: 45px;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .blog_left {
    width: 120px !important;
  }
}
</style>
