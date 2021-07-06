
init()
function init(){
    checkLogIn();
}

const select_button1 = document.querySelector('#booking');
const select_button2 = document.querySelector('#history-record');
const history_form = document.querySelector('.history-form');
const booking_form = document.querySelector('.booking-block');

// 預約的課程
select_button1.addEventListener('click',()=>{
    select_button2.classList.remove('active-btn');
    select_button1.classList.add('active-btn');
    history_form.style.display = 'none';
    booking_form.style.display = 'block';

});

// 歷史紀錄
select_button2.addEventListener('click',()=>{
    select_button1.classList.remove('active-btn');
    select_button2.classList.add('active-btn');
    booking_form.style.display = 'none';
    history_form.style.display = 'block';
});




// model
function checkLogIn(){
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        if(api_data.data === null) {
            window.location.href = '/'
        }
    })
};