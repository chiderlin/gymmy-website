//controller
// 後台登入
const backside_login_link = document.querySelector('#backside-login');
backside_login_link.addEventListener('click',()=>{
    checkLogIn_footer();
})


// model
function checkLogIn_footer() {
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
        if(api_data.error === true){
            return;
        }
        if (api_data.data !== null) {
            let check_auth = api_data.data.auth
            if(check_auth === 2){
                logOut_footer()  
            } else {
                // 使用者 auth 1 直接過去
                window.location.href = '/backside-login'
            }
        } else {
            // 未登入過任何使用者 直接過去
            window.location.href = '/backside-login'
        }
    })
};


function logOut_footer() {
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
        window.location.href = '/backside-login'
    })
};