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
  secure: true, // true for 465, false for other ports
  auth: {
    user: '1247756698@qq.com', // generated ethereal user
    pass: 'hwekroclgqvahebc' // generated ethereal password
  }
}

exports.siteUrl = siteUrl
exports.serect = serect
exports.avatarDir = avatarDir
exports.DBConfig = DBConfig
exports.mailConfig = mailConfig
