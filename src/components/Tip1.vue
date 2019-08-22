<template>
  <el-form-item class="tip1_wrap">
    <span class="tip1_con" v-show="$store.state.showTip1">{{ tipText }}</span>
  </el-form-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Tip1 extends Vue {
  @Prop(String) tipText!: string
}
</script>

<style lang="less" scoped>
.tip1_wrap {
  height: 18px;
  line-height: 18px;

  .tip1_con {
    color: #f56c6c;
    font-size: 12px;
  }
}
</style>
