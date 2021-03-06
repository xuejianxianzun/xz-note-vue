// 配置项
const cfg = require('./config')
const siteUrl = cfg.siteUrl
const serect = cfg.serect

// 引入模块
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
// 引入 bcrypt.js
// https://github.com/dcodeIO/bcrypt.js
const bcrypt = require('bcryptjs')
// 引入 mysql-pro
// https://github.com/shhhplus/mysql-promise
const MysqlPro = require('mysql-pro')
const DB = new MysqlPro(cfg.DBConfig)
// 引入发信功能
const mail = require('./sendMail')

// 创建 app
const app = new Koa()

// 配置跨域
app.use(
  cros({
    origin: function(ctx) {
      // if (ctx.url === '/api/v2/user/profile/avatar') {
      //   return '*' // 允许来自所有域名请求
      // }
      return siteUrl
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
  let token = ctx.header.authorization
  // 判断是否携带了 token
  if (token) {
    let rst = await jwt.verify(token, serect, (err, data) => {
      if (err) {
        // 验证 token 出错，一般是过期 'jwt expired'
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
    return returnCode(ctx, 401)
  }
}

// 加密密码
function getHash(pwd) {
  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(pwd, salt)
  return hash
}

// 生成验证码
function getVerifyCode(string, length) {
  let verification = ''
  for (let index = 0; index < length; index++) {
    const i = parseInt(Math.random() * string.length)
    verification += string[i]
  }
  return verification
}

// 发送验证码
async function sendVerifyCode(ctx, email, length = 6) {
  // 贴心的去掉了容易混淆的 O 和 0 ^_-
  const fullVerification = 'QWERTYUIPASDFGHJKLZXCVBNM123456789-_+=()!#$%^[]'
  const verification = getVerifyCode(fullVerification, length)
  const html = `我们需要对您的账户进行验证。如果不是您本人操作，请忽略此邮件。<br>验证码: <b>${code}</b><br><br>仙尊笔记`
  // 发信
  try {
    await mail(email, html)
    return verification
  } catch (error) {
    // 发信出错，最可能的原因是用户的邮箱地址不存在
    returnCode(ctx, 500)
    return 'error'
  }
}

// 发送注册链接
async function sendRegistLink(ctx, email) {
  // 生成验证链接，不包含特殊字符
  const fullVerification = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
  const verification = getVerifyCode(fullVerification, 32)
  const link = `${siteUrl}/checkregist/${verification}`
  const html = `有人使用您的邮箱注册仙尊笔记账户。如果不是您本人操作，请忽略此邮件。<br><br>注册链接:<br><a href="${link}">${link}</a><br><br>仙尊笔记`
  // 发信
  try {
    await mail(email, html)
    return verification
  } catch (error) {
    // 发信出错，最可能的原因是用户的邮箱地址不存在
    returnCode(ctx, 500)
    return 'error'
  }
}

// 检查数据库里的验证码状态，要求它已经通过了上一步的验证码验证
async function checkCode(id) {
  let res = await DB.query(`select verifytime from users where id = ?`, [id])
  res = JSON.parse(JSON.stringify(res))
  res = res[0]
  // 检查验证码检验结果是否正确
  if (parseInt(res.verifytime) !== 1) {
    returnCode(ctx, 403)
    return false
  } else {
    return true
  }
}

// 加密 email
function encryEmail(email) {
  // > 123456789@qq.com
  // < 123******@qq.com
  // 找出 @ 符号的位置
  let atIndex = email.indexOf('@')
  // 取出需要加密的部分替换成 *
  let encryPart = email.substr(3, atIndex - 3)
  encryPart = '*'.repeat(encryPart.length)
  // 拼接
  email = email.substr(0, 3) + encryPart + email.substr(atIndex, email.length)
  return email
}

// 返回状态码，不携带其他信息
function returnCode(ctx, code) {
  let err = true
  let result = false
  if ([200, 201, 204].includes(code)) {
    err = false
    result = true
  }
  ctx.status = code
  ctx.response.body = {
    error: err,
    message: code.toString(),
    body: []
  }
  return result
}

// 当用户注册、登录、修改资料时，返回数据。
function returnUserinfo(ctx, res, withToken) {
  // 要返回的用户信息
  const userinfo = {
    id: res.id,
    user: res.name,
    avatar: res.avatar,
    email: encryEmail(res.email)
  }
  // 要返回的数据
  let bodyData = {}
  // 在登陆时生成新的 token
  if (withToken) {
    bodyData = {
      token: jwt.sign(userinfo, serect, { expiresIn: '1h' }),
      userinfo
    }
  } else {
    // 其他情况下不生成 token
    bodyData = {
      userinfo
    }
  }
  // 返回数据
  ctx.status = 200
  ctx.response.body = {
    error: false,
    message: '200 Ok',
    body: bodyData
  }
}

// 用户注册
router.post('/api/v2/register', async (ctx, next) => {
  let body = ctx.request.body
  // 检查是否已经有这个用户了
  let res = await DB.query(`select * from users where name = ?`, [body.user])
  // 如果结果为空，返回值是一个空数组 []
  res = JSON.parse(JSON.stringify(res))
  if (res.length > 0) {
    // 已经有这个用户了
    ctx.status = 403
    ctx.response.body = {
      error: true,
      message: 'user exists',
      body: []
    }
  } else {
    // 发送注册链接
    const verification = await sendRegistLink(ctx, body.email)
    // 如果发信成功
    if (verification !== 'error') {
      // 生成密码
      let hash = getHash(body.pwd)
      // 把用户信息存入临时表中
      await DB.query(
        `insert into regist (name, pwd, email, verify, verifytime) values (?, ?, ?, ?, ?)`,
        [
          body.user,
          hash,
          body.email,
          verification,
          (new Date().getTime() + 10 * 60 * 1000).toString()
        ]
      )
      // 返回信息
      returnCode(ctx, 200)
    }
  }
})

// 验证注册链接
router.get('/api/v2/checkregist/:key', async (ctx, next) => {
  // 核对验证码
  let res = await DB.query(
    `select * from regist where verify = ?`,
    ctx.params.key
  )
  res = JSON.parse(JSON.stringify(res))
  // 如果查询不到
  if (!res.length > 0) {
    return returnCode(ctx, 404)
  } else {
    // 查询到则检查过期时间
    res = res[0]
    const notExpired = parseInt(res.verifytime) > new Date().getTime()
    if (notExpired) {
      // 没有过期则建立新用户
      await DB.query(`insert into users (name, pwd, email) values (?, ?, ?)`, [
        res.name,
        res.pwd,
        res.email
      ])
      // 删除临时表中的数据
      DB.query(`delete from regist where verify = ?`, ctx.params.key)
      // 返回结果
      return returnCode(ctx, 200)
    } else {
      // 过期
      // 删除临时表中的数据
      DB.query(`delete from regist where verify = ?`, ctx.params.key)
      return returnCode(ctx, 403)
    }
  }
})

// 用户登录
router.post('/api/v2/login', async (ctx, next) => {
  let body = ctx.request.body
  let res = await DB.query(`select * from users where name = ?`, [body.user])
  // 如果结果为空，返回值是一个空数组 []
  // [ RowDataPacket { id: 1, name: 'saber', pwd: '123', avatar: 'default' } ]
  res = JSON.parse(JSON.stringify(res))
  // [ { id: 1, name: 'saber', pwd: '123', avatar: 'default' } ]
  if (res.length > 0) {
    res = res[0]
    // 验证密码
    let result = bcrypt.compareSync(body.pwd, res.pwd)
    if (!result) {
      // pwd check failed
      return returnCode(ctx, 401)
    } else {
      // 返回登录成功的信息，携带 token
      returnUserinfo(ctx, res, true)
    }
  } else {
    // no such user
    return returnCode(ctx, 401)
  }
})

// 获取用户配置
router.get('/api/v2/user/profile/all', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }

  let res = await DB.query(`select * from users where id = ?`, [rst.id])
  res = JSON.parse(JSON.stringify(res))
  if (res.length > 0) {
    res = res[0]
    returnUserinfo(ctx, res, false)
  } else {
    return returnCode(ctx, 401)
  }
})

// 获取所有笔记
router.get('/api/v2/notes/all', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }

  // 验证通过
  let res = await DB.query(`select * from notes where userid = ?`, [rst.id])
  res = JSON.parse(JSON.stringify(res))
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
  const conText = ctx.request.body.content

  let res = await DB.query(
    `insert into notes (userid, content, time) values (?, ?, ?)`,
    [rst.id, conText, new Date().getTime()]
  )
  return returnCode(ctx, 201)
})

// 删除笔记
router.delete('/api/v2/notes/:noteid', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  // 验证通过
  let res = await DB.query(`delete from notes where id = ? and userid = ?`, [
    Number.parseInt(ctx.params.noteid),
    rst.id
  ])
  return returnCode(ctx, 204)
})

// 修改笔记
router.patch('/api/v2/notes/:noteid/:field', async (ctx, next) => {
  // 只允许修改这些字段
  if (!['content', 'tag'].includes(ctx.params.field)) {
    return returnCode(ctx, 403)
  }
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  // 验证通过
  let res = await DB.query(
    `update notes set ${ctx.params.field} = ?, time = ? where id = ? and userid = ?`,
    [
      ctx.request.body[ctx.params.field],
      new Date().getTime().toString(),
      Number.parseInt(ctx.params.noteid),
      rst.id
    ]
  )
  return returnCode(ctx, 200)
})

// 修改密码和邮箱时，向邮箱发送验证码
router.get('/api/v2/user/profile/verification', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  // 发信
  const verification = await sendVerifyCode(ctx, rst.email)
  // 如果发信成功
  if (verification !== 'error') {
    // 将验证码存入数据库
    DB.query(`update users set verify = ?, verifytime = ? where id = ?`, [
      verification,
      (new Date().getTime() + 10 * 60 * 1000).toString(),
      rst.id
    ])
    // 返回请求结果
    return returnCode(ctx, 200)
  }
})

