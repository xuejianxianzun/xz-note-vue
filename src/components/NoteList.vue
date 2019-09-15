<template>
  <div class="note_list_wrap">
    <div class="note_list_con">
      <!-- add -->
      <div class="note_item">
        <div class="add" v-show="!addData.showEdit">
          <div class="addbutton">
            <el-button type="primary" @click="edit(addData)">+ add</el-button>
          </div>
        </div>
        <div
          class="con"
          v-show="addData.showEdit"
          :class="{ editing: addData.showEdit === true }"
        >
          <textarea
            class="note_text_editor"
            spellcheck="false"
            v-if="addData.showEdit"
            v-focus
            v-model="addData.content"
          ></textarea>
          <div class="ctrl editopt">
            <button class="btn" @click="cancelEdit(addData)">
              <i class="el-icon-refresh-right"></i>&nbsp;取消
            </button>
            <button class="btn" @click="checkEdit(addData)">
              <i class="el-icon-check"></i>&nbsp;提交
            </button>
          </div>
        </div>
      </div>
      <!-- list -->
      <div class="note_item" v-for="item in filteNote" :key="item.id">
        <div class="con" :class="{ editing: showEdit[item.id] === true }">
          <div class="ctrl info">
            <div class="time">{{ parseDate(item.time) }}</div>
            <div class="icon" title="设置标签" @click="showEditTag(item)">
              <i class="el-icon-price-tag"></i>
            </div>
            <div class="icon" title="删除笔记" @click="deleteNote(item)">
              <i class="el-icon-delete"></i>
            </div>
          </div>
          <div
            class="note_text"
            @click="edit(item)"
            v-show="!showEdit[item.id]"
          >
            <p v-html="wrap2BR(item.content)"></p>
          </div>
          <textarea
            class="note_text_editor"
            spellcheck="false"
            v-model="item.content"
            v-if="showEdit[item.id]"
            v-focus
          ></textarea>
          <div class="ctrl editopt" v-show="showEdit[item.id]">
            <button class="btn" @click="cancelEdit(item)">
              <i class="el-icon-refresh-right"></i>&nbsp;取消
            </button>
            <button class="btn" @click="checkEdit(item)">
              <i class="el-icon-check"></i>&nbsp;提交
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <el-dialog
      class="dialog_set_tag"
      title="设置标签"
      :visible.sync="dialogSetTag"
    >
      <el-form @submit.native.prevent>
        <el-form-item label="手动输入标签" label-width="120px">
          <el-input
            v-model="inputTag"
            autofocus
            autocomplete="off"
            width="200px"
            class="input_tag"
            id="input_tag"
          ></el-input>
          <el-button
            type="primary"
            native-type="submit"
            @click="addTempTag(inputTag)"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item class="input_tags">
          <el-tag
            v-for="tag in tempTags"
            :key="tag"
            @close="removeTempTag(tag)"
            effect="light"
            closable
          >
            {{ tag }}
          </el-tag>
        </el-form-item>
        <el-form-item label="选择已有标签" label-width="120px">
          <div class="existed_tag">
            <el-tag
              v-for="tag in $store.state.allTag"
              :key="tag"
              @click="addTempTag(tag)"
              effect="light"
              class="el_tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </el-form-item>
        <div class="tip">
          <p>
            您可以手动输入标签，也可以选择已有的标签。
            <br />
            每条笔记可以添加多个标签。
          </p>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditTag">取 消</el-button>
        <el-button type="primary" @click="submitEditTag">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  directives: {
    // textarea 被创建后，自动聚焦到 textarea
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
  computed: {
    // 返回符合条件的笔记
    filteNote() {
      let rst = []
      // 筛选 tag
      if (this.$store.state.showTag === this.$store.state.showAllTag) {
        rst = this.$store.state.noteData
      } else {
        rst = this.$store.state.noteData.filter((note: any) => {
          return note.decodeTags.includes(this.$store.state.showTag)
        })
      }
      // 筛选搜索词
      rst = rst.filter((note: any) => {
        return note.content.includes(this.$store.state.searchText)
      })
      return rst
    }
  }
})
export default class Notelist extends Vue {
  private token: string = sessionStorage.getItem('xz-token') || ''
  // 新增笔记时，所使用的初始数据
  private addData = {
    isAdd: true,
    showEdit: false,
    content: ''
  }
  private showEdit: any = [] // 控制每个笔记的编辑框是否显示
  private tempText: string = '' // 临时文本，编辑时先把文本存储到这里
  private dialogSetTag: boolean = false // 控制是否显示 dialog
  private setTageId: number = 0 // 编辑 tag 时保存编辑的笔记的 id
  private inputTag: string = '' // 用户输入的 tag 文本
  private tempTags: string[] = [] // 此笔记修改之前已有的 tag，以及用户本次输入产生的 tag。在提交之前可以被删除
  private existedTags: string[] = [] // 之前所有已存在的 tag
  private chooseTags: string[] = [] // 在已存在的 tag 里选择的 tag
  // 把文本里的 \n 换行转换为 html 标签的换行
  private wrap2BR(text: string) {
    return text.replace(/\n/g, '<br>')
  }
  // 进入编辑模式
  private edit(data: any) {
    if (!this.token) {
      this.$alert('请登录后再添加笔记。', '需要登录', {
        confirmButtonText: '确定'
      })
      return false
    }
    if ('isAdd' in data) {
      data.showEdit = true
    } else {
      this.tempText = data.content
      this.showEdit[data.id] = true
      // 这一句等于给数组重新赋值，这样 vue 才能监测到它的变化
      this.showEdit = [...this.showEdit]
    }
  }
  // 取消编辑
  private cancelEdit(data: any) {
    if ('isAdd' in data) {
      data.content = ''
      data.showEdit = false
    } else {
      data.content = this.tempText
      this.tempText = ''
      this.showEdit[data.id] = false
      this.showEdit = [...this.showEdit]
    }
  }
  // 提交更改时检查
  private checkEdit(data: any) {
    if ('isAdd' in data) {
      data.showEdit = false
    } else {
      if (data.content !== this.tempText) {
        this.updateNote(data, 'content')
      } else {
        this.$message('内容未改变，不需要更新。')
      }
      this.tempText = ''
      this.showEdit[data.id] = false
      this.showEdit = [...this.showEdit]
    }
    // 新增笔记
    if (data.content && 'isAdd' in data) {
      this.addNote(data)
    }
    // 删除笔记
    if (!data.content && !('isAdd' in data)) {
      this.$message('空笔记将被删除。')
      this.deleteNote(data)
    }
  }
  // 把笔记数据按 id 倒序排列
  private sortByIdDesc(a: any, b: any) {
    if (a.id > b.id) {
      return -1
    }
    if (a.id === b.id) {
      return 0
    }
    if (a.id < b.id) {
      return 1
    }
  }
  // 解析时间戳
  private parseDate(time: string) {
    const d = new Date(Number.parseInt(time))
    return `${d.getFullYear()}-${d.getMonth() +
      1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
  }
  // 创建后获取笔记
  private created() {
    if (this.token) {
      this.getNote()
    }
  }
  // 获取笔记
  private getNote() {
    this.$http({
      method: 'get',
      url: `${this.$store.state.apiPath}/notes/all`
    })
      .then((res) => {
        let notes = res.data.body.notes
        let allTags = new Set()
        for (let note of notes) {
          // 解析 tag 并添加到笔记里
          let tags = this.decodeTag(note.tag)
          note.decodeTags = tags
          // 储存这个笔记的所有 tag
          for (const tag of tags) {
            allTags.add(tag)
          }
          // 设置这个笔记的编辑状态
          this.showEdit[note.id] = false
        }
        // 保存所有 tag
        this.$store.state.allTag = [...allTags]
        // 如果当前 tag 列表里没有要展示的那个 tag（可能是笔记被删除了），则把展示 tag 切换到默认的“展示全部” tag
        if (!this.$store.state.allTag.includes(this.$store.state.showTag)) {
          this.$store.commit('setShowTag', this.$store.state.showAllTag)
        }
        this.$store.state.noteData = res.data.body.notes.sort(this.sortByIdDesc)
      })
      .catch(() => {
        // console.log(err)
      })
  }
  // 添加笔记
  private addNote(data: any) {
    this.$http({
      method: 'post',
      url: `${this.$store.state.apiPath}/notes`,
      data: {
        content: data.content
      }
    })
      .then((res) => {
        data.content = ''
        this.$message('添加成功')
        this.getNote()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // 删除笔记
  private deleteNote(data: any) {
    this.$http({
      method: 'delete',
      url: `${this.$store.state.apiPath}/notes/${data.id}`
    })
      .then((res) => {
        this.$message('删除成功')
        this.getNote()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // 更新笔记
  private updateNote(data: any, type: string) {
    // type 可以是 'content' 或者 'tag'
    let send: any = {}
    send[type] = data[type]
    this.$http({
      method: 'patch',
      url: `${this.$store.state.apiPath}/notes/${data.id}/${type}`,
      data: send
    })
      .then((res) => {
        this.$message('更新成功')
        this.getNote()
      })
      .catch((err) => {
        this.$message('更新失败')
        console.log(err)
      })
  }
  // 设置 tag
  private showEditTag(item: any) {
    this.dialogSetTag = true
    const inputTag = document.querySelector('#input_tag') as HTMLInputElement
    if (inputTag) {
      inputTag.focus()
    }
    // 如果这个笔记有 tag，则添加到临时 tag 列表里
    this.tempTags = this.decodeTag(item.tag)
    this.setTageId = item.id
  }
  // 因为 tag 储存时以逗号分隔，所以要解码
  private decodeTag(tag: string) {
    if (!tag) {
      return []
    } else {
      return tag.split(',')
    }
  }
  // 关闭设置 tag 的对话框，重设一些变量
  private cancelEditTag() {
    this.dialogSetTag = false
    this.setTageId = 0
    this.inputTag = ''
    this.tempTags = []
  }
  // 增加到临时 tag 列表
  private addTempTag(tag: string) {
    if (!tag) {
      return false
    }
    if (!this.tempTags.includes(tag)) {
      this.tempTags.push(tag)
    }
    this.inputTag = ''
    return false
  }
  // 从临时 tag 列表中移除
  private removeTempTag(tag: string) {
    this.tempTags.splice(this.tempTags.indexOf(tag), 1)
  }
  // 更新当前笔记的 tag
  private submitEditTag() {
    this.dialogSetTag = false
    if (this.tempTags.length > 0) {
      for (const note of this.$store.state.noteData) {
        // 将 tag 文本附带到笔记上，提交修改
        if (note.id === this.setTageId) {
          note.tag = this.tempTags.join(',')
          this.updateNote(note, 'tag')
        }
      }
    }
    this.cancelEditTag()
  }
}
</script>

<style lang="less" scoped>
.note_list_con {
  display: flex;
  flex-wrap: wrap;
  .note_item {
    background: #fff;
    border: 1px solid #ddd;
    width: 200px;
    height: 190px;
    margin: 0 20px 20px 0;
    box-shadow: 0px 1px 3px #eee;
    font-size: 14px;
    color: #333;
    position: relative;
    flex-shrink: 0;
    .con {
      height: 100%;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;

      .info {
        display: flex;
      }
      &.editing {
        height: 250px;
      }
      &:hover .ctrl {
        bottom: 0;
      }
      .ctrl {
        position: absolute;
        z-index: 1;
        left: 0;
        width: 100%;
        height: 36px;
        line-height: 36px;
        color: #fff;
        transition: all 0.3s;
      }
      .info {
        background: rgba(0, 0, 0, 0.7);
        bottom: -36px;
        .time {
          width: 100%;
          font-size: 14px;
          color: #ccc;
          font-family: cursive;
          padding: 0 10px;
        }
        .icon {
          flex: 1;
          cursor: pointer;
          font-size: 16px;
          padding: 0 10px;
          transition: all 0.3s;
          background: rgba(0, 0, 0, 0);
          &:hover {
            background: rgba(64, 158, 255, 1);
          }
        }
      }
      .editopt {
        display: flex;
        align-items: center;
        bottom: 0;
        .btn {
          border: none;
          padding: 0;
          width: 50%;
          height: 100%;
          font-size: 14px;
          cursor: pointer;
          text-align: center;
          background: rgb(64, 158, 255);
          transition: all 0.3s;
          color: #fff;
          &:hover,
          &:focus {
            background: #0289e4;
          }
        }
      }
    }
    .add {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
    .note_text {
      padding: 8px;
      height: 100%;
      overflow-wrap: break-word;
      line-height: 1.6;
    }
    .note_text_editor {
      position: relative;
      z-index: 1;
      display: inline-block;
      resize: none;
      height: 214px;
      width: 100%;
      font-size: 14px;
      font-family: '微软雅黑';
      padding: 7px;
      padding-bottom: 0;
      line-height: 1.6;
      color: #333;
    }
  }
}
.dialog_set_tag {
  .el_tag {
    cursor: pointer;
  }
  .tip {
    color: #999;
  }
  .input_tag {
    width: 220px;
    margin-right: 10px;
  }
}
</style>

<style lang="less">
.dialog_set_tag {
  .el-dialog {
    width: 460px;
  }
  .el-form-item__label {
    text-align: left;
  }
  .el-tag {
    margin-right: 10px;
  }
  .input_tags {
    .el-tag {
      background: #5bacff;
    }
    *,
    .el-icon-close {
      color: #fff;
    }
  }
}
</style>
