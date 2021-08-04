const burger_overlay = document.querySelector('.burger-overlay');
const openbtn = document.getElementById('openbtn');
const closebtn = document.getElementById('closebtn');
const burger_menu = document.querySelectorAll('.menu-format');
const big_menu = document.querySelectorAll('li');

const classes_big = big_menu[0]
const member_plan_big = big_menu[1]
const member_center_big = big_menu[2]
const login_register_big = big_menu[3]
const logout_big = big_menu[4]

const classes_burger = burger_menu[0]
const member_plan_burger = burger_menu[1]
const member_center_burger = burger_menu[2]
const login_register_burger = burger_menu[3]
const logout_burger = burger_menu[4]
let login_status = false;
let login_user_info;
let token;
function getJwtToken(){
    document.cookie.split('; ').find(row=>{
        let jwt = row.startsWith('jwt')
        if(jwt){
            console.log(row);
            token = row.split('=')[1];
            console.log(token)
        } else {
            token = null
            console.log(token)
        }
    })
}



// controller
init();
function init() {
    getJwtToken()
    checkLogIn()
};

// back to top button
const back_to_top = document.querySelector('.top');
back_to_top.addEventListener('click',()=>{
    document.body.scrollTop = 0; // for Safari
    document.documentElement.scrollTop = 0; // for chrome, firefox...
});

window.onscroll = ()=>{
    if(document.documentElement.scrollTop>20 || document.body.scrollTop>20){
        back_to_top.style.display = 'block';
    } else {
        back_to_top.style.display = 'none';
    }
};

// 登出按鈕
logout_big.addEventListener('click', () => {
    logOut();
});
logout_burger.addEventListener('click', () => {
    logOut();
});

// 會員中心按鈕
member_center_big.addEventListener('click', () => {
    if (login_status) {
        const username = login_user_info.data.name;
        window.location.href = `/member/${username}`;
    }
});

member_center_burger.addEventListener('click', () => {
    if (login_status) {
        const username = login_user_info.data.name;
        window.location.href = `/member/${username}`;
    }
});

// 漢堡按鈕
openbtn.addEventListener('click', () => {
    burger_overlay.style.height = '100%';
});

closebtn.addEventListener('click', () => {
    burger_overlay.style.height = '0%';
});

//漢堡本月課程
classes_burger.addEventListener('click',()=>{
    window.location.href = '/classes'
});
//漢堡會員方案
member_plan_burger.addEventListener('click',()=>{
    window.location.href = '/products'
})


const overlay_login = document.querySelector('.overlay-login');
const login_close_btn = document.getElementById('login-close-btn');
// 登入/註冊按鈕
login_register_big.addEventListener('click', () => {
    overlay_login.style.display = 'block';
});

login_register_burger.addEventListener('click', () => {
    burger_overlay.style.height = '0%';
    overlay_login.style.display = 'block';
});

login_close_btn.addEventListener('click', () => {
    overlay_login.style.display = 'none';
});

// login 輸入
const login_form = document.getElementById('login-form');
login_form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email-login').value;
    const pwd = document.getElementById('pwd-login').value;
    login(email, pwd); // 通過的話 重新load頁面
});

//提示視窗關閉按鈕
const overlay_statement = document.querySelector('.overlay-statement');
const close_btn = document.getElementById('close-btn');
const close_btn_for_img_statement = document.getElementById('close-btn-for-img-statement');
close_btn.addEventListener('click', () => {
    overlay_statement.style.display = 'none';
});

close_btn_for_img_statement.addEventListener('click', () => {
    overlay_statement.style.display = 'none';
});

// 客服按鈕
const customer_service_box = document.querySelector('.customer-service-box');
const customer_service = document.querySelector('.customer-service');
customer_service.addEventListener('click',()=>{
    customer_service_box.style.display = 'block';
});

// 客服視窗關閉
const close_btn_for_img_customer = document.getElementById('close-btn-for-img-customer');
close_btn_for_img_customer.addEventListener('click', () => {
    customer_service_box.style.display = 'none';
});

// 送出客服表單
const customer_form = document.getElementById('customer-form');
customer_form.addEventListener('submit',(event)=>{
    event.preventDefault();
    let customer_name = document.getElementById('customer-name').value;
    let customer_email = document.getElementById('customer-email').value;
    let customer_msg = document.getElementById('customer-msg').value;
    const data = {
        name:customer_name,
        email:customer_email,
        msg:customer_msg  
    }
    sendEmail(data)
});

function sendEmailProcess(){
    renderStatement('信件已寄送完成')
    document.getElementById('customer-name').value = ''
    document.getElementById('customer-email').value= ''
    document.getElementById('customer-msg').value = ''
    customer_service_box.style.display = 'none';
    overlay_statement.style.display = 'block';
};

