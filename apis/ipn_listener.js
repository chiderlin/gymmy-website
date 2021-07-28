const express = require('express');
const router = express.Router();
const axios = require('axios');
const ipn = require('paypal-ipn');
// const request = require('request');

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
                    let payment_status = body.payment_status;
                    const _amount = body.mc_gross;
                    console.log('status:', payment_status)
                    console.log(_amount);
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
                case 'recurring_payment':
                    const status = body.payment_status;
                    const curreny = body.mc_currency;
                    const amount = body.amount;
                    const next_payment_date = body.next_payment_date;
                    const time_created = body.time_created;
                    console.log(status);
                    console.log(amount);
                    console.log(curreny);
                    let test = new Date(next_payment_date).toLocaleString('chinese', { hour12: false });
                    console.log(next_payment_date);
                    console.log(test);
                    console.log(time_created);
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


            axios.post('https://ipnpb.sandbox.paypal.com/cgi-bin/webscr', postreq, {
                headers: {
                    'Content-Length': postreq.length,
                    'User-Agent': 'Nodejs-IPN-VerificationScript',
                },

            }).then((result) => {
                console.log(result.status);
                console.log(result.data);
                if (result.data.substring(0, 8) === 'VERIFIED') {
                    console.log('VERIFIED');
                    resolve(true);
                } else if (result.substring(0, 7) === 'INVALID') {
                    console.log('INVALID');
                    reject(new Error('IPN Message is invalid.'));
                } else {
                    reject(new Error('Unexpected response body.'));
                }
            }).catch((error) => {
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

            // const options = {
            //     url: 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr',
            //     method: 'POST',
            //     headers: {
            //         'Content-Length': postreq.length,
            //     },
            //     encoding: 'utf-8',
            //     body: postreq
            // };

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


module.exports = router;
