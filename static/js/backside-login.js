const login_form = document.getElementById('login-form');


// controller
// getJwtToken();
loginStatus();


login_form.addEventListener('submit', (event)=>{
    event.preventDefault();
    const email = document.getElementById('email').value;
    const pwd = document.getElementById('pwd').value;
    // 呼叫user 登入 => 檢查權限是1才可以
    login(email, pwd)

});

// function getJwtToken(){
//     document.cookie.split('; ').find(row=>{
//         let jwt = row.startsWith('jwt')
//         if(jwt){
//             token = row.split('=')[1];
//         } else {
//             token = null
//         }
//     })
// };

// model
function login(email, pwd){
    const url = '/api/user';
    const login_info = {'email':email, 'password':pwd}
    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(login_info),
    }).then((res)=>{
        return res.json(); 
    }).then((data)=>{
        if(data.ok === true) {
            window.location.reload();
        } 
        if(data.error === true){
            renderError(data.message);
        }
    }).catch((err)=>{
        console.log(err);
    })

};

function loginStatus() {
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        if(api_data.data !== null){
            const auth = api_data.data.auth
            if(auth === 1) {
                window.location.href = '/backside';
            } else {
                renderError('權限不足');
            }
        }
    })
};


// view
function renderError(msg){
    const error_msg = document.querySelector('.error-msg');
    error_msg.innerHTML = '';
    error_msg.appendChild(document.createTextNode(msg));

};