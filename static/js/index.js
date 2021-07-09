let check_login = false;
let check_active;
checkLogIn();

const basic_plan = document.getElementById('888-btn');
const pro_plan = document.getElementById('1000-btn');
const contact  = document.getElementById('contact');
const overlay_login = document.querySelector('.overlay-login');
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
            console.log('已完成交易程序，即刻開始預定課程')
        } else {
            // 提醒視窗，詢問是否完成交易程序 （還沒做提醒視窗）
            console.log('請完成繳費程序')
        }
    } else {
        overlay_login.style.display = 'block';
    }
};



//model
function checkLogIn(){
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        if(api_data.data !== null) {
            check_login = true;
            check_active = api_data.data.active
        } else {
            check_login = false;
        }
    })
}