const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db_module.js');
const User = db.User;
const insert_data = db.insert_data;
const check_data = db.user_check_data;
;

router.get('/user',(req,res)=>{

});

// REGISTER 
router.post('/user', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    try {
        const hashPwd = await bcrypt.hash(req.body.pwd, 10)
        check_data(User, email, (data) => {
            if (data === null) {
                insert_data(User, {
                    name: name,
                    email: email,
                    password: hashPwd,
                    phone: phone,
                    auth: 2,
                }, (ok) => {
                    return res.json({ 'ok': true });
                });
            } else {
                return res.status(400).json({ 'error': true, 'message': '此帳號已註冊過' });
            }
        });
    } catch (e) {
        return res.status(500).json({ 'error': true, 'message': e });
    }
});

// login
router.patch('/user',(req,res)=>{
    console.log(req.body);
    const email = req.body.email;
    const pwd = req.body.password;
    
    // 確認db有這個資料
    // 比對帳號 跟 解密後的密碼
    // 通過
    // 帳號或密碼錯誤
    // 此帳號無註冊過
});


// logout
router.delete('/user',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) {
            throw err;
        } else {
            res.clearCookie('sessionId');
            return res.json({'ok': true});
        }
    })
});

module.exports = router;