const burger_overlay = document.querySelector('.burger-overlay');
const openbtn = document.getElementById('openbtn');
const closebtn = document.getElementById('closebtn');
const burger_menu = document.querySelectorAll('.menu-format');
const big_menu = document.querySelectorAll('li');
let login_status = false;
let login_user_info;
init();
function init() {
    checkLogIn()
};


// 登出按鈕
big_menu[5].addEventListener('click', () => {
    logOut();
});
burger_menu[5].addEventListener('click', () => {
    logOut();
});

// 會員中心按鈕
big_menu[3].addEventListener('click', () => {
    if (login_status) {
        const username = login_user_info.data.name;
        window.location.href = `/member/${username}`;
    }
});
burger_menu[3].addEventListener('click', () => {
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



const overlay_login = document.querySelector('.overlay-login');
const login_close_btn = document.getElementById('login-close-btn');
// 登入/註冊按鈕
big_menu[4].addEventListener('click', () => {
    overlay_login.style.display = 'block';
});

burger_menu[4].addEventListener('click', () => {
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
})
close_btn_for_img_statement.addEventListener('click', () => {
    overlay_statement.style.display = 'none';
})


// module
function checkLogIn() {
    const url = '/api/user';
    let token = document.cookie.split('=')[1];
    fetch(url,{
        method: "GET",
        mode: 'no-cors',
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
            console.log(data);
            window.location.reload(); // 通過的話 重新load頁面
            loginNavBar();
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
    }).then((res) => {
        return res.json();
    }).then((data) => {
        window.location.href = '/';
    })
};



// view
function loginNavBar() {
    // big screen
    big_menu[0].classList.remove('hide'); // 最新消息
    big_menu[1].classList.remove('hide'); // 本月課程
    big_menu[3].classList.remove('hide'); // 會員中心
    big_menu[5].classList.remove('hide'); // 登出系統
    big_menu[2].classList.add('hide'); // 會員方案
    big_menu[4].classList.add('hide'); // 登入/註冊
    // small screen
    burger_menu[0].classList.remove('hide'); // 最新消息
    burger_menu[1].classList.remove('hide'); // 本月課程
    burger_menu[3].classList.remove('hide'); // 會員中心
    burger_menu[5].classList.remove('hide'); // 登出系統
    burger_menu[2].classList.add('hide'); // 會員方案
    burger_menu[4].classList.add('hide'); // 登入/註冊
};

function initRenderMenu(api_data) {
    if (api_data.data !== undefined) {
        // 登入狀態
        // big screen
        big_menu[0].classList.remove('hide'); // 最新消息
        big_menu[1].classList.remove('hide'); // 本月課程
        big_menu[3].classList.remove('hide'); // 會員中心
        big_menu[5].classList.remove('hide'); // 登出系統

        // small screen
        burger_menu[0].classList.remove('hide'); // 最新消息
        burger_menu[1].classList.remove('hide'); // 本月課程
        burger_menu[3].classList.remove('hide'); // 會員中心
        burger_menu[5].classList.remove('hide'); // 登出系統
    } else if(api_data.error === true){
        // 未登入狀態
        // big screen
        big_menu[0].classList.remove('hide'); // 最新消息
        big_menu[1].classList.remove('hide'); // 本月課程
        big_menu[2].classList.remove('hide'); // 會員方案
        big_menu[4].classList.remove('hide'); // 登入/註冊

        // small screen
        burger_menu[0].classList.remove('hide'); // 最新消息
        burger_menu[1].classList.remove('hide'); // 本月課程
        burger_menu[2].classList.remove('hide'); // 會員方案
        burger_menu[4].classList.remove('hide'); // 登入/註冊
    }
};

function renderErrorMsg(msg) {
    const login_msg = document.querySelector('.login-msg');
    login_msg.innerHTML = '';
    login_msg.appendChild(document.createTextNode(msg));
};

// ===========================


// function onSignIn(googleUser) {
//     var id_token = googleUser.getAuthResponse().id_token;
//     console.log(id_token);
//     const token = {
//         'id_token': id_token
//     }
//     const URL = '/api/google-login';
//     fetch(URL, {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(token)
//     }).then((res) => {
//         return res.json()
//     }).then((data) => {
//         if (data.ok === true) {
//             signOut();
//             window.location.reload();
//             loginNavBar();
//         }
//     })
//     // var profile = googleUser.getBasicProfile();
//     // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//     // console.log('Name: ' + profile.getName());
//     // console.log('Image URL: ' + profile.getImageUrl());
//     // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// }

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}


function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    const token = {
        'id_token': id_token
    }
    const URL = '/api/google-login';
    fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(token)
    }).then((res) => {
        return res.json()
    }).then((data) => {
        if (data.ok === true) {
            window.location.reload();
            signOut();
            loginNavBar();
        }
    })

}
function onFailure(error) {
    console.log(error);
}
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
}