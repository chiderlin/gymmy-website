const request = require('request');
const options = {
    'method': 'POST',
    'uri': 'https://api-m.sandbox.paypal.com/v1/billing/plans',
    'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer A21AAJ6UOaCkD6oAXpJhftwjcvnWCCzgosn8D6euMqDuwj33UBUHADwR4YFwaBBNfYjDiwAC1BJbT663WZwvH-qKSBwPBKU_Q',
    },
    body: JSON.stringify({
        'product_id': 'gymmy-product-001',
        'name': 'gymmy getting started plan',
        'description': 'gym service basic plan',
        'billing_cycles': [
            {
                "frequency": {
                    "interval_unit": "DAY",
                    "interval_count": 1
                },
                "tenure_type": "REGULAR",
                "sequence": 1,
                "total_cycles": 12,
                "pricing_scheme": {
                    "fixed_price": {
                        "value": "888",
                        "currency_code": "TWD"
                    }
                }
            }
        ],
        'payment_preferences': {
            "auto_bill_outstanding": true,
            "setup_fee_failure_action": "CONTINUE",
            "payment_failure_threshold": 3
        },
    })
}

request(options,(err,res, body)=>{
    if(err) throw new Error(err);
    console.log(res.statusCode)
    console.log(body);
})