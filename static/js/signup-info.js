//controll
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


// 下一步按鈕
// const next_big = document.getElementById('next-big');
// const next_small = document.getElementById('next-small');


// 註冊
const register_form_big = document.getElementById('register-form-big');
const register_form_small = document.getElementById('register-form-small');
register_form_big.addEventListener('submit',(event)=>{
    event.preventDefault();
    const name_big = document.getElementById('name-big').value;
    const email_big = document.getElementById('email-big').value;
    const pwd_big = document.getElementById('pwd-big').value;
    const phone_big = document.getElementById('phone-big').value;
    if(price === undefined){
        renderMsg('請選擇方案');
    } else {
        register_info = {'name': name_big, 'email':email_big, 'pwd':pwd_big, 'phone':phone_big, 'price':price};
        user_register(register_info);
    }
});

register_form_small.addEventListener('submit',(event)=>{
    event.preventDefault();
    const name_sma = document.getElementById('name-small').value;
    const email_sma = document.getElementById('email-small').value;
    const pwd_sma = document.getElementById('pwd-small').value;
    const phone_sma = document.getElementById('phone-small').value;
    if(price === undefined){
        renderMsg('請選擇方案');
    } else {
        register_info = {'name': name_sma, 'email':email_sma, 'pwd':pwd_sma, 'phone':phone_sma, 'price':price};
        user_register(register_info);
    }
    
})



// model
function user_register(register_info) {
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
        console.log(msg);
        if(msg.error === true) {
            renderMsg(msg.message);
        } else if(msg.ok === true) {
            window.location.href = '/signup-payment'
        }
    })
};

//view
function renderMsg(msg){
    const renderMsg = document.getElementById('msg');
    renderMsg.innerHTML = '';
    renderMsg.appendChild(document.createTextNode(msg));
}
