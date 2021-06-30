let burger_overlay = document.querySelector('.burger-overlay');
let body = document.querySelector('body');
let openbtn = document.getElementById('openbtn');
let closebtn = document.getElementById('closebtn');

// 漢堡按鈕
openbtn.addEventListener('click', () => {
    burger_overlay.style.height = '100%';
});

closebtn.addEventListener('click', () => {
    burger_overlay.style.height = '0%';
});

let overlay_login = document.querySelector('.overlay-login');
let login_close_btn = document.getElementById('login-close-btn');
let sign_big = document.getElementById('sign-big');
let sign_small = document.getElementById('sign-small');

sign_big.addEventListener('click', () => {
    overlay_login.style.display = 'block';
});

sign_small.addEventListener('click', ()=>{
    overlay_login.style.display = 'block';
});

login_close_btn.addEventListener('click',()=>{
    overlay_login.style.display = 'none';
});

// login
const login_form = document.getElementById('login-form');
login_form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const email = document.getElementById('email-login').value;
    const pwd = document.getElementById('pwd-login').value;
    login(email, pwd);
    // 通過的話
    // 重新load頁面，上面的navbar會切換已登入，出現會員中心
});

function login(email, pwd) {
    const login_info = {'email':email, 'password':pwd}
    const url = '/api/user';
    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(login_info),
    }).then((res)=>{
        console.log(res); 
    })
};