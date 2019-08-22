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