let check_login = false;
let check_active;
const basic_plan = document.getElementById('888-btn');
const pro_plan = document.getElementById('1000-btn');
const contact  = document.getElementById('contact');
const overlay_login_ = document.querySelector('.overlay-login');


// controller
checkLogIn();
basic_plan.addEventListener('click',()=>{
    check_pay();
});

pro_plan.addEventListener('click',()=>{
    check_pay()
});


function check_pay(){
    if(check_login) {
        if(check_active === 'yes') {
            // 提醒視窗，顯示已完成繳費程序，可以開始預訂課程
            renderStatement('已完成交易程序，即刻開始預定課程')
            overlay_statement.style.display = 'block'
        } else {
            window.location.href = '/signup-payment';
        }
    } else {
        overlay_login_.style.display = 'block';
    }
};



//model
function checkLogIn(){
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        console.log(api_data)
        if(api_data.error === true){
            return
        }
        if(api_data.data !== null) {
            check_login = true;
            check_active = api_data.data.active
        } else {
            check_login = false;
        }
    })
}

//view
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