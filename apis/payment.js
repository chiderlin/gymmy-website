const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db_module.js');
const Payment = db.Payment;
const User = db.User;
const auth = require('../middleware/auth.js')

// 第一次付款，thankyou頁面的編號
router.get('/payment', auth, (req, res) => {
    const email = req.user.email
    if (email) { //req.session.email
        User.findOne({
            where: {
                email: email,
            },
            include: Payment,
        }).then((result) => {
            return JSON.stringify(result, null, 4);
        }).then((find_data) => {
            find_data = JSON.parse(find_data);

            if (find_data.Payment.type === "tappay") {
                let return_data = {
                    'data': {
                        'name': find_data.name,
                        'email': find_data.email,
                        'plan': find_data.plan,
                        'payment': {
                            'id': find_data.Payment.id,
                            'bank_transaction_id': find_data.Payment.bank_transaction_id,
                            'next_pay_date': find_data.Payment.next_pay_date,
                            'rec_trade_id': find_data.Payment.rec_trade_id,
                            'type': find_data.Payment.type,
                        }
                    }
                }
                return res.json(return_data)
            } else if (find_data.Payment.type === "paypal") {
                const created_date = find_data.Payment.createdAt
                let created_date_localtime = new Date(created_date).toLocaleString('chinese', { hour12: false });
                let return_data = {
                    'data': {
                        'name': find_data.name,
                        'email': find_data.email,
                        'plan': find_data.plan,
                        'payment': {
                            'id': find_data.Payment.id,
                            'subscriptionId': find_data.Payment.subscriptionId,
                            'next_pay_date': find_data.Payment.next_pay_date,
                            'created_date': created_date_localtime,
                            'type': find_data.Payment.type,
                        }
                    }
                }
                return res.json(return_data);
            }
        }).catch((e) => {
            e = e.toString();
            return res.status(500).json({ error: true, message: e });
        });
    } else {
        return res.status(400).json({ error: true, message: '尚未登入系統' })
    }
});

// 取得Prime => 付款
router.post('/payment/pay-by-prime', auth, (req, res) => {
    const email = req.user.email
    // find data
    User.findOne({ // 註冊過
        where: {
            email: email,
        },
        include: Payment
    }).then((result) => {
        return JSON.stringify(result, null, 4);
    }).then((find_data) => {

        find_data = JSON.parse(find_data);
        const userId = find_data.id;

        if (find_data.Payment === null) { // 還沒付款才可以付款
            const prime = req.body.prime;
            const plan = req.body.info.plan;
            const phone = req.body.info.phone;
            const name = req.body.info.name;
            const email = req.body.info.email;
            const payload = {
                prime:prime,
                plan:plan,
                phone:phone,
                name:name,
                email:email
            }
            pay_by_prime(payload, (data) => {
                const bank_transaction_id = data
                return res.json({ ok: true, message: bank_transaction_id })
            });
            return res.json({ ok: true, message: bank_transaction_id });
        } else {
            return res.status(400).json({ error: true, message: '已完成付款手續' })
        }
    });
})

// paypal付款 => 自己存db
// 1.先確認是不是註冊過
// 2.建立payment資料
// 3.更新user active狀態 
router.post('/payment/paypal', auth, (req, res) => {
    const sub_id = req.body.sub_id;
    const email = req.user.email
    User.findOne({
        where: {
            email: email,
        },
        include: Payment
    }).then((result) => {
        return JSON.stringify(result, null, 4);
    }).then((find_data) => {
        console.log(find_data);
        find_data = JSON.parse(find_data);
        const userId = find_data.id;
        if (find_data.Payment === null) { // 還沒付款才可以寫入資料庫

            Payment.create({
                UserId: userId,
                subscriptionId: sub_id,
                type: 'paypal',
            }).then((ok) => {
                // 執行成功印出
                return res.json({ ok: true, message: sub_id });
            })

            User.findOne({
                where: {
                    id: userId,
                }
            }).then((user) => {
                user.update({
                    active: 'yes',
                })
            }).then(() => {
                console.log('update done')
            })
        }
    })
});

function pay_by_prime(payload, callback) {
    const post_data = {
        'prime': payload.prime,
        'partner_key': 'partner_PyJKIbMCqgsYpYiouacHI67J0jT0xOdGBGSO9e05OdiB1RHhYSDdjioD',
        'merchant_id': 'chi_CTBC',
        'amount': payload.plan,
        'details': 'gym service',
        'cardholder': {
            'phone_number': payload.phone,
            'name': payload.name,
            'email': payload.email
        }, // 裡面一定要有phone_number, name, email 
        'remember': true,
    }
    const url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
    axios.post(url, post_data, {
        headers: {
            'x-api-key': 'partner_PyJKIbMCqgsYpYiouacHI67J0jT0xOdGBGSO9e05OdiB1RHhYSDdjioD',
            'Content-Type': 'application/json',
        },
    }).then((result) => {
        console.log(result.data);
        const data = result.data;
        if (data.status === 0) {
            // 1.付款成功，寫入Payments資料庫
            // 2.更新user active 狀態
            const card_key = data.card_secret.card_key;
            const card_token = data.card_secret.card_token;
            const bank_transaction_id = data.bank_transaction_id;
            const rec_trade_id = data.rec_trade_id //如果要辦理退款需要提供的id
            // insert data
            const currentDate = new Date(); // 下期付款日
            Payment.create({
                UserId: userId,
                card_key: card_key,
                card_token: card_token,
                rec_trade_id: rec_trade_id,
                bank_transaction_id: bank_transaction_id,
                next_pay_date: currentDate.setMonth(currentDate.getMonth() + 1),
                type: 'tappay',
            }).then((ok) => {
                // 執行成功印出
                User.findOne({
                    where: {
                        id: userId,
                    }
                }).then((user) => {
                    user.update({
                        active: 'yes',
                    })
                }).then(() => {
                    console.log('update done')
                })
                return callback(bank_transaction_id)
            })
        } else {
            return res.status(400).json({ error: true, message: '付款失敗' })
        }
    }).catch((e) => {
        e = e.toString();
        return res.status(500).json({ error: true, message: e })
    })
};



module.exports = router;