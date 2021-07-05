const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db_module.js');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const Payment = db.Payment;
const User = db.User;



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
                pay_by_prime(prime, plan, phone, name,email,userId);
                
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
router.get('/paypal', (req,res)=>{

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
                        type: 'paypal',
                    }).then((ok) => {
                        // 執行成功印出
                        return res.json({'ok':true});
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

function pay_by_prime(prime, plan, phone, name,email,userId){
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
            
            // insert data
            const currentDate = new Date(); // 下期付款日
            sequelize.sync().then(() => {
                Payment.create({
                    UserId: userId,
                    card_key: card_key,
                    card_token: card_token,
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
                    
                    return res.json({'ok':true});
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