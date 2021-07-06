const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db_module.js');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const Payment = db.Payment;
const User = db.User;

// order資料
router.get('/order',(req,res)=>{
    if(req.session.email) {
        const number = req.query.number;
        console.log(number)
        sequelize.sync().then(()=>{
            User.findOne({
                where:{
                    email: req.session.email,
                },
                include: Payment,
            }).then((result)=>{
                return JSON.stringify(result, null, 4);
            }).then((find_data)=>{
                find_data = JSON.parse(find_data);
                console.log(find_data)
                if(find_data.Payment.type === "tappay") {
                    let return_data = {
                        'data':{
                            'name':find_data.name,
                            'email': find_data.email,
                            'plan': find_data.plan,
                            'payment': {
                                'id': find_data.Payment.id,
                                'bank_transaction_id':find_data.Payment.bank_transaction_id,
                                'next_pay_date': find_data.Payment.next_pay_date,
                                'rec_trade_id': find_data.Payment.rec_trade_id,
                                'type': find_data.Payment.type,
                            }
                        }
                    }
                    return res.json(return_data)
                } else if(find_data.Payment.type === "paypal"){
                    const created_date = find_data.Payment.createdAt
                    let created_date_localtime = new Date(created_date).toLocaleString('chinese',{hour12: false});
                    let return_data = {
                        'data':{
                            'name':find_data.name,
                            'email': find_data.email,
                            'plan': find_data.plan,
                            'payment':{
                                'id': find_data.Payment.id,
                                'subscriptionId':find_data.Payment.subscriptionId,
                                'next_pay_date': find_data.Payment.next_pay_date,
                                'created_date': created_date_localtime,
                                'type': find_data.Payment.type,
                            }
                        }
                    }
                    return res.json(return_data);
                }
            }).catch((e)=>{
                e = e.toString();
                return res.status(500).json({ 'error': true, 'message': e });
            });
        })

    } else {
        return res.status(400).json({'error': true, 'message': '尚未登入系統'})
    }


    
});

// 取得Prime => 付款
router.post('/pay-by-prime',(req,res)=>{
    // find data
    sequelize.sync().then(() => {
        User.findOne({ // 註冊過
            where: {
                email: req.session.email,
            },
            include: Payment
        }).then((result) => {
            return JSON.stringify(result, null, 4);
        }).then((find_data)=>{
            console.log(find_data);
            find_data = JSON.parse(find_data);
            const userId = find_data.id;

            if(find_data.Payment === null) { // 還沒付款才可以付款
                const prime = req.body.prime;
                const plan = req.body.info.plan;
                const phone = req.body.info.phone;
                const name = req.body.info.name;
                const email = req.body.info.email;
                pay_by_prime(prime, plan, phone, name,email,userId, (data)=>{
                    const bank_transaction_id = data
                    return res.json({'ok':true, 'message':bank_transaction_id})
                });
                return res.json({'ok':true,'message':bank_transaction_id});
            } else {
                return res.status(400).json({'error': true, 'message': '已完成付款手續'})
            }
        });
    }).catch((e)=>{
        e = e.toString();
        return res.status(500).json({'error': true, message: e})
    })
    
})

// paypal付款 => 自己存db
// 1.先確認是不是註冊過
// 2.建立payment資料
// 3.更新user active狀態 
router.post('/paypal', (req,res)=>{
    const sub_id = req.body.sub_id;
    sequelize.sync().then(() => {
        User.findOne({ 
            where: {
                email: req.session.email,
            },
            include: Payment
        }).then((result) => {
            return JSON.stringify(result, null, 4);
        }).then((find_data)=>{
            console.log(find_data);
            find_data = JSON.parse(find_data);
            const userId = find_data.id;
            if(find_data.Payment === null) { // 還沒付款才可以寫入資料庫
                sequelize.sync().then(() => {
                    Payment.create({
                        UserId: userId,
                        subscriptionId:sub_id,
                        type: 'paypal',
                    }).then((ok) => {
                        // 執行成功印出
                        return res.json({'ok':true, 'message': sub_id});
                    })
                    sequelize.sync().then(() => {
                        User.findOne({
                            where: {
                                id: userId,
                            }
                        }).then((user)=>{
                            user.update({
                                active: 'yes',
                            })
                        }).then(()=>{
                            console.log('update done')
                        })
                    })
                }).catch((e)=>{
                    e = e.toString();
                    return res.status(500).json({'error': true, message: e})
                })   
            }
        })
    })
});

