let check_login = false;

checkLogIn();


const basic_plan = document.getElementById('basic-plan');
const pro_plan = document.getElementById('pro-plan');
const contact  = document.getElementById('contact');
basic_plan.addEventListener('click',()=>{
    check_pay();
});

pro_plan.addEventListener('click',()=>{
    check_pay()
});

function check_pay(){
    if(!check_login) {
        overlay_login.style.display = 'block';
    }
};

//model
function checkLogIn(){
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        console.log(api_data);
        if(api_data.data !== null) {
            check_login = true;
            check_active = api_data.data.active
        } else {
            check_login = false;
        }
    })
}