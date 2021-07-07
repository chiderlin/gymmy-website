let check_login = false;

checkLogIn();

function checkLogIn(){
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        if(api_data.data !== null) {
            check_login = true;
        } else {
            check_login = false;
        }
    })
}

const basic_plan = document.getElementById('888-btn');
const pro_plan = document.getElementById('1000-btn');
const contact  = document.getElementById('contact');
const overlay_login = document.querySelector('.overlay-login');
basic_plan.addEventListener('click',()=>{
    if(check_login === false) {
        overlay_login.style.display = 'block';
    } else {

    }
});

pro_plan.addEventListener('click',()=>{
    if(check_login === false) {
        overlay_login.style.display = 'block';
    } else {
        // 
    }
});
