
init()
function init(){
    checkLogIn();
}

const select_button1 = document.querySelector('#booking');
const select_button2 = document.querySelector('#history-record');
const history_form = document.querySelector('.history-form');
const booking_form = document.querySelector('.booking-block');

// 預約的課程按鈕
select_button1.addEventListener('click',()=>{
    select_button2.classList.remove('active-btn');
    select_button1.classList.add('active-btn');
    history_form.style.display = 'none';
    booking_form.style.display = 'block';

});

// 歷史紀錄按鈕
select_button2.addEventListener('click',()=>{
    select_button1.classList.remove('active-btn');
    select_button2.classList.add('active-btn');
    booking_form.style.display = 'none';
    history_form.style.display = 'block';
});

// upload_img
const upload_btn = document.getElementById('upload-btn');
upload_btn.addEventListener('click',()=>{
    uploadImg();
})


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

function uploadImg(){
    const img_file = document.getElementById('img');
    const form = new FormData();
    form.append('img', img_file.files[0]) // get file object
    const url = "/api/upload"
    fetch(url, {
        method: "POST",
        body: form,
    }).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        if(data.ok === true){
            const img = data.address;
            renderUpload(img);

        }
    })
};

function renderUpload(img_address){
    const img_box = document.querySelector('.img-box');
    const img = document.createElement('img');
    img.setAttribute('src', img_address);
    img_box.appendChild(img);
};
