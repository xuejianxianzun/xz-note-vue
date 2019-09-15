const nodemailer = require('nodemailer')
const mailConfig = require('./mailConfig')

async function mail(to, code) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(mailConfig)

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: mailConfig.auth.user, // sender address
    to: to, // list of receivers
    subject: '仙尊笔记验证码', // Subject line
    html: `我们需要对您的账户进行验证。如果不是您本人操作，请忽略此邮件。<br>验证码: <b>${code}</b><br><br>仙尊笔记` // html body
  })
}

module.exports = mail
