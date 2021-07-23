let register_user;
init()

function init(){
    getUser();
}

// controller
const small_tappay_radio = document.getElementById('small-tappay-radio');
const small_paypal_radio = document.getElementById('small-paypal-radio');
const small_tappay = document.getElementById('small-tappay');
const small_paypal = document.getElementById('small-paypal');
small_tappay_radio.addEventListener('click', ()=>{
    small_paypal.style.display = 'none';
    small_tappay.style.display = 'block';
})

small_paypal_radio.addEventListener('click', ()=>{
    small_tappay.style.display = 'none';
    small_paypal.style.display = 'block';
})

const big_tappay_radio = document.getElementById('big-tappay-radio');
const big_paypal_radio = document.getElementById('big-paypal-radio');
const big_tappay = document.getElementById('big-tappay');
const big_paypal = document.getElementById('big-paypal');
const payment_format = document.querySelector('.payment-format');

big_tappay_radio.addEventListener('click', ()=>{
    payment_format.style.width = '0';
    big_paypal.style.display = 'none';
    big_tappay.style.display = 'block';
})

big_paypal_radio.addEventListener('click', ()=>{
    big_tappay.style.display = 'none';
    payment_format.style.width = '50%';
    big_paypal.style.display = 'block';
})

// 預設打開信用卡...
if(big_tappay_radio.checked === true) {
    payment_format.style.width = '0';
    big_paypal.style.display = 'none';
    big_tappay.style.display = 'block';
}

// 串接tappay金流 => 付款
big_tappay.addEventListener('submit', (event)=>{
    event.preventDefault();
    TPDirect.card.getPrime((res)=>{
        console.log(res);
        if(res.status !== 0){
            // render錯誤訊息
            console.log(res.status);
            return;
        }
        const phone_big = document.getElementById('phone-big').value;
        const prime = res.card.prime;
        console.log(register_user)
        if(register_user !== null) {
            uploadPhone(phone_big, (res)=>{
                sendPrime(prime,phone_big);
            });

        }
    })
})

small_tappay.addEventListener('submit', (event)=>{
    event.preventDefault();
    TPDirect.card.getPrime((res)=>{
        if(res.status !== 0){
            // render錯誤訊息
            console.log(res.status);
            return;
        }
        const phone_small = document.getElementById('phone-small').value;
        const prime = res.card.prime;
        if(register_user !== null) {
            uploadPhone(phone_small, (res)=>{
                sendPrime(prime,phone_small);
            });
        }
    })
})




// 根據plan不同，paypal顯示的plan也不同
function switch_paypal_btn(){
    // 大
    const paypal_big_888 = document.getElementById('paypal-button-container-P-888');
    const paypal_big_1000 = document.getElementById('paypal-button-container-P-1000');
    
    // 小
    const paypal_small_888 = document.getElementById('small-paypal-btn-888');
    const paypal_small_1000 = document.getElementById('small-paypal-btn-1000');
    if(register_user !== null) {
        if(register_user.plan === 888) {
            paypal_big_1000.style.display = 'none';
            paypal_small_1000.style.display = 'none';

        } else if(register_user.plan === 1000) {
            paypal_big_888.style.display = 'none';
            paypal_small_888.style.display = 'none';
        }
    }

}


// model
function getUser(){
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        register_user = api_data.data;
        switch_paypal_btn();
    })
}

function uploadPhone(phone,cb){
    const url = '/api/user/phone';
    const phone_info = {'phone':phone};
    fetch(url,{
        method:"PUT",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(phone_info)
    }).then((res)=>{
        return res.json()
    }).then((data)=>{
        if(data.ok === true){
            return cb(data)
        }
    })
}

function sendPrime(prime, phone){
    register_user.phone = phone // 一開始phone是null，改上填好的
    const prime_data = {'prime':prime, 'info':register_user}
    console.log(prime_data);
    const url = '/api/payment/pay-by-prime';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify(prime_data),
    }).then((res)=>{
        return res.json();
    }).then((data)=>{
        if(data.ok === true){
            window.location.href = '/thankyou'
        }
    }) 
};

