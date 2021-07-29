const nodemailer = require('nodemailer')
const express = require('express');
const router = express.Router()

router.post('/mail', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const msg = req.body.msg

    if (!name) {
        return res.json({ error: true, message: 'name格式錯誤' });
    }
    if (!email) {
        return res.json({ error: true, message: 'email格式錯誤' });
    }
    if (!msg) {
        return res.json({ error: true, message: 'msg格式錯誤' });
    }
    const mail = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PWD,
        }
    })

    const options = {
        from: process.env.GMAIL,
        to: process.env.GMAIL,
        subject: '系統來信：客服詢問',
        html: `
        <h2>姓名: ${name}</h2>
        <h2>email: ${email}</h2>
        <h2>訊息: ${msg}</h2>
        `
    }
    mail.sendMail(options, (err, info) => {
        if (err) {
            console.log(err)
            return res.json({ error: true, message: '信件寄送失敗' });
        } else {
            console.log('訊息發送：', info.response)
            return res.json({ ok: true });
        }
    })

});


module.exports = router;