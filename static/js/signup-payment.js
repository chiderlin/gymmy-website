//controller
let register_user;
init()

function init() {
    getUser();
}

// 暫時先用判斷divBlock來初始化不同的TPDirect，因為只能初始化一個input
const divBlock = document.querySelector('.div-block');
const style = window.getComputedStyle(divBlock)
const divBlock_status = style.getPropertyValue("display");
if (divBlock_status === 'none') {
    let fields_sma = {
        number: {
            element: document.querySelectorAll(".card-number")[1],
            placeholder: " 4242 4242 4242 4242"
        },
        expirationDate: {
            element: document.querySelectorAll(".card-expiration-date")[1],
            placeholder: " 01 / 23"
        },
        ccv: {
            element: document.querySelectorAll(".card-ccv")[1],
            placeholder: " 123"
        }
    };
    tappaySetUp(fields_sma);
} else {
    let fields_big = {
        number: {
            element: document.querySelectorAll(".card-number")[0],
            placeholder: " 4242 4242 4242 4242"
        },
        expirationDate: {
            element: document.querySelectorAll(".card-expiration-date")[0],
            placeholder: " 01 / 23"
        },
        ccv: {
            element: document.querySelectorAll(".card-ccv")[0],
            placeholder: " 123"
        }
    };
    tappaySetUp(fields_big);
};

function tappaySetUp(fields){
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
}

const small_tappay_radio = document.getElementById('small-tappay-radio');
const small_paypal_radio = document.getElementById('small-paypal-radio');
const small_tappay = document.getElementById('small-tappay');
const small_paypal = document.getElementById('small-paypal');
small_tappay_radio.addEventListener('click', () => {
    small_paypal.style.display = 'none';
    small_tappay.style.display = 'block';
});

small_paypal_radio.addEventListener('click', () => {
    small_tappay.style.display = 'none';
    small_paypal.style.display = 'block';
});

const big_tappay_radio = document.getElementById('big-tappay-radio');
const big_paypal_radio = document.getElementById('big-paypal-radio');
const big_tappay = document.getElementById('big-tappay');
const big_paypal = document.getElementById('big-paypal');
const payment_format = document.querySelector('.payment-format');

big_tappay_radio.addEventListener('click', () => {
    payment_format.style.width = '0';
    big_paypal.style.display = 'none';
    big_tappay.style.display = 'block';
});

big_paypal_radio.addEventListener('click', () => {
    big_tappay.style.display = 'none';
    payment_format.style.width = '50%';
    big_paypal.style.display = 'block';
});

// 預設打開信用卡...
if (big_tappay_radio.checked === true) {
    payment_format.style.width = '0';
    big_paypal.style.display = 'none';
    big_tappay.style.display = 'block';
};

// 串接tappay金流 => 付款
big_tappay.addEventListener('submit', (event) => {
    event.preventDefault();
    TPDirect.card.getPrime((res) => {
        if (res.status !== 0) {
            // render錯誤訊息
            renderErrMsg('信用卡驗證不正確')
            return;
        }
        const phone_big = document.getElementById('phone-big').value;
        const prime = res.card.prime;
        if (register_user !== null) {
            uploadPhone(phone_big, (res) => {
                sendPrime(prime, phone_big);
            });

        }
    })
});

small_tappay.addEventListener('submit', (event) => {
    event.preventDefault();
    TPDirect.card.getPrime((res) => {
        if (res.status !== 0) {
            // render錯誤訊息
            renderErrMsg('信用卡驗證不正確')
            return;
        }
        const phone_small = document.getElementById('phone-small').value;
        const prime = res.card.prime;
        if (register_user !== null) {
            uploadPhone(phone_small, (res) => {
                sendPrime(prime, phone_small);
            });
        }
    })
});

// 根據plan不同，paypal顯示的plan也不同
function switchPaypalBtn() {
    // 大
    const paypal_big_888 = document.getElementById('paypal-button-container-P-888');
    const paypal_big_1000 = document.getElementById('paypal-button-container-P-1000');

    // 小
    const paypal_small_888 = document.getElementById('small-paypal-btn-888');
    const paypal_small_1000 = document.getElementById('small-paypal-btn-1000');
    if (register_user !== null) {
        if (register_user.plan === 888) {
            paypal_big_1000.style.display = 'none';
            paypal_small_1000.style.display = 'none';

        } else if (register_user.plan === 1000) {
            paypal_big_888.style.display = 'none';
            paypal_small_888.style.display = 'none';
        }
    }

};


// model
function getUser() {
    const url = '/api/user';
    fetch(url,{
        method: "GET",
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        return res.json();
    }).then((api_data) => {
        register_user = api_data.data;
        switchPaypalBtn();
    })
};

function uploadPhone(phone, cb) {
    const url = '/api/user/phone';
    const phone_info = { 'phone': phone };
    fetch(url, {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(phone_info)
    }).then((res) => {
        return res.json()
    }).then((data) => {
        if(data.error === true){
            renderErrMsg(data.message)
        }
        if(data.ok === true){
            return cb(data)
        }
    })
};

function sendPrime(prime, phone) {
    register_user.phone = phone // 一開始phone是null，改上填好的
    const prime_data = { 'prime': prime, 'info': register_user }
    const url = '/api/payment/pay-by-prime';
    fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prime_data),
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.ok === true) {
            window.location.href = '/thankyou'
        }
        if(data.error === true) {
            renderErrMsg(data.message);
        }
    })
};

function paypalPaid(subscriptionID) {
    const url = '/api/payment/paypal'
    const sub_id = { 'sub_id': subscriptionID }
    fetch(url, {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sub_id)
    }).then((res) => {
        return res.json()
    }).then((data) => {
        window.location.href = '/thankyou';
    })
};


// view 
function renderErrMsg(msg){
    const error_msg = document.querySelectorAll('.msg');
    // 在這裡判斷使用的大小螢幕，選擇要render的對象
    if(divBlock_status === 'none'){
        error_msg[1].innerHTML = ''
        error_msg[1].appendChild(document.createTextNode(msg))
    } else {
        error_msg[0].innerHTML = ''
        error_msg[0].appendChild(document.createTextNode(msg))
    }
};

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
    createSubscription: function (data, actions) {
        return actions.subscription.create({
            /* Creates the subscription */
            plan_id: 'P-9WN86235RV203443MMEBEUKA',
        });
    },
    onApprove: function (data, actions) {
        //TODO: 呼叫/paypal
        paypalPaid(data.subscriptionID)
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
    createSubscription: function (data, actions) {
        return actions.subscription.create({
            /* Creates the subscription */
            plan_id: 'P-9NB86150B1697750WMEBEUZI'
        });
    },
    onApprove: function (data, actions) {
        paypalPaid(data.subscriptionID)

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
    createSubscription: function (data, actions) {
        return actions.subscription.create({
            /* Creates the subscription */
            plan_id: 'P-9WN86235RV203443MMEBEUKA'
        });
    },
    onApprove: function (data, actions) {
        paypalPaid(data.subscriptionID)
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
    createSubscription: function (data, actions) {
        return actions.subscription.create({
            /* Creates the subscription */
            plan_id: 'P-9NB86150B1697750WMEBEUZI'
        });
    },
    onApprove: function (data, actions) {
        paypalPaid(data.subscriptionID)
    }
}).render('#small-paypal-btn-1000');

// tappay
TPDirect.setupSDK(20343, "app_PxPSoHZCppMvxjkyNzFnuRmqtgvENcu1rDkYKxl8ZOZHjJfKOkCtAxpmKKbW", "Sandbox");
