const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db_module.js');
const User = db.User;
const insert_data = db.insert_data;
const check_data = db.user_check_data;


// CHECK STATUS
router.get('/user', (req, res) => {
    // console.log(req.session.email)
    if (req.session.email === undefined) {
        return res.json({ 'data': null });
    } else {
        // 查詢db比對
        try {
            check_data(User, req.session.email, (data) => {
                data = JSON.parse(data);
                const id = data.id;
                const name = data.name;
                const email = data.email;
                const auth = data.auth;
                const mem_info = {
                    'data': {
                        'id': id,
                        'name': name,
                        'email': email,
                        'auth': auth,
                    }
                }
                return res.json(mem_info);
            })
        } catch (e) {
            e = e.toString();
            return res.status(500).json({ 'error': true, 'message': e });
        }
    }
});

// REGISTER 
router.post('/user', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    try {
        const hashPwd = await bcrypt.hash(req.body.pwd, 10)
        check_data(User, email, (data) => {
            data = JSON.parse(data);
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
        check_data(User, email, (data) => {
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
    } catch (e) {
        e = e.toString();
        return res.status(500).json({ 'error': true, 'message': e });
    }
});


// LOGOUT
router.delete('/user', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            throw err;
        } else {
            res.clearCookie('sessionId');
            return res.json({ 'ok': true });
        }
    })
});

module.exports = router;