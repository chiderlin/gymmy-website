//controller
// 價格選項
const basic_plan = document.getElementById('basic-plan');
const basic_plan_sma = document.getElementById('basic-plan-sma');
const pro = document.getElementById('profession');
const pro_sma = document.getElementById('pro-plan-sma');
let price;
let register_info = {}
basic_plan.addEventListener('click',()=>{
    price = 888;
});

pro.addEventListener('click',()=>{
    price = 1000;
});

basic_plan_sma.addEventListener('click',()=>{
    price = 888;
});

pro_sma.addEventListener('click',()=>{
    price = 1000;
});


// 註冊
const register_form_big = document.getElementById('register-form-big');
const register_form_small = document.getElementById('register-form-small');
register_form_big.addEventListener('submit',(event)=>{
    event.preventDefault();
    const name_big = document.getElementById('name-big').value;
    const email_big = document.getElementById('email-big').value;
    const pwd_big = document.getElementById('pwd-big').value;
    if(price === undefined){
        renderMsg('請選擇方案');
    } else {
        register_info = {'name': name_big, 'email':email_big, 'pwd':pwd_big, 'price':price};
        userRegister(register_info,(msg)=>{
            if(msg.error === true) {
                renderMsg(msg.message);
            } else if(msg.ok === true) {
                window.location.href = '/signup-payment'
            }
        });
    }
});

register_form_small.addEventListener('submit',(event)=>{
    event.preventDefault();
    const name_sma = document.getElementById('name-small').value;
    const email_sma = document.getElementById('email-small').value;
    const pwd_sma = document.getElementById('pwd-small').value;
    if(price === undefined){
        renderMsgSma('請選擇方案');
    } else {
        register_info = {'name': name_sma, 'email':email_sma, 'pwd':pwd_sma, 'price':price};
        userRegister(register_info,(msg)=>{
            if(msg.error === true) {
                renderMsgSma(msg.message);
            } else if(msg.ok === true) {
                window.location.href = '/signup-payment'
            }
        });
    }
    
});


// model
function userRegister(register_info, callback) {
    const url = '/api/user'
    fetch(url,{
        method: 'POST',
        body: JSON.stringify(register_info),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res)=>{
        return res.json();
    }).then((msg)=>{
        return callback(msg)
    })
};


//view
function renderMsg(msg){
    const renderMsg = document.getElementById('msg');
    renderMsg.innerHTML = '';
    renderMsg.appendChild(document.createTextNode(msg));
};

function renderMsgSma(msg){
    const renderMsg = document.getElementById('msg-sma');
    renderMsg.innerHTML = '';
    renderMsg.appendChild(document.createTextNode(msg));
};