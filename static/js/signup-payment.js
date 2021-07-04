let register_user;
let prime;
let login_check= false;
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
        if(res.status !== 0){
            // render錯誤訊息
            console.log(res.status);
            return;
        }
        prime = res.card.prime;
        sendPrime(prime);
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
        login_check = true;
        switch_paypal_btn();
    })
}

function sendPrime(prime){
    if(!login_check) {
        console.log('login first')
    } else {
        const prime_data = {'prime':prime, 'info':register_user}
        console.log(prime_data);
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
        window.location.href = '/thankyou';
        logOut();
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
    window.location.href = '/thankyou';
    logOut();
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
        window.location.href = '/thankyou';
        logOut();
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
        window.location.href = '/thankyou'
        logOut();
      }
}).render('#small-paypal-btn-1000');




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