function paypal_paid(subscriptionID){
    const url = '/api/payment/paypal'
    const sub_id = {'sub_id': subscriptionID}
    fetch(url,{
        method: "POST",
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify(sub_id)
    }).then((res)=>{
        return res.json()
    }).then((data)=>{
        console.log(data);
        window.location.href = '/thankyou';
        // logOut_pay(); //不確定需不需要
    })
}

// 金流
// paypal 大
// 888
paypal.Buttons({
    style: {
        shape: 'pill',
        color: 'silver',
        layout: 'horizontal',
        label: 'paypal'
    },
    createSubscription: function(data, actions) {
      return actions.subscription.create({
        /* Creates the subscription */
        plan_id: 'P-80U28316D6581411WMDOBS6Y',
      });
    },
    onApprove: function(data, actions) {
        //TODO: 呼叫/paypal
        const url = '/api/payment/paypal'
        const userId = {'id':register_user.id};
        paypal_paid(data.subscriptionID)
    //   alert(data.subscriptionID); // You can add optional success message for the subscriber here
    }
}).render('#paypal-button-container-P-888'); // Renders the PayPal button

// 1000
paypal.Buttons({
    style: {
        shape: 'pill',
        color: 'silver',
        layout: 'horizontal',
        label: 'paypal'
    },
    createSubscription: function(data, actions) {
      return actions.subscription.create({
        /* Creates the subscription */
        plan_id: 'P-1UR271328M306580FMDQUEEY'
      });
    },
    onApprove: function(data, actions) {
    //   alert(data.subscriptionID); // You can add optional success message for the subscriber here
        const url = '/api/payment/paypal'
        const userId = {'id':register_user.id};
        paypal_paid(data.subscriptionID)
    
    }
}).render('#paypal-button-container-P-1000'); // Renders the PayPal button


// paypal 小
//888
paypal.Buttons({
    style: {
        color: 'silver',
        shape: 'pill',
        layout: 'horizontal',
        label: 'paypal',
    },
    createSubscription: function(data, actions) {
        return actions.subscription.create({
          /* Creates the subscription */
          plan_id: 'P-80U28316D6581411WMDOBS6Y'
        });
      },
      onApprove: function(data, actions) {
        // alert(data.subscriptionID);
        const url = '/api/payment/paypal'
        const userId = {'id':register_user.id};
        paypal_paid(data.subscriptionID)
      }
}).render('#small-paypal-btn-888');

// 1000
paypal.Buttons({
    style: {
        color: 'silver',
        shape: 'pill',
        layout: 'horizontal',
        label: 'paypal',
    },
    createSubscription: function(data, actions) {
        return actions.subscription.create({
          /* Creates the subscription */
          plan_id: 'P-1UR271328M306580FMDQUEEY'
        });
      },
      onApprove: function(data, actions) {
        // alert(data.subscriptionID);
        
        paypal_paid(data.subscriptionID)
      }
}).render('#small-paypal-btn-1000');




// tappay
TPDirect.setupSDK(20343, "app_PxPSoHZCppMvxjkyNzFnuRmqtgvENcu1rDkYKxl8ZOZHjJfKOkCtAxpmKKbW", "Sandbox");
let fields_big = {
    number: {
        element: "#card-number",
        placeholder: " 4242 4242 4242 4242"
    },
    expirationDate: {
        element: "#card-expiration-date",
        placeholder: " 01 / 23"
    },
    ccv: {
        element: "#card-ccv",
        placeholder: " 123"
    }
};

let fields_sma = {
    number: {
        element: "#card-number-sma",
        placeholder: " 4242 4242 4242 4242"
    },
    expirationDate: {
        element: "#card-expiration-date-sma",
        placeholder: " 01 / 23"
    },
    ccv: {
        element: "#card-ccv-sma",
        placeholder: " 123"
    }
};


TPDirect.card.setup({
    fields: fields_big,
    styles: {
        'input': {
            'color': 'gray'
        },
        'input.ccv': {
            'font-size': '16px'
        },
        'input.expiration-date': {
            'font-size': '16px'
        },
        'input.card-number': {
            'font-size': '16px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});

TPDirect.card.setup({
    fields: fields_sma,
    styles: {
        'input': {
            'color': 'gray'
        },
        'input.ccv': {
            'font-size': '16px'
        },
        'input.expiration-date': {
            'font-size': '16px'
        },
        'input.card-number': {
            'font-size': '16px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});
