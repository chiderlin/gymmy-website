const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db_module.js');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const User = db.User;
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '316396796608-q5iv25epumdt98ur8ljs428a2qfsufu6.apps.googleusercontent.com'
// const CLIENT_ID = '316396796608-1hfr0qr4pmpbgll2gh3d8ce2o9ofhjmb.apps.googleusercontent.com' // localhost
const client = new OAuth2Client(CLIENT_ID);


// GET ALL USERS
router.get('/users', (req, res) => {
    if (req.session.email === 'admin@admin') {
        User.findAll()
            .then((result) => {
                return JSON.stringify(result, null, 4);
            })
            .then((api_data) => {
                const user_list = []
                api_data = JSON.parse(api_data);
                for (let i = 0; i < api_data.length; i++) {
                    const active = api_data[i].active;
                    if (active === 'yes') { //沒有開通就不要顯示在後台
                        const userId = api_data[i].id;
                        const name = api_data[i].name;
                        const email = api_data[i].email;
                        const plan = api_data[i].plan;
                        const user_info = {
                            'userId': userId,
                            'name': name,
                            'email': email,
                            'plan': plan,
                            'active': active,
                        }
                        user_list.push(user_info)
                    }
                }
                return res.json({ 'data': user_list });
            })
    }

});



// CHECK STATUS(login check)
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
                    }).then((data) => {
                        console.log(data);
                        data = JSON.parse(data);
                        const id = data.id;
                        const name = data.name;
                        const email = data.email;
                        const price = data.plan;
                        const phone = data.phone;
                        const auth = data.auth;
                        const active = data.active;
                        const mem_info = {
                            'data': {
                                'id': id,
                                'name': name,
                                'email': email,
                                'phone': phone,
                                'plan': price,
                                'auth': auth,
                                'active': active,
                            }
                        }
                        return res.json(mem_info);
                    })
                }).catch((e) => {
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
            }).then((data) => {
                data = JSON.parse(data);
                if (data === null) {
                    // 記錄在session
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
                            active: 'no',
                        }).then(() => {
                            
                            req.session.email = email;
                            return res.json({ 'ok': true });
                        })
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    return res.status(400).json({ 'error': true, 'message': '此帳號已註冊過' });
                }
            })
        }).catch((e) => {
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
        User.findOne({
            where: {
                email: email,
            }
        }).then((result) => {
            return JSON.stringify(result, null, 4);
        }).then((data) => {
            data = JSON.parse(data);
            if (data !== null) {
                const userid = data.id;
                const comparePwd = data.password
                bcrypt.compare(pwd, comparePwd).then((compare) => {
                    // console.log(res); bool
                    if (compare) {
                        req.session.email = email;
                        req.session.userid = userid;
                        return res.json({ 'ok': true });
                    } else {
                        return res.status(400).json({ 'error': true, 'message': '帳號或密碼錯誤' });
                    }
                })

            } else {
                return res.status(400).json({ 'error': true, 'message': '帳號或密碼錯誤' });
            }
        })
        // }).catch((e)=>{
        //     e = e.toString();
        //     return res.status(500).json({ 'error': true, 'message': e });
        // })
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
        if (err) {
            throw err;
        } else {
            res.clearCookie('sessionId');
            res.clearCookie('jwt-token');
            return res.json({ 'ok': true });
        }
    })
});


router.post('/google-login', (req, res) => {
    let token = req.body.id_token;
    // console.log(token);
    let user = {}
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email
    };
    verify()
        .then(() => {

            User.findOne({
                where: {
                    email: user.email,
                }
            }).then((result) => {
                return JSON.stringify(result, null, 4);
            }).then((data) => {
                data = JSON.parse(data);
                if (data === null) {
                    User.create({
                        name: user.name,
                        email: user.email,
                        auth: 2,
                        active: 'no',
                    }).then(() => {
                        req.session.email = user.email;
                        res.cookie('jwt-token', token)
                        return res.json({ 'ok': true });
                    })
                } else {
                    req.session.userid = data.id;
                    req.session.email = user.email;
                    res.cookie('jwt-token', token)
                    return res.json({ 'ok': true });
                }
            })
        }).catch(console.error);
});


router.put('/plan',(req,res)=>{
    const plan = req.body.plan;
    User.findOne({
        where: {
            email: req.session.email,
        }
    }).then((user)=>{
        user.update({
            plan: plan,
        })
    }).then(()=>{
        return res.json({'ok':true});
    }).catch((e)=>{
        e = e.toString();
        return res.json({'error':true, 'message':e});
    })
    
});

router.put('/phone',(req,res)=>{
    const phone = req.body.phone;
    User.findOne({
        where: {
            email: req.session.email,
        }
    }).then((user)=>{
        user.update({
            phone: phone,
        })
    }).then(()=>{
        return res.json({'ok':true});
    }).catch((e)=>{
        e = e.toString();
        return res.json({'error':true, 'message':e});
    })
    
});


module.exports = router;