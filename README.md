# 简介

这是一个练习用的记事本网站，只能储存纯文本的笔记。

前台 Vue CLI，后台 Node.js，数据库 MySQL。

**功能：**

笔记的增删改查；
用户注册登陆，修改资料（使用邮箱验证）

**技术栈：**

前台：Vue + Element + Typescript + Less。

后台： Koa2 + MySQL + JWT。

**演示网址：**

[https://note.pixiv.download](https://note.pixiv.download)

# 启动项目

项目中同时包含前台和后台项目。后台项目文件夹 `koa2` 可以移至其他位置。

1. 安装依赖

```
npm i -g @vue/cli

npm i

cd ./koa2
npm i
```

2. 初始化数据库

在数据库中运行 `koa2/database.sql` 的语句，或者在 mysql 中导入 sql 文件，如：

```
mysql -u root -p

// 把 database.sql 的路径替换为真实路径
source koa2/database.sql
```

3. 编辑配置文件

填写 `koa2/config.js` 中的配置信息

4. 启动前后台

```
npm run serve

cd ./koa2
npm run koa
```
