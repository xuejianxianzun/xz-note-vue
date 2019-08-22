<template>
  <div class="user_page">
    <div class="nav_wrap"></div>
    <div class="con_wrap">
      <h1>用户中心</h1>
      <div class="nav">
        <router-link :to="'/'" class="link">&lt; 返回主页</router-link>
      </div>
      <div class="avatar user_row">
        <div class="imgwrap">
          <img
            :src="$store.getters.getAvatarUrl"
            class="avatar_img"
            alt="avatar"
          />
          <div class="black" @click="toggleChangeAvatar">
            <div class="con">
              <i class="el-icon-camera-solid"></i>
              <br />
              <span>更换头像</span>
            </div>
          </div>
        </div>
        <div class="uname blue_link">{{ this.$store.state.user }}</div>
      </div>
      <div class="user_row">
        <span class="tit">邮箱：</span>{{ this.$store.state.email }}
        <router-link :to="{ name: 'changeEmail' }" class="blue_link"
          >修改邮箱</router-link
        >
      </div>
      <div class="user_row note_num">
        <span class="tit">笔记：</span>您有
        {{ this.$store.state.noteData.length }} 条笔记。
        <a
          href="javascript:void(0)"
          class="blue_link"
          @click="showOutput = true"
          >导出笔记</a
        >
      </div>
      <div class="user_row">
        <a href="javascript:void(0)" class="blue_link" @click="seeArgee()"
          >查看用户协议</a
        >
      </div>
    </div>

    <my-upload
      field="img"
      @crop-success="cropSuccess"
      v-model="showAvatarUpload"
      :width="200"
      :height="200"
      img-format="jpg"
    ></my-upload>

    <Agreenment></Agreenment>

    <el-dialog class="output_wrap" title="导出笔记" :visible.sync="showOutput">
      <div class="content">
        <el-tabs v-model="activeName">
          <el-tab-pane label="纯文字" name="text">
            <textarea v-model="outputResultText" class="outputArea"></textarea>
          </el-tab-pane>
          <el-tab-pane label="JSON" name="json">
            <textarea v-model="outputResultJSON" class="outputArea"></textarea>
          </el-tab-pane>
        </el-tabs>
        <div class="close">
          <el-button type="primary" @click="showOutput = false"
            >确 定</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Agreenment from '../components/Agreement.vue'
import myUpload from 'vue-image-crop-upload/upload-2.vue'
import Login from './Login.vue'
import { getUserProfile } from '../Util'
import '../style/user.less'
@Component({
  computed: {
    outputResultText() {
      return this.$store.state.noteData.reduce((total: string, curr: any) => {
        return (total += curr.content + '\n\n')
      }, '')
    },
    outputResultJSON() {
      return JSON.stringify(this.$store.state.noteData)
    }
  },
  components: {
    Agreenment: Agreenment,
    'my-upload': myUpload
  }
})
export default class User extends Vue {
  private showOutput = false
  private activeName = 'text'
  private showAvatarUpload = false

  private async beforeCreate() {
    // 如果未登录，则跳转到登录页
    if (!sessionStorage.getItem('xz-token')) {
      this.$router.push({ name: 'login' })
    }
    // 获取用户配置信息
    const responseData = await await getUserProfile(this)
    if (responseData.error) {
      // 获取配置信息出错，也跳转到登录页
      this.$router.push({ name: 'login' })
    }
  }

  private toggleChangeAvatar() {
    this.showAvatarUpload = !this.showAvatarUpload
  }

  // 更新头像
  private cropSuccess(imageDataUrl: string) {
    // console.log(imageDataUrl)
    this.$http({
      method: 'patch',
      url: `http://localhost:3000/api/v2/user/profile/avatar`,
      data: {
        data: imageDataUrl
      }
    })
      .then((res) => {
        if (!res.data.error) {
          //  [{avatar: "default"}]
          this.$store.commit('changeAvatar', res.data.body[0].avatar)
          this.$message('修改头像成功')
        } else {
          this.$message('修改头像失败')
        }
      })
      .catch((err) => {
        this.$message('修改头像失败')
        console.log(err)
      })
  }

  private seeArgee() {
    this.$store.commit('setShowAgreement', true)
  }
}
</script>

<style lang="less" scoped>
.user_page {
  .con_wrap {
    .user_row {
      padding: 30px 0;
      border-bottom: 1px solid #eee;
      text-align: center;
      color: #444;
      &:last-child {
        border: none;
      }
    }
    .avatar {
      .imgwrap {
        margin: 0 auto;
        width: 128px;
        height: 128px;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 1px 8px #7fb7f3;
        cursor: pointer;
        margin-bottom: 20px;
        position: relative;
        &:hover .black {
          top: 0%;
        }
        .black {
          position: absolute;
          top: 100%;
          left: 0;
          width: 128px;
          height: 128px;
          z-index: 2;
          text-align: center;
          color: #fff;
          background: rgba(0, 0, 0, 0.4);
          transition: all 0.5s;
          .con {
            // height: 100%;
            // display: flex;
            // align-items: center;
            // justify-content: center;
            text-align: center;
            position: absolute;
            z-index: 2;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            i {
              font-size: 22px;
            }
            span {
              font-size: 14px;
            }
          }
        }
      }
      .uname {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .blue_link {
      color: #2196f3;
    }
  }
  .outputArea {
    width: 100%;
    height: 250px;
    resize: none;
    padding: 20px 10px 0;
    border: #e4e7ed 1px solid;
    font-size: 14px;
    color: #333;
  }
  .close {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<style lang="less">
// 修改框架和其他组件的样式
.output_wrap .el-tabs__header {
  margin-bottom: 0;
}
.vicp-img-container img {
  max-width: unset;
}
.vicp-crop {
  text-align: center !important;
}
.vicp-crop-left,
.vicp-crop-right {
  float: none !important;
  display: inline-block !important;
  vertical-align: top !important;
}
.vicp-crop-right {
  box-sizing: border-box;
  padding-left: 50px;
}
.vicp-preview {
  height: auto !important;
  & > div:first-child {
    display: none;
  }
  .vicp-preview-item {
    box-sizing: content-box !important;
    padding: 0 !important;
    width: 200px !important;
    height: auto !important;
    text-align: center;
    img {
      width: 200px !important;
      height: 200px !important;
      padding: 0 !important;
      border: none !important;
      position: relative !important;
    }
    span {
      position: relative !important;
      padding-top: 10px;
    }
  }
}
</style>
