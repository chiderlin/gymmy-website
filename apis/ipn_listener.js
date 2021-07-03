const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async(req,res)=>{
    // 1. 200 response
    console.log('It works! 😀');
    res.status(200).send('OK');
    res.end();

    // 2. post same ipn mag back
    const body = req.body || {};
    try {
        const isValidated = await validate(body);
        if(!isValidated){
            console.error('Error validating IPN message.');
            return;
        }

        // IPN msg is validated
        const transactionType = body.txn_type;
        switch(transactionType) {
            case 'web_accept':
                console.log('web_accept', web_accept);
                break;
            case 'subscr_payment':
                const status = body.payment_status;
                const amount = body.mc_gross;
                console.log('subscr_payments',status)
                break;
            case 'subscr_signup':
                // const subscr_date = body.subscr_date
                // console.log(subscr_date);
                break;
            case 'subscr_cancel':
                break;
            case 'subscr_eot':
                break;
            case 'recurring_payment_suspended':
                break;
            case 'recurring_payment_suspended_due_to_max_failed_payment':
                break;
            default:
                console.log('Unhandled transaction type: ', transactionType)
        };

    } catch(e) {
        console.error(e);
    };
});

function validate(body={}){
    return new Promise((resolve, reject)=>{

        let postreq = 'cmd=_notify-validate'
        Object.keys(body).map((key) => {
            postreq = `${postreq}&${key}=${body[key]}`;
            return key;
          });

        const url = 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr';

        axios.post(url, postreq, {
            headers:{
                'Content-Length': postreq.length,
            },
        }).then((result)=>{
            console.log(result.status);
            console.log(result.data);
            if(result.data.substring(0,8) === 'VERIFIED') {
                console.log('VERIFIED');
                resolve(true);
            } else if (result.substring(0,7) === 'INVALID') {
                console.log('INVALID');
                reject(new Error('IPN Message is invalid.'));
            } else {
                reject(new Error('Unexpected response body.'));
            }
        }).catch((error)=>{
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        })
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
        //     console.log(result.data);
        //     if(result.data.substring(0,8) === 'VERIFIED') {
        //         resolve(true);
        //     } else if (result.substring(0,7) === 'INVALID') {
        //         reject(new Error('IPN Message is invalid.'));
        //     } else {
        //         reject(new Error('Unexpected response body.'));
        //     }
        // }).catch((err)=>{
        //     console.log('err:',err);
        //     reject(new Error(err))
        // });
    })
}

module.exports = router;
