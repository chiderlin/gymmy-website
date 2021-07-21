const express = require('express');
const router = express.Router();
const axios = require('axios');
const ipn = require('paypal-ipn');
const request = require('request');

class IPNController {

    static async index(req, res) {
        console.log('It works! 😀');
        res.status(200).send('OK');
        res.end();

        const body = req.body || {};

        // Validate IPN message with PayPal
        try {
            const isValidated = await PayPalService.validate(body);
            if (!isValidated) {
                console.error('Error validating IPN message.');
                return;
            }

            // IPN Message is validated!
            const transactionType = body.txn_type;

            switch (transactionType) {
                case 'web_accept':
                case 'subscr_payment':
                    const status = body.payment_status;
                    const amount = body.mc_gross;
                    console.log('status:',status)
                    // Validate that the status is completed, 
                    // and the amount match your expectaions.
                    break;
                case 'subscr_signup':
                case 'subscr_cancel':
                case 'subscr_eot':
                    // Update user profile
                    break;
                case 'recurring_payment_suspended':
                case 'recurring_payment_suspended_due_to_max_failed_payment':
                    // Contact the user for more details
                    break;
                default:
                    console.log('Unhandled transaction type: ', transactionType);
            }
        } catch (e) {
            console.error(e);
        }
    }
}


router.post('/', IPNController.index);


class PayPalService {
    static validate(body = {}) {
        return new Promise((resolve, reject) => {
            // Prepend 'cmd=_notify-validate' flag to the post string
            let postreq = 'cmd=_notify-validate';

            // Iterate the original request payload object
            // and prepend its keys and values to the post string
            Object.keys(body).map((key) => {
                postreq = `${postreq}&${key}=${body[key]}`;
                return key;
            });
            console.log(postreq);
            const options = {
                url: 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr',
                method: 'POST',
                headers: {
                    'Content-Length': postreq.length,
                },
                encoding: 'utf-8',
                body: postreq
            };

            axios.post(url, postreq, {
                headers:{
                    'Content-Length': postreq.length,
                    'User-Agent': 'Nodejs-IPN-VerificationScript',
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
            // Make a post request to PayPal
            // request(options, (error, response, resBody) => {
            //     console.log(response.statusCode);
            //     if (error || response.statusCode !== 200) { 
            //         reject(new Error(error));
            //         return;
            //     }

            //     // Validate the response from PayPal and resolve / reject the promise.
            //     if (resBody.substring(0, 8) === 'VERIFIED') {
            //         resolve(true);
            //     } else if (resBody.substring(0, 7) === 'INVALID') {
            //         reject(new Error('IPN Message is invalid.'));
            //     } else {
            //         reject(new Error('Unexpected response body.'));
            //     }
            // });
        });
    }

}





//=======================

// router.post('/',(req,res)=>{
//     // 1. 200 response
//     console.log('It works! 😀');
//     res.status(200).send('OK');
//     res.end();

//     // 2. post same ipn mag back
//     const body = req.body;
//     try {
//         validate(body, (bool)=>{
//             console.log(bool);
//             if(!bool){
//                 console.error('Error validating IPN message.');
//                 return;
//             }

//             // IPN msg is validated
//             const transactionType = body.txn_type;
//             switch(transactionType) {
//                 case 'web_accept':
//                     console.log('web_accept', web_accept);
//                     break;
//                 case 'subscr_payment':
//                     const status = body.payment_status;
//                     const amount = body.mc_gross;
//                     console.log('subscr_payments',status)
//                     break;
//                 case 'subscr_signup':
//                     // const subscr_date = body.subscr_date
//                     // console.log(subscr_date);
//                     break;
//                 case 'subscr_cancel':
//                     break;
//                 case 'subscr_eot':
//                     break;
//                 case 'recurring_payment_suspended':
//                     break;
//                 case 'recurring_payment_suspended_due_to_max_failed_payment':
//                     break;
//                 default:
//                     console.log('Unhandled transaction type: ', transactionType)
//             };

//         });

//     } catch(e) {
//         console.error(e);
//     };
// });

// function validate(body, callback){
//     ipn.verify(body,{'allow_sandbox': true}, (err, msg)=>{
//         if(err){
//             return callback(false);
//         }
//         if(body.payment_status == 'Completed') {
//             return callback(true);
//         }
//     })


// return new Promise((resolve, reject)=>{

//     let postreq = 'cmd=_notify-validate'
//     Object.keys(body).map((key) => {
//         postreq = `${postreq}&${key}=${body[key]}`;
//         return key;
//       });

//     const url = 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr';

//     axios.post(url, postreq, {
//         headers:{
//             'Content-type': 'text/plain',
//             'Content-Length': postreq.length,
//             'User-Agent': 'Nodejs-IPN-VerificationScript',
//         },

//     }).then((result)=>{
//         console.log(result.status);
//         console.log(result.data);
//         if(result.data.substring(0,8) === 'VERIFIED') {
//             console.log('VERIFIED');
//             resolve(true);
//         } else if (result.substring(0,7) === 'INVALID') {
//             console.log('INVALID');
//             reject(new Error('IPN Message is invalid.'));
//         } else {
//             reject(new Error('Unexpected response body.'));
//         }
//     }).catch((error)=>{
//         if (error.response) {
//             // Request made and server responded
//             console.log(error.response.data);
//             console.log(error.response.status);
//             console.log(error.response.headers);
//         } else if (error.request) {
//             // The request was made but no response was received
//             console.log(error.request);
//         } else {
//             // Something happened in setting up the request that triggered an Error
//             console.log('Error', error.message);
//         }
//     })

// axios({
//     method: "POST",
//     url:url,
//     headers: {
//         'Content-Length': postreq.length,
//     },
//     body: postreq,
// }).then((result)=>{
//     console.log(result.status)
//     console.log(result.data);
//     if(result.data.substring(0,8) === 'VERIFIED') {
//         console.log('VERIFIED')
//         resolve(true);
//     } else if (result.substring(0,7) === 'INVALID') {
//         console.log('INVALID')
//         reject(new Error('IPN Message is invalid.'));
//     } else {
//         reject(new Error('Unexpected response body.'));
//     }
// }).catch((error)=>{
//     if (error.response) {
//         // Request made and server responded
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//     } else if (error.request) {
//         // The request was made but no response was received
//         console.log(error.request);
//     } else {
//         // Something happened in setting up the request that triggered an Error
//         console.log('Error', error.message);
//     }
//     reject(new Error(error));
// });
// })
// }

module.exports = router;
