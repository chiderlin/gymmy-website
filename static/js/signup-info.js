// 下一步按鈕
const next_big = document.getElementById('next-big');
const next_small = document.getElementById('next-small');


// 註冊
const register_form_big = document.getElementById('register-form-big');
console.log(register_form_big);
const register_form_small = document.getElementById('register-form-small');
register_form_big.addEventListener('submit',(event)=>{
    event.preventDefault();
    const name_big = document.getElementById('name-big').value;
    const email_big = document.getElementById('email-big').value;
    const pwd_big = document.getElementById('pwd-big').value;
    const phone_big = document.getElementById('phone-big').value;
    user_register(name_big, email_big, pwd_big, phone_big);
    // window.location.href = '/signup-payment'
});
register_form_small.addEventListener('submit',(event)=>{
    event.preventDefault();
    const name_sma = document.getElementById('name-small').value;
    const email_sma = document.getElementById('email-small').value;
    const pwd_sma = document.getElementById('pwd-small').value;
    const phone_sma = document.getElementById('phone-small').value;
    user_register(name_sma, email_sma, pwd_sma, phone_sma);
    // window.location.href = '/signup-payment'
})

function user_register(name, email, pwd, phone) {
    const register_info = {'name': name, 'email':email, 'pwd':pwd, 'phone':phone}
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
    })
};
