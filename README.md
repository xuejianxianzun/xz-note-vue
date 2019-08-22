运行环境：

Node.js + MySQL

1. 安装依赖

`npm install`

2. 初始化数据库

```
mysql -u root -p

-- 进入 mysql 后导入 sql 文件，如：
source D:\document\vue\note\koa2\database.sql
```

3. 启动 koa2

`npm run koa`

4. 启动 vue-cli 服务

`npm run serve`