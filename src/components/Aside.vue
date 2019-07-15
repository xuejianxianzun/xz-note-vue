<template>
  <div class="blog_aside">
    <div class="tag_list">
      <div
        :class={all:true,active:isActive($store.state.showAllTag)}
        @click="filterTag($store.state.showAllTag)"
      >全部标签</div>
      <div class="tag_cloud">
        <a
          v-for="tag in $store.state.allTag"
          :class={active:isActive(tag)}
          @click="filterTag(tag)"
          :key="tag"
          href="javascript:void(0)"
        >
          {{tag}}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  computed: {}
})
export default class BlogAside extends Vue {
  // 检查当前 tag 是不是显示的 tag
  private isActive(tag: string) {
    return tag === this.$store.state.showTag
  }
  // 改变选择的 tag
  private filterTag(tag: string) {
    this.$store.state.showTag = tag
  }
}
</script>

<style lang="less" scoped>
@bgcolor: #ccc;
.tag_list {
  .all {
    padding: 8px 10px;
    cursor: pointer;
    &.active {
      background: #4a9aec;
      color: #fff;
    }
    &:hover {
      background: #4a9aec;
      color: #fff;
    }
  }
  .tag_cloud {
    margin-top: 10px;
    a {
      display: inline-block;
      color: #017eff;
      padding: 5px 10px;
      margin: 3px 3px 5px;
      border-radius: 5px;
      &:hover {
        background: #c3d8ee;
      }
      &.active {
        background: #409eff;
        color: #fff;
      }
    }
  }
}
</style>
