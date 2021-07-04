const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db_module.js');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const User = db.User;


// CHECK STATUS
router.get('/user', (req, res) => {
    // console.log(req.session.email)
    if (req.session.email === undefined) {
        return res.json({ 'data': null });
    } else {
        // 查詢db比對
        if (req.session.email === null) {
            return res.json({ 'data': null });
        } else {
            try {
                sequelize.sync().then(() => {
                    User.findOne({
                        where: {
                            email: req.session.email,
                        }
                    }).then((result) => {
                        return JSON.stringify(result, null, 4);
                    }).then((data)=>{
                        data = JSON.parse(data);
                        const id = data.id;
                        const name = data.name;
                        const email = data.email;
                        const price = data.plan;
                        const phone = data.phone;
                        const auth = data.auth;
                        const mem_info = {
                            'data': {
                                'id': id,
                                'name': name,
                                'email': email,
                                'phone': phone,
                                'plan': price,
                                'auth': auth,
                            }
                        }
                        return res.json(mem_info);
                    })
                }).catch((e)=>{
                    e = e.toString();
                    return res.status(500).json({ 'error': true, 'message': e });
                })
            } catch (e) {
                e = e.toString();
                return res.status(500).json({ 'error': true, 'message': e });
            }
        }
    }
});

// REGISTER 
router.post('/user', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const plan = req.body.price;
    try {
        const hashPwd = await bcrypt.hash(req.body.pwd, 10)
        sequelize.sync().then(() => {
            User.findOne({
                where: {
                    email: email,
                }
            }).then((result) => {
                return JSON.stringify(result, null, 4);
            }).then((data)=>{
                data = JSON.parse(data);
                if(data === null) {
                    // insert data
                    sequelize.sync().then(() => {
                        // 在這邊新增資料
                        User.create({
                            name: name,
                            email: email,
                            password: hashPwd,
                            phone: phone,
                            plan: plan,
                            auth: 2,
                        }).then(() => {
                            // 執行成功印出
                            req.session.email = email;
                            return res.json({'ok':true});
                        })
                    }).catch((err)=>{
                        console.log(err);
                    })
                } else {
                    return res.status(400).json({'error': true, 'message': '此帳號已註冊過' });
                }
            })
        }).catch((e)=>{
            e = e.toString();
            return res.status(500).json({ 'error': true, 'message': e });
        })
    } catch (e) {
        e = e.toString();
        return res.status(500).json({ 'error': true, 'message': e });
    }
});

// LOGIN
router.patch('/user', (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const pwd = req.body.password;
    try {
        sequelize.sync().then(() => {
            User.findOne({
                where: {
                    email: email,
                }
            }).then((result) => {
                return JSON.stringify(result, null, 4);
            }).then((data)=>{
                data = JSON.parse(data);
                if (data === null) {
                    return res.status(400).json({ 'error': true, 'message': '帳號或密碼錯誤' });
                } else {
                    const comparePwd = data.password
                    bcrypt.compare(pwd, comparePwd).then((compare) => {
                        // console.log(res); bool
                        if (compare) {
                            req.session.email = email;
                            return res.json({ 'ok': true });
                        } else {
                            return res.status(400).json({ 'error': true, 'message': '帳號或密碼錯誤' });
                        }
                    })
                }
            })
        }).catch((e)=>{
            e = e.toString();
            return res.status(500).json({ 'error': true, 'message': e });
        })
    } catch (e) {
        e = e.toString();
        return res.status(500).json({ 'error': true, 'message': e });
    }
});


// LOGOUT
router.delete('/user', (req, res) => {
    // req.session.email = null;
    // res.clearCookie('sessionId');
    req.session.destroy((err) => {
        if(err){
            throw err;
        } else {
            res.clearCookie('sessionId');
            return res.json({ 'ok': true });
        }
    })
});

module.exports = router;