// 核对验证码
router.post('/api/v2/user/profile/verification', async (ctx, next) => {
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  const code = ctx.request.body.verify.toUpperCase()
  if (!code) {
    // 没有验证码
    return returnCode(ctx, 400)
  }
  // 取出数据库里的验证码
  let res = await DB.query(
    `select verifytime from users where id = ? and verify = ?`,
    [rst.id, code]
  )
  res = JSON.parse(JSON.stringify(res))
  if (!res.length > 0) {
    return returnCode(ctx, 400)
  } else {
    res = res[0]
    // 检查验证码是否正确，是否一致
    const notExpired = parseInt(res.verifytime) > new Date().getTime()
    if (notExpired) {
      // 成功之后，清空验证码，并将成功状态保存在 verifytime 里。
      DB.query(`update users set verify = null, verifytime = 1 where id = ?`, [
        rst.id
      ])
      returnCode(ctx, 200)
    } else {
      return returnCode(ctx, 403)
    }
  }
})

// 修改用户配置
router.patch('/api/v2/user/profile/:field', async (ctx, next) => {
  // 只允许修改这些字段
  if (!['pwd', 'avatar', 'email'].includes(ctx.params.field)) {
    return returnCode(ctx, 403)
  }
  let rst = await checkToken(ctx)
  if (!rst) {
    return false
  }
  // 验证通过
  if (ctx.params.field === 'avatar') {
    await updateAvatar(ctx, ctx.request.body.data, rst)
  } else if (ctx.params.field === 'email') {
    await updateEmail(ctx, ctx.request.body.data, rst)
  } else if (ctx.params.field === 'pwd') {
    await updatePwd(ctx, ctx.request.body.data, rst)
  }
})

