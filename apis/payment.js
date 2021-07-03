const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db_module.js');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const Payment = db.Payment;
const User = db.User;



// 取得Prime
router.post('/pay-by-prime',(req,res)=>{
    const post_data = {
        'prime': req.body.prime,
        'partner_key':'partner_PyJKIbMCqgsYpYiouacHI67J0jT0xOdGBGSO9e05OdiB1RHhYSDdjioD',
        'merchant_id':'chi_CTBC',
        'amount': 888,
        'details': 'gym service',
        'cardholder': {
            'phone_number': '0911111111',
            'name': 'test',
            'email': 'test@test.com'
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
            const card_key = data.card_secret.card_key;
            const card_token = data.card_secret.card_token;
            
            // find data
            sequelize.sync().then(() => {
                User.findOne({
                    where: {
                        email: req.session.email,
                    }
                }).then((result) => {
                    return JSON.stringify(result, null, 4);
                }).then((find_data)=>{
                    find_data = JSON.parse(find_data); 
                    const userId = find_data.id;

                    // insert data
                    sequelize.sync().then(() => {
                        // 在這邊新增資料
                        Payment.create({
                            UserId: userId,
                            card_key: card_key,
                            card_token: card_token,
                        }).then((ok) => {

                            // 執行成功印出
                            return res.json({'ok':true});
                        })
                    }).catch((err)=>{
                        console.log(err);
                    })
                });
            }).catch((err)=>{
                console.log(err);
            })
        }
    })
})


// 所謂定期定額扣款，在tappay就是用token pay，定期呼叫來做付款
router.post('/pay-by-token',(req,res)=>{

    sequelize.sync().then(() => {
        User.findOne({
            where: {
                email: req.session.email,
            },
            include: Payment
        }).then((res) => {
            return JSON.stringify(res, null, 4);
        }).then((data)=>{
            data = JSON.parse(data);
            console.log(data);
            const card_key = data.Payment.card_key;
            const card_token = data.Payment.card_token;
            const post_data = {
                'card_key':card_key,
                'card_token':card_token,
                'partner_key': 'partner_PyJKIbMCqgsYpYiouacHI67J0jT0xOdGBGSO9e05OdiB1RHhYSDdjioD',
                'merchant_id': 'chi_CTBC',
                'currency': 'TWD',
                'amount': '888',
                'details': 'pay gym service monthly',
            }
            payByToken(post_data);
            return res.send('ok');

        })
    }).catch((err)=>{
        console.log(err);
    }) 
});

function payByToken(post_data){
    const url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-token'
    axios.post(url, post_data, {
        headers:{
            'Content-Type':'application/json',
            'x-api-key': post_data.partner_key
        },
    }).then((result)=>{
        console.log(result.data);
        const data = result.data;
        if(data.status === 0) { //付款成功
            const transaction_id = data.bank_transaction_id;
            const amount = data.amount;
            const currency = data.currency;
        }
    })
};


module.exports = router;