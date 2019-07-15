// https://koajs.com/
const Koa = require('koa')
// koa-router 路由，注意require('koa-router')返回的是函数:
// https://github.com/ZijianHe/koa-router
const router = require('koa-router')()
// koa-bodyparser 可以解析 json、form、text 格式的 body 对象，设置为 ctx.request.body
const bodyParser = require('koa-bodyparser')
// koa2-cors 配置跨域
// https://www.npmjs.com/package/koa2-cors
const cros = require('koa2-cors')
// 引入 jsonwebtoken
// https://www.npmjs.com/package/jsonwebtoken
const jwt = require('jsonwebtoken')
const serect = 'xjxz-vue-note-xjxz' // 密钥
// 引入 mysql-pro
// https://npm.taobao.org/package/mysql-pro
const MysqlPro = require('mysql-pro')
const DBConfig = {
  // 数据库配置信息
  mysql: {
    host: 'localhost',
    port: 3306,
    database: 'note',
    user: 'root',
    password: 'root'
  }
}

// 创建 app
const app = new Koa()

// 配置跨域
app.use(
  cros({
    origin: function(ctx) {
      // if (ctx.url === '/login') {
      //   return '*' // 允许来自所有域名请求
      // }
      return 'http://localhost:8080'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
)

// 创建 token
function createToken(userinfo) {
  const token = jwt.sign(userinfo, serect, { expiresIn: '1h' })
  return token
}

// 验证 token
async function checkToken(ctx) {
  console.log(ctx.header.authorization)
  let token = ctx.header.authorization
  // 判断是否携带了 token
  if (token) {
    let rst = await jwt.verify(token, serect, (err, data) => {
      if (err) {
        // 验证 token 出错，一般是过期 'jwt expired'
        console.log(err)
        ctx.status = 500
        ctx.response.body = {
          error: true,
          message: err.message,
          body: []
        }
        return false
      } else {
        // 验证 token 成功
        // 验证要操作的 uid 是否是用户自己的 uid
        if (Number.parseInt(ctx.params.uid) !== data.id) {
          ctx.status = 403
          ctx.response.body = {
            error: true,
            message: 'HTTP 403 Forbidden',
            body: []
          }
          return false
        }
        return data
      }
    })
    // 返回验证结果
    return rst
  } else {
    // 没有携带 token
    ctx.status = 401
    ctx.response.body = {
      error: true,
      message: '401 Unauthorized',
      body: []
    }
    return false
  }
}

// 对所有请求都执行的中间层
app.use(async (ctx, next) => {
  await next()
  ctx.response.type = 'application/json'
})
app.use(bodyParser())
app.use(router.routes())

// 用户登陆
router.post('/login', async (ctx, next) => {
  let body = ctx.request.body
  let DB = new MysqlPro(DBConfig)
  await DB.query(
    `select * from users where uname='${body.user}' and pwd='${body.pwd}'`
  ).then(
    (res) => {
      // 如果结果为空，返回值是一个空数组 []
      // [ RowDataPacket { id: 1, uname: 'saber', pwd: '123', avatar: 'default' } ]
      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      // [ { id: 1, uname: 'saber', pwd: '123', avatar: 'default' } ]
      if (res.length > 0) {
        res = res[0]
        const userinfo = {
          id: res.id,
          user: res.uname,
          avatar: res.avatar
        }
        ctx.status = 200
        ctx.response.body = {
          error: false,
          message: '200 Ok',
          body: {
            token: createToken(userinfo),
            userinfo: userinfo
          }
        }
      } else {
        ctx.status = 401
        ctx.response.body = {
          error: true,
          message: '401 Unauthorized',
          body: []
        }
      }
    },
    (err) => {
      console.log(err)
      ctx.status = 500
      ctx.response.body = {
        error: true,
        message: '500 Internal Server Error',
        body: []
      }
    }
  )
})

// 获取所有笔记
router.get('/user/:uid/notes/all', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  // 验证通过
  let DB = new MysqlPro(DBConfig)
  let res = await DB.query(
    `select * from notes where userid='${ctx.params.uid}'`
  )
  res = JSON.parse(JSON.stringify(res))
  console.log(res)
  ctx.status = 200
  ctx.response.body = {
    error: false,
    message: '200 Ok',
    body: {
      notes: res
    }
  }
})

// 新增笔记
router.post('/user/:uid/notes', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  // 验证通过
  let DB = new MysqlPro(DBConfig)
  let res = await DB.query(
    `insert into notes (userid, content, time) values ('${ctx.params.uid}', '${
      ctx.request.body.content
    }','${new Date().getTime()}')`
  )
  // console.log(res)
  ctx.status = 201
  ctx.response.body = {
    error: false,
    message: '201 Created',
    body: []
  }
})

// 删除笔记
router.delete('/user/:uid/notes/:noteid', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  // 验证通过
  let DB = new MysqlPro(DBConfig)
  let res = await DB.query(
    `delete from notes where id=${ctx.params.noteid} and userid=${
      ctx.params.uid
    }`
  )
  console.log(res)
  ctx.status = 204
  ctx.response.body = {
    error: false,
    message: '204 No Content',
    body: []
  }
})

// 修改笔记
router.patch('/user/:uid/notes/:noteid/:field', async (ctx, next) => {
  // 只允许修改这些字段
  if (ctx.params.field !== 'content' && ctx.params.field !== 'tag') {
    ctx.status = 403
    ctx.response.body = {
      error: false,
      message: '403 this field can not be edit',
      body: []
    }
    return false
  }
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  // 验证通过
  let DB = new MysqlPro(DBConfig)
  let res = await DB.query(
    `update notes set ${ctx.params.field}='${
      ctx.request.body[ctx.params.field]
    }',time='${new Date().getTime()}' where id=${ctx.params.noteid} and userid=${
      ctx.params.uid
    }`
  )
  console.log(res)
  ctx.status = 200
  ctx.response.body = {
    error: false,
    message: '200 Ok',
    body: []
  }
})

// listen 要放到最后
app.listen(3000)

console.log('koa start')
