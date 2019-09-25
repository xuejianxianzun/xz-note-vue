const nodemailer = require('nodemailer')
const cfg = require('./config')
const mailConfig = cfg.mailConfig

async function mail(to, html) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(mailConfig)

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: mailConfig.auth.user, // sender address
    to: to, // list of receivers
    subject: '仙尊笔记账户验证', // Subject line
    html: html // html body
  })
}

module.exports = mail