// google sign in
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
};

function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    const token = {
        'id_token': id_token
    }
    const URL = '/api/user/google-login';
    fetch(URL, {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(token)
    }).then((res) => {
        return res.json()
    }).then((data) => {
        if (data.ok === true) {
            window.location.reload();
            signOut();
            // loginNavBar();
        }
    })

};

function onFailure(error) {
    console.log(error);
};

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 310,
        'height': 47,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
};



// module
function checkLogIn() {
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
        initRenderMenu(api_data);
        if(api_data.error === true){
            return;
        }
        if (api_data.data !== null) {
            login_status = true;
            login_user_info = api_data; //為了會員中心的網址跳轉，把資料變成全域變數
        }
    })
};

function login(email, pwd) {
    const url = '/api/user';
    const login_info = { 'email': email, 'password': pwd }
    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(login_info),
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.ok === true) {
            window.location.reload(); // 通過的話 重新load頁面
            // loginNavBar();
        }
        if (data.error === true) {
            renderErrorMsg(data.message);
        }
    }).catch((err) => {
        console.log(err);
    })
};

function logOut() {
    const url = '/api/user';
    fetch(url, {
        method: "DELETE",
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        window.location.href = '/';
    })
};

function sendEmail(customer_data){
    const url = '/api/mail';
    fetch(url,{
        method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer_data)
    })
    .then(res=>res.json())
    .then(data => {
        console.log(data)
        if(data.ok === true){
            sendEmailProcess();
        }
    });
};


// view

function initRenderMenu(api_data) {
    if(api_data.error === true){
        // 未登入狀態
        classes_big.classList.remove('hide'); // 本月課程
        member_plan_big.classList.remove('hide'); // 會員方案
        login_register_big.classList.remove('hide'); // 登入/註冊

        // small screen
        classes_burger.classList.remove('hide'); // 本月課程
        member_plan_burger.classList.remove('hide'); // 會員方案
        login_register_burger.classList.remove('hide'); // 登入/註冊
        return
    }
    if (api_data.data !== null) {
        // 登入狀態
        // big screen
        classes_big.classList.remove('hide'); // 本月課程
        member_center_big.classList.remove('hide'); // 會員中心
        logout_big.classList.remove('hide'); // 登出系統

        // small screen
        classes_burger.classList.remove('hide'); // 本月課程
        member_center_burger.classList.remove('hide'); // 會員中心
        logout_burger.classList.remove('hide'); // 登出系統
    } else {
        // 未登入狀態
        // big screen
        classes_big.classList.remove('hide'); // 本月課程
        member_plan_big.classList.remove('hide'); // 會員方案
        login_register_big.classList.remove('hide'); // 登入/註冊

        // small screen
        classes_burger.classList.remove('hide'); // 本月課程
        member_plan_burger.classList.remove('hide'); // 會員方案
        login_register_burger.classList.remove('hide'); // 登入/註冊
    }
};

function renderErrorMsg(msg) {
    const login_msg = document.querySelector('.login-msg');
    login_msg.innerHTML = '';
    login_msg.appendChild(document.createTextNode(msg));
};

function renderStatement(msg){
    const statement_msg_check = document.querySelectorAll('.statement-msg');
    const statement_page = document.querySelector('.statement-page');
    if(statement_msg_check.length !==0){ //先check有無render的資料，有先清空
        for(let i=0; i<statement_msg_check.length; i++){
            statement_page.removeChild(statement_msg_check[i]);
        };
    };
    const close_btn = document.querySelector('.close-btn')
    const statement_msg = document.createElement('div');
    statement_msg.className = 'statement-msg';
    statement_msg.appendChild(document.createTextNode(msg));
    statement_page.appendChild(statement_msg);
    statement_page.insertBefore(statement_msg,close_btn);
};

// function loginNavBar() {
//     // big screen
//     classes_big.classList.remove('hide'); // 本月課程
//     member_center_big.classList.remove('hide'); // 會員中心
//     logout_big.classList.remove('hide'); // 登出系統
//     member_plan_big.classList.add('hide'); // 會員方案
//     login_register_big.classList.add('hide'); // 登入/註冊
//     // small screen
//     classes_burger.classList.remove('hide'); // 本月課程
//     member_center_burger.classList.remove('hide'); // 會員中心
//     logout_burger.classList.remove('hide'); // 登出系統
//     member_plan_burger.classList.add('hide'); // 會員方案
//     login_register_burger.classList.add('hide'); // 登入/註冊
//     window.location.reload()
// };
