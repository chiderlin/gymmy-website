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