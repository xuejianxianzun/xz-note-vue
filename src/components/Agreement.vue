<template>
  <el-dialog
    class="agreement_wrap"
    title="使用协议"
    :visible.sync="$store.state.showAgreement"
  >
    <div class="content">
      <p>1.您的邮箱将会作为密保邮箱。</p>
      <p>
        2.本产品加密储存您的密码，但保险起见最好不要使用弱口令或者通用密码。
      </p>
      <p>3.本产品不会审查用户储存的资料。</p>
      <p>
        4.本产品不会对用户的任何内容表示赞成或反对。因用户资料引发的问题，本产品不承担责任。
      </p>
      <p>
        5.本产品后续可能会有功能变更。
      </p>
      <p>当前协议版本 v0.1。修订日期 2019 年 9 月 25 日</p>
      <div class="close">
        <el-button type="primary" @click="close()">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Agreenment extends Vue {
  private close() {
    this.$store.commit('setShowAgreement', false)
  }
}
</script>

<style lang="less" scoped>
.agreement_wrap {
  p {
    margin: 5px 0;
  }
  .close {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
