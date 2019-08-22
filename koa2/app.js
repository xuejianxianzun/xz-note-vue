const fs = require('fs')
const path = require('path')
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
// 引入 bcrypt.js
// https://github.com/dcodeIO/bcrypt.js
const bcrypt = require('bcryptjs')
// 引入 mysql-pro
// https://github.com/shhhplus/mysql-promise
const MysqlPro = require('mysql-pro')
const DBConfig = require('./DBConfig')

// 创建 app
const app = new Koa()

// 配置跨域
app.use(
  cros({
    origin: function(ctx) {
      // if (ctx.url === '/api/v2/user/profile/avatar') {
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

// 对所有请求都执行的中间层
app.use(async (ctx, next) => {
  await next()
  ctx.response.type = 'application/json'
})
app.use(bodyParser())
app.use(router.routes())

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
        ctx.status = 403
        ctx.response.body = {
          error: true,
          message: 'jwt expired',
          body: []
        }
        return false
      } else {
        // 验证 token 成功
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

// 登陆成功后返回的信息，参数为该用户的数据库查询结果
function loginSuccess(ctx, res) {
  const userinfo = {
    id: res.id,
    user: res.uname,
    avatar: res.avatar,
    email: res.email
  }
  ctx.status = 200
  ctx.response.body = {
    error: false,
    message: '200 Ok',
    body: {
      token: jwt.sign(userinfo, serect, { expiresIn: '1h' }),
      userinfo: userinfo
    }
  }
}

// 验证已存在的 token
router.get('/api/v2/user/profile/all', async (ctx, next) => {
  let rst = await checkToken(ctx)
  console.log(rst)

  if (!rst) {
    return false
  }

  let body = ctx.request.body
  let DB = new MysqlPro(DBConfig)
  await DB.query(`select * from users where id='${rst.id}'`).then((res) => {
    res = JSON.parse(JSON.stringify(res))
    if (res.length > 0) {
      res = res[0]
      loginSuccess(ctx, res)
    } else {
      ctx.status = 401
      ctx.response.body = {
        error: true,
        message: 'no such user',
        body: []
      }
    }
  })
})

// 用户注册
router.post('/api/v2/register', async (ctx, next) => {
  let body = ctx.request.body
  let DB = new MysqlPro(DBConfig)
  let res = await DB.query(`select * from users where uname='${body.user}'`)
  // 如果结果为空，返回值是一个空数组 []
  res = JSON.parse(JSON.stringify(res))
  console.log(res)
  if (res.length > 0) {
    // 已经有这个用户了
    ctx.status = 200
    ctx.response.body = {
      error: true,
      message: 'user exists',
      body: []
    }
  } else {
    // 加密密码
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(body.pwd, salt)
    // 添加新用户
    await DB.query(
      `insert into users (uname,pwd,email) values ('${
        body.user
      }', '${hash}', '${body.email}')`
    )
    // 返回登陆成功的数据
    let res = await DB.query(`select * from users where uname='${body.user}'`)
    res = JSON.parse(JSON.stringify(res))
    res = res[0]
    loginSuccess(ctx, res)
  }
})

// 用户登陆
router.post('/api/v2/login', async (ctx, next) => {
  let body = ctx.request.body
  let DB = new MysqlPro(DBConfig)
  await DB.query(`select * from users where uname='${body.user}'`).then(
    (res) => {
      // 如果结果为空，返回值是一个空数组 []
      // [ RowDataPacket { id: 1, uname: 'saber', pwd: '123', avatar: 'default' } ]
      res = JSON.parse(JSON.stringify(res))
      console.log(res)
      // [ { id: 1, uname: 'saber', pwd: '123', avatar: 'default' } ]
      if (res.length > 0) {
        res = res[0]
        // 验证密码
        let result = bcrypt.compareSync(body.pwd, res.pwd)
        if (!result) {
          // 验证失败
          ctx.status = 401
          ctx.response.body = {
            error: true,
            message: 'pwd check failed',
            body: []
          }
        } else {
          // 返回登陆成功的信息，携带 token
          loginSuccess(ctx, res)
        }
      } else {
        ctx.status = 401
        ctx.response.body = {
          error: true,
          message: 'no such user',
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
router.get('/api/v2/notes/all', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }

  // 验证通过
  let DB = new MysqlPro(DBConfig)
  let res = await DB.query(`select * from notes where userid='${rst.id}'`)
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
router.post('/api/v2/notes', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  // 验证通过
  let DB = new MysqlPro(DBConfig)
  let res = await DB.query(
    `insert into notes (userid, content, time) values ('${rst.id}', '${
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
router.delete('/api/v2/notes/:noteid', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  // 验证通过
  let DB = new MysqlPro(DBConfig)
  let res = await DB.query(
    `delete from notes where id=${Number.parseInt(
      ctx.params.noteid
    )} and userid=${rst.id}`
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
router.patch('/api/v2/notes/:noteid/:field', async (ctx, next) => {
  // 只允许修改这些字段
  if (ctx.params.field !== 'content' && ctx.params.field !== 'tag') {
    ctx.status = 403
    ctx.response.body = {
      error: true,
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
    }',time='${new Date().getTime()}' where id=${Number.parseInt(
      ctx.params.noteid
    )} and userid=${rst.id}`
  )
  console.log(res)
  ctx.status = 200
  ctx.response.body = {
    error: false,
    message: '200 Ok',
    body: []
  }
})

// 修改用户配置
router.patch('/api/v2/user/profile/:field', async (ctx, next) => {
  // 只允许修改这些字段
  // pwd avatar email
  // 目前只修改了 avatar
  if (ctx.params.field !== 'avatar') {
    ctx.status = 403
    ctx.response.body = {
      error: true,
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
  if (ctx.params.field === 'avatar') {
    updateAvatar(ctx, ctx.request.body.data)
  }
})

function updateAvatar(ctx, imgData) {
  // imgData 是图片的 base64 的 dataurl
  // 过滤data:URL 标记
  const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '')
  const dataBuffer = Buffer.from(base64Data, 'base64')
  const imgName = new Date().getTime().toString() + '.jpg'
  const filePath = path.resolve(__dirname, '../public/avatar/', imgName)
  fs.writeFile(filePath, dataBuffer, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log('保存成功！')
    }
  })
  let DB = new MysqlPro(DBConfig)
  // 数据库中只保存头像的文件名，路径名由前后端约定
  let res = DB.query(`update users set avatar = '${imgName}'`)
  ctx.status = 200
  ctx.response.body = {
    error: false,
    message: '200 Ok',
    body: [
      {
        avatar: imgName
      }
    ]
  }
}

// listen 要放到最后
app.listen(3000)

console.log('koa start')