// 更新头像
async function updateAvatar(ctx, imgData, token) {
  // imgData 是图片的 base64 的 dataurl
  // 过滤data:URL 标记
  const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '')
  const dataBuffer = Buffer.from(base64Data, 'base64')
  const imgName = new Date().getTime().toString() + '.jpg'
  const filePath = path.resolve(__dirname, cfg.avatarDir, imgName)
  fs.writeFile(filePath, dataBuffer, function(err) {
    if (err) {
      console.log(err)
    }
  })
  // 删除旧的头像
  let originData = await DB.query(`select * from users where id = ?`, [
    token.id
  ])
  originData = JSON.parse(JSON.stringify(originData))
  originData = originData[0]
  if (originData.avatar) {
    const oldFile = path.resolve(
      __dirname,
      cfg.avatarDir,
      originData.avatar
    )
    fs.access(oldFile, (err) => {
      if (!err) {
        fs.unlink(oldFile, (err) => {
          if (err) {
            console.log(err)
          }
        })
      }
    })
  }
  // 保存新头像的文件名
  DB.query(`update users set avatar = ? where id = ?`, [imgName, token.id])
  // 返回新的用户信息
  originData.avatar = imgName
  returnUserinfo(ctx, originData, false)
}

// 更新邮箱
async function updateEmail(ctx, email, token) {
  let check = await checkCode(token.id)
  if (check) {
    await DB.query(
      `update users set email = ?, verifytime = null where id = ?`,
      [email, token.id]
    )
    // 返回新的用户信息
    res = await DB.query(`select * from users where id = ?`, [token.id])
    res = JSON.parse(JSON.stringify(res))
    res = res[0]
    returnUserinfo(ctx, res, false)
  }
}

// 更新密码
async function updatePwd(ctx, pwd, token) {
  let check = await checkCode(token.id)
  if (check) {
    let hash = getHash(pwd)
    await DB.query(`update users set pwd = ?, verifytime = null where id = ?`, [
      hash,
      token.id
    ])
    // 修改密码并不需要返回新的用户信息，所以这里返回 token 里原有的信息即可
    returnUserinfo(ctx, token, false)
  }
}

// 重设密码前查找用户
router.get('/api/v2/user/profile/found/:user', async (ctx, next) => {
  // 查找用户
  let res = await DB.query(`select * from users where name = ?;`, [
    ctx.params.user
  ])
  res = JSON.parse(JSON.stringify(res))
  if (res.length > 0) {
    res = res[0]
    // 发信
    const verification = await sendVerifyCode(ctx, res.email, 32)
    // 如果发信成功
    if (verification !== 'error') {
      // 将验证码存入数据库
      DB.query(`update users set verify = ?, verifytime = ? where name = ?`, [
        verification,
        (new Date().getTime() + 10 * 60 * 1000).toString(),
        ctx.params.user
      ])
      // 返回请求结果
      return returnCode(ctx, 200)
    }
  } else {
    return returnCode(ctx, 404)
  }
})

// 重设密码
router.post('/api/v2/user/profile/pwd', async (ctx, next) => {
  const body = ctx.request.body
  // 根据条件查询验证码时间
  let res = await DB.query(
    `select verifytime from users where name = ? and verify = ?`,
    [body.user, body.verifyCode]
  )
  res = JSON.parse(JSON.stringify(res))
  // 如果查询不到
  if (!res.length > 0) {
    return returnCode(ctx, 400)
  } else {
    // 查询到则检查过期时间
    res = res[0]
    const notExpired = parseInt(res.verifytime) > new Date().getTime()
    if (notExpired) {
      // 没有过期则重置密码，清空验证码
      let hash = getHash(body.pwd)
      await DB.query(
        `update users set pwd = ?, verify = null, verifytime = null where name = ?`,
        [hash, body.user]
      )
      return returnCode(ctx, 200)
    } else {
      return returnCode(ctx, 403)
    }
  }
})

// listen 要放到最后
app.listen(3000)

console.log('koa start')
