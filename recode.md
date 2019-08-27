- 覆盖库的默认样式

写在不加 scope 的 style 里。scope 只适用于 vue 本身的组件。

- textarea 的 spellcheck 属性可以取消拼写检查

`spellcheck="false"`

- 原生事件记得加上 native，如

`@submit.native.prevent`

- 公用方法调用 router

1. 把方法挂载在 Vue.prototype 上。
2. vue 组件调用公共方法时传递 this。

- public 文件夹

用绝对路径引用 public 文件夹里的文件，不需要写 public

- nodejs 的模块化

使用的是 CommonJS，模块文件使用 `module.exports` 导出，使用 `require` 导入。

- slot

slot 插槽，例如在模板 test 里定义插槽：

```
<slot name="title">
<h1>默认标题</h1>
</slot>
```

之后在其他组件里引入该模板，替换该插槽的内容：

```
<test>
<h1 slot="title">我是替换的标题</h1>
</test>
```

这样，上面的插槽会被替换成下面的 h1 标签。如果没有替换，则显示插槽的默认内容。

- 表单验证

表单验证必须在 form 上设置 :model="data"，之后在 input 上传入该 data 中的属性，如 prop="field"。