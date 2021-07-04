let register_user;
let prime;
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
        if(res.status !== 0){
            // render錯誤訊息
            return;
        }
        prime = res.card.prime;
        getUser();
    })
})

// model
function getUser(){
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        register_user = api_data.data;
        console.log(register_user);
        sendPrime(prime);
    })
}

function sendPrime(prime){
    if(register_user === {}) {
        console.log('login first')
    } else {
        const prime_data = {'prime':prime, 'info':register_user}
        const url = '/api/pay-by-prime';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(prime_data),
        }).then((res)=>{
            console.log(res);
            return res.json();
    
        }).then((data)=>{
            console.log(data);
            window.location.href = '/thankyou'
            logOut();
        })
    }
};

function logOut(){
    const url = '/api/user';
    fetch(url,{
        method: "DELETE",
    }).then((res)=>{
        return res.json();
    }).then((data)=>{
        
    })
}


// 金流
// paypal
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
      alert(data.subscriptionID); // You can add optional success message for the subscriber here
    }
}).render('#paypal-button-container-P-80U28316D6581411WMDOBS6Y'); // Renders the PayPal button

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
        alert(data.subscriptionID); // You can add optional success message for the subscriber here
      }
}).render('#small-paypal-btn');



// tappay
TPDirect.setupSDK(20343, "app_PxPSoHZCppMvxjkyNzFnuRmqtgvENcu1rDkYKxl8ZOZHjJfKOkCtAxpmKKbW", "Sandbox");
let fields = {
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
TPDirect.card.setup({
    fields: fields,
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


