const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db_module.js');
const Payment = db.Payment;
const User = db.User;
const insert_data = db.insert_data;
const get_data = db.user_check_data;
const get_id_data = db.get_id_data;

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
            // inert db
            get_data(User,req.session.email, (find_data)=>{
                find_data = JSON.parse(find_data);
                const userId = find_data.id;
                insert_data(Payment, {
                    UserId: userId,
                    card_key: card_key,
                    card_token: card_token,
                },(ok)=>{
                    return res.json({'ok':true});
                })
            })
        }
    })
})

// 所謂定期定額扣款，在tappay就是用token pay，定期呼叫來做付款   那符合嗎？？
router.post('/pay-by-token',(req,res)=>{
    get_id_data(User, '9', (data)=>{
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
    });
    // 怎麼呼叫測試？？？ postman...
    return res.send('ok');
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
    })
};


module.exports = router;