// 前台网站域名
const siteUrl = 'http://localhost:8080'

// JWT 密钥
const serect = 'test-test-test'

// 头像文件的存放目录（相对于 app.js 的位置）
const avatarDir = '../public/avatar/'

// 数据库配置信息
const DBConfig = {
  mysql: {
    host: 'localhost',
    port: 3306,
    database: 'note',
    user: 'root',
    password: 'root'
  }
}

// 邮箱配置
const mailConfig = {
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // 是否启用 ssl
  auth: {
    user: 'xxxx@qq.com', // 发信邮箱用户名
    pass: 'xxxx' // 发信邮箱密码
  }
}

exports.siteUrl = siteUrl
exports.serect = serect
exports.avatarDir = avatarDir
exports.DBConfig = DBConfig
exports.mailConfig = mailConfig
