// controller
init()
function init(){
    checkLogIn();
    getMember();
    getBooking();
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

function cancelBookingProcess(){
    const cancel_btn = document.querySelectorAll('.class-btn');
    for(let i=0;i<cancel_btn.length; i++){
        cancel_btn[i].addEventListener('click',()=>{
            if(window.confirm("確定要刪除此預約課程嗎?") == true) {
                const bookingId = cancel_btn[i].value; //str
                // 刪除booking db
                deleteBooking(bookingId,(res)=>{
                    if(res.ok === true){
                        window.location.reload();
                    }
                });
            }

        })
    }
    
};

// 查詢選單 TODO
function selectHistoryDay(){
    let day = document.getElementById('select_history_day').value;
    day = parseInt(day);
    console.log(day);

    
};

//開通按鈕流程
function activeProcess(){
    const active_btn = document.getElementById('active-btn');
    if(active_btn === null) {
        return ;
    } else {
        active_btn.addEventListener('click',()=>{
            window.location.href = '/signup-payment'
        })
    }
}




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
        if(data.ok === true){
            const img = data.address;
            renderUpload(img);

        }
    })
};

function getMember(){
    const url = '/api/member'
    fetch(url).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        if(data !== null) {
            renderMemberInfo(data);
        }
    })
};

function getBooking(){
    const url = '/api/booking';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        console.log(api_data);
        const data = api_data.data;
        if(data !== null) {
            for(let i=0; i<data.length; i++){
                // 判斷時間 
                const class_time = new Date(data[i].class_time.substring(0,10));
                const today = new Date();
                if(class_time>today){
                    renderBookingClass(data[i]);
                } else if(class_time===today){
                    //TODO
                    // 要再判斷，開始上課時間一小時內不能取消預定
                    // 現在時間超過結束時間=>renderHistory
                
                } else if(class_time<today) {
                    renderHistory(data[i])
                }
            }
            cancelBookingProcess(); // 等render完再加上取消預定按鈕的功能
        }
    });
};

function deleteBooking(bookingId, callback){
    const url = '/api/booking';
    const booking_info = {'bookingId':bookingId}
    fetch(url,{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(booking_info)
    }).then((res)=>{
        return res.json()
    }).then((del)=>{
        callback(del);
    })
};




// view
function renderUpload(img_address){
    const img_box = document.querySelector('.img-box');
    img_box.innerHTML = ''
    const img = document.createElement('img');
    img.setAttribute('src', img_address);
    img.className = 'mem-photo';
    img_box.appendChild(img);
};

function renderMemberInfo(data){
    const mem_email = document.getElementById('email');
    const mem_plan = document.getElementById('plan');
    const mem_active = document.getElementById('active')
    const img_box = document.querySelector('.img-box');
    const img = document.createElement('img');
    const email = document.createElement('div');
    const plan = document.createElement('div');
    const active = document.createElement('div');
    const format_plan = plan_transform(data.plan);
    const active_check = check_active(data.active);
    if(active_check) {
        active.appendChild(document.createTextNode('開通'))
        mem_active.appendChild(active);
    } else {
        active.appendChild(document.createTextNode('未開通'))
        active.className = 'active-format';
        const active_btn = document.createElement('button');
        active_btn.id = 'active-btn'
        active_btn.className = 'btn class-btn';
        active_btn.appendChild(document.createTextNode('開通'))
        mem_active.appendChild(active);
        mem_active.appendChild(active_btn)
    }
    email.appendChild(document.createTextNode(data.email));
    plan.appendChild(document.createTextNode(format_plan))
    let image_address = data.image;
    if(image_address !== null) { // null就是使用者沒有上傳照片
        img.setAttribute('src', image_address);
        img.className = 'mem-photo';
        img_box.appendChild(img);
    }
    mem_email.appendChild(email);
    mem_plan.appendChild(plan);
    activeProcess();
};

function plan_transform(plan){
    if(plan === 888) {
        return '入門版';
    } else if(plan === 1000) {
        return '專業版';
    }
};

function check_active(active){
    if(active === 'yes'){
        return true
    } else if(active === 'no') {
        return false
    }
};

function renderBookingClass(data){
    const booking_box = document.querySelector('#booking-box');
    const booking_class = document.createElement('div');
    const time = document.createElement('div');
    const class_ = document.createElement('div');
    const teacher = document.createElement('div');
    const room = document.createElement('div');
    const btn_box = document.createElement('div');
    const btn = document.createElement('button');

    // btn.onclick = cancelBookingProcess();
    btn_box.className = 'status';
    btn.className = 'btn btn-sm class-btn';
    btn.value = data.bookingId;
    booking_class.id = data.bookingId;
    booking_class.className = 'booking-class'
    time.className = 'time';
    class_.className = 'class';
    teacher.className = 'teacher';
    room.className = 'room';
    time.appendChild(document.createTextNode(data.class_time));
    class_.appendChild(document.createTextNode(data.class_name));
    teacher.appendChild(document.createTextNode(data.teacher));
    room.appendChild(document.createTextNode(data.room));
    btn.appendChild(document.createTextNode('取消預定'))
    btn_box.appendChild(btn)
    booking_class.appendChild(time)
    booking_class.appendChild(class_)
    booking_class.appendChild(teacher)
    booking_class.appendChild(room)
    booking_class.appendChild(btn_box)
    booking_box.appendChild(booking_class)
};

function renderHistory(data){
    const booking_box = document.querySelector('#history-booking-box');
    const booking_class = document.createElement('div');
    const time = document.createElement('div');
    const class_ = document.createElement('div');
    const teacher = document.createElement('div');
    const room = document.createElement('div');
    booking_class.id = data.bookingId;
    booking_class.className = 'booking-class'
    time.className = 'time';
    class_.className = 'class';
    teacher.className = 'teacher';
    room.className = 'room';
    time.appendChild(document.createTextNode(data.class_time));
    class_.appendChild(document.createTextNode(data.class_name));
    teacher.appendChild(document.createTextNode(data.teacher));
    room.appendChild(document.createTextNode(data.room));
    booking_class.appendChild(time)
    booking_class.appendChild(class_)
    booking_class.appendChild(teacher)
    booking_class.appendChild(room)
    booking_box.appendChild(booking_class)
};