function pay_by_prime(prime, plan, phone, name,email,userId, callback){
    const post_data = {
        'prime': prime,
        'partner_key':'partner_PyJKIbMCqgsYpYiouacHI67J0jT0xOdGBGSO9e05OdiB1RHhYSDdjioD',
        'merchant_id':'chi_CTBC',
        'amount': plan,
        'details': 'gym service',
        'cardholder': {
            'phone_number': phone,
            'name': name,
            'email': email
        }, // 裡面一定要有phone_number, name, email 
        'remember': true,
    }
    const url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
    axios.post(url, post_data, {
        headers: {
            'x-api-key': 'partner_PyJKIbMCqgsYpYiouacHI67J0jT0xOdGBGSO9e05OdiB1RHhYSDdjioD',
            'Content-Type': 'application/json',
        },
    }).then((result)=>{
        console.log(result.data);
        const data = result.data;
        if(data.status === 0) {
            // 1.付款成功，寫入Payments資料庫
            // 2.更新user active 狀態
            const card_key = data.card_secret.card_key;
            const card_token = data.card_secret.card_token;
            const bank_transaction_id = data.bank_transaction_id;
            const rec_trade_id = data.rec_trade_id //如果要辦理退款需要提供的id
            // insert data
            const currentDate = new Date(); // 下期付款日
            sequelize.sync().then(() => {
                Payment.create({
                    UserId: userId,
                    card_key: card_key,
                    card_token: card_token,
                    rec_trade_id: rec_trade_id,
                    bank_transaction_id: bank_transaction_id,
                    next_pay_date: currentDate.setMonth(currentDate.getMonth()+1),
                    type: 'tappay',
                }).then((ok) => {
                    // 執行成功印出
                    sequelize.sync().then(() => {
                        User.findOne({
                            where: {
                                id: userId,
                            }
                        }).then((user)=>{
                            user.update({
                                active: 'yes',
                            })
                        }).then(()=>{
                            console.log('update done')
                        })
                    })

                    return callback(bank_transaction_id)
                })
            }).catch((e)=>{
                e = e.toString();
                return res.status(500).json({'error': true, message: e})
            })

        } else {
            return res.status(400).json({'error':true, 'message': '付款失敗'})
        }
    }).catch((e)=>{
        e = e.toString();
        return res.status(500).json({'error': true, message: e})
    }) 
};




// 所謂定期定額扣款，在tappay就是用token pay，定期呼叫來做付款
// router.post('/pay-by-token',(req,res)=>{

//     sequelize.sync().then(() => {
//         User.findOne({
//             where: {
//                 email: req.session.email,
//             },
//             include: Payment
//         }).then((res) => {
//             return JSON.stringify(res, null, 4);
//         }).then((data)=>{
//             data = JSON.parse(data);
//             console.log(data);
//             const card_key = data.Payment.card_key;
//             const card_token = data.Payment.card_token;
//             const post_data = {
//                 'card_key':card_key,
//                 'card_token':card_token,
//                 'partner_key': 'partner_PyJKIbMCqgsYpYiouacHI67J0jT0xOdGBGSO9e05OdiB1RHhYSDdjioD',
//                 'merchant_id': 'chi_CTBC',
//                 'currency': 'TWD',
//                 'amount': '888',
//                 'details': 'pay gym service monthly',
//             }
//             payByToken(post_data);
//             return res.send('ok');

//         })
//     }).catch((err)=>{
//         console.log(err);
//     }) 
// });

// function payByToken(post_data){
//     const url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-token'
//     axios.post(url, post_data, {
//         headers:{
//             'Content-Type':'application/json',
//             'x-api-key': post_data.partner_key
//         },
//     }).then((result)=>{
//         console.log(result.data);
//         const data = result.data;
//         if(data.status === 0) { //付款成功
//             const transaction_id = data.bank_transaction_id;
//             const amount = data.amount;
//             const currency = data.currency;
//         }
//     })
// };


module.exports = router;