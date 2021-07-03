const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/',(req,res)=>{
    // 1. 200 response
    console.log('It works! 😀');
    res.status(200).send('OK');
    res.end();

    // 2.
    // const body = req.body || {};
    // let postreq = 'cmd=_notify-validate';
    // Object.keys(body).map((key)=>{
    //     postreq = `${postreq}&${key}=${body[key]}`;
    //     return key;
    // })

    // const url = 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr';

    // axios({
    //     method: "POST",
    //     url:url,
    //     headers: {
    //         'Content-Length': postreq.length,
    //     },
    //     encoding: 'utf-8',
    //     body: postreq
    // }).then((result)=>{
    //     console.log(result.status)
    //     console.log(result);
    //     if(result.substring(0,8) === 'VERIFIED') {
            
    //     }
    // }).catch((err)=>{
    //     console.log('err:',err);
    // });



})

module.exports = router;
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