let price;
let member_info;

// controller
init()
function init() {
    checkLogIn();
    getMember();
    getBooking();
}

const select_button1 = document.querySelector('#booking');
const select_button2 = document.querySelector('#history-record');
const history_form = document.querySelector('.history-form');
const booking_form = document.querySelector('.booking-block');

// 預約的課程按鈕
select_button1.addEventListener('click', () => {
    select_button2.classList.remove('active-btn');
    select_button1.classList.add('active-btn');
    history_form.style.display = 'none';
    booking_form.style.display = 'block';

});

// 歷史紀錄按鈕
select_button2.addEventListener('click', () => {
    select_button1.classList.remove('active-btn');
    select_button2.classList.add('active-btn');
    booking_form.style.display = 'none';
    history_form.style.display = 'block';
});

// 選擇方案視窗
function planBtnProcess(){

    const plan_btn = document.getElementById('plan-btn');
    const overlay_option = document.querySelector('.overlay-option');
    plan_btn.addEventListener('click',()=>{
        overlay_option.style.display = 'block';
    });

    //選擇方案視窗關閉按鈕
    const close_btn_for_img_option = document.getElementById('close-btn-for-img-option');
    close_btn_for_img_option.addEventListener('click', () => {
        overlay_option.style.display = 'none';
    });

    //價格選項
    const basic_plan = document.getElementById('basic-plan');
    const pro = document.getElementById('pro-plan');
    basic_plan.addEventListener('click',()=>{
        price = 888;
        console.log(price)
    });
    pro.addEventListener('click',()=>{
        price = 1000;
        console.log(price)
    });

    // 確認按鈕
    const check_btn = document.getElementById('check-btn');
    check_btn.addEventListener('click',()=>{
        if(price === undefined){
            renderErrMsg();
        } else {
            overlay_option.style.display = 'none';
        }
    });
}


// upload_img
const upload_btn = document.getElementById('upload-btn');
upload_btn.addEventListener('click', () => {
    uploadImg();
})

function cancelBookingProcess() {
    const cancel_btn = document.querySelectorAll('.class-btn');
    for (let i = 0; i < cancel_btn.length; i++) {
        cancel_btn[i].addEventListener('click', () => {
            if (window.confirm("確定要刪除此預約課程嗎?") == true) {
                const bookingId = cancel_btn[i].value; //str
                // 刪除booking db
                deleteBooking(bookingId, (res) => {
                    if (res.ok === true) {
                        window.location.reload();
                    }
                });
            }

        })
    }

};


// 查詢天數選單
function selectHistoryDay() {
    let day = document.getElementById('select_history_day').value;
    day = parseInt(day);
    console.log(day)
    const booking_box_3 = document.querySelector('#history-booking-box-3');
    const booking_box_7 = document.querySelector('#history-booking-box-7');
    if(day === 1){
        booking_box_7.style.display = 'none';
        booking_box_3.style.display = 'block';
    }else if(day === 2){
        booking_box_3.style.display = 'none';
        booking_box_7.style.display = 'block';
    }
};

//開通按鈕流程
function activeProcess() {
    const payment_active_btn = document.getElementById('payment-active-btn');
    if (payment_active_btn === null) { //已經開通的狀態這邊就會是null
        return;
    } else {
        payment_active_btn.addEventListener('click', () => {
            // 如果沒有選擇方案，就不能去開通頁面
            if(member_info.plan===null || member_info.plan===0){
                if(price === undefined){
                    // 提示視窗，請先選擇方案
                    overlay_statement.style.display = 'block';
                    renderStatementMsg('請先選擇方案');
                } else {
                    // 把方案更新到user 資料庫
                    uploadPlan(price);
                    window.location.href = '/signup-payment'
                }
            } else {
                window.location.href = '/signup-payment'
            }
        })
    }
}




// model
function checkLogIn() {
    const url = '/api/user';
    fetch(url).then((res) => {
        return res.json();
    }).then((api_data) => {
        if (api_data.data === null) {
            window.location.href = '/'
        }
    })
};

function uploadImg() {
    const img_file = document.getElementById('img');
    const form = new FormData();
    form.append('img', img_file.files[0]) // get file object
    const url = "/api/upload"
    fetch(url, {
        method: "POST",
        body: form,
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.ok === true) {
            const img = data.address;
            renderUpload(img);

        }
    })
};

function getMember() {
    const url = '/api/member'
    fetch(url).then((res) => {
        return res.json();
    }).then((data) => {
        member_info = data;
        console.log(data);
        if (data !== null) {
            renderMemberInfo(data);
        }
    })
};

function getBooking() {
    const url = '/api/booking';
    fetch(url).then((res) => {
        return res.json();
    }).then((api_data) => {
        console.log(api_data);
        const data = api_data.data;
        if (data.length !== 0 && data !== "未登入") {
            for (let i = 0; i < data.length; i++) {
                // 判斷時間 
                const class_time = data[i].class_time.substring(0, 10)
                const start_time = new Date(data[i].start_time).toLocaleString('chinese', { hour12: false }).substring(9, 14);
                const end_time = new Date(data[i].start_time).toLocaleString('chinese', { hour12: false }).substring(9, 14);
                const class_time_info = {
                    'class_time': new Date(class_time),
                    'month': new Date(class_time).getMonth() + 1,
                    'date': new Date(class_time).getDate(),
                    'start_time': new Date(class_time + 'T' + start_time),
                    'end_time': new Date(class_time + 'T' + end_time),
                }

                const today = new Date();
                const today_info = {
                    'time': today,
                    'month': today.getMonth() + 1,
                    'date': today.getDate(),
                    'day': today.getDay(),
                    'hour': today.getHours(),
                }
                if (class_time_info.class_time > today) {// 不是今天的課
                    renderBookingClass(data[i], true);
                } else if (class_time_info.month === today_info.month && class_time_info.date === today_info.date) { //今天的課
                    if (class_time_info.start_time > today) { //上課時間還沒到
                        const compare_time = new Date(class_time_info.start_time).getTime() - today.getTime();
                        let min = Math.floor(compare_time / (1000 * 60));
                        if (min < 60) { //上課時間在一小時內
                            renderBookingClass(data[i], false); //不能取消預定
                        } else {
                            renderBookingClass(data[i], true);
                        }
                    } else if (class_time_info.end_time < today) {
                        //剛結束的課程，去三天內
                        renderHistory(data[i], 3)
                    }
                } else {
                    const compare_time = today.getTime() - new Date(class_time_info.start_time).getTime();
                    let day = Math.floor(compare_time / (1000 * 60*60*24));
                    if(day>0 && day<=3){
                        renderHistory(data[i], 3) //三天內
                    } else if(day>3 && day<=7){
                        renderHistory(data[i], 7) // 四天～七天
                    }
                }


                // if(class_time>today){ // 不是今天的課
                //     renderBookingClass(data[i], true);

                // } else if(class_time_info.month === today_info.month && class_time_info.date === today_info.date){ //今天的課
                //     // 要再判斷，開始上課時間一小時內不能取消預定
                //     // 現在時間超過結束時間=>renderHistory

                //     if(class_time_info.start_time>today_info.hour){ // 課程小時大

                //         renderBookingClass(data[i],true);
                //     } else if(class_time_info.start_time===today_info.hour){ //如果小時一樣
                //         renderBookingClass(data[i],false);
                //     } else {
                //         renderHistory(data[i])
                //     }

                // } else if(class_time<today) {
                //     renderHistory(data[i])

            }
            cancelBookingProcess(); // 等render完再加上取消預定按鈕的功能
        }
    });
};

function deleteBooking(bookingId, callback) {
    const url = '/api/booking';
    const booking_info = { 'bookingId': bookingId }
    fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(booking_info)
    }).then((res) => {
        return res.json()
    }).then((del) => {
        callback(del);
    })
};

function uploadPlan(plan_option){
    const url = '/api/plan';
    const plan = {'plan': plan_option}
    fetch(url,{
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(plan)
    }).then((res)=>{
        console.log(res);
    })
};


// view
function renderUpload(img_address) {
    const img_box = document.querySelector('.img-box');
    img_box.innerHTML = ''
    const img = document.createElement('img');
    img.setAttribute('src', img_address);
    img.className = 'mem-photo';
    img_box.appendChild(img);
};

function renderMemberInfo(data) {
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
    if (active_check) {
        active.appendChild(document.createTextNode('開通'))
        mem_active.appendChild(active);
    } else {
        active.appendChild(document.createTextNode('未開通'))
        active.className = 'active-format';
        const active_btn = document.createElement('button');
        active_btn.id = 'payment-active-btn'
        active_btn.className = 'btn class-btn';
        active_btn.appendChild(document.createTextNode('開通'))
        mem_active.appendChild(active);
        mem_active.appendChild(active_btn)
    }

    if(data.plan === null || data.plan ===0){ // 用google登入
        const plan_btn = document.createElement('button');
        plan_btn.id = 'plan-btn'
        plan_btn.className = 'btn class-btn';
        plan_btn.appendChild(document.createTextNode('選擇方案'))
        mem_plan.appendChild(plan_btn);
        planBtnProcess();
    } else {
        plan.appendChild(document.createTextNode(format_plan))
        mem_plan.appendChild(plan);
    }
    email.appendChild(document.createTextNode(data.email));
    
    let image_address = data.image;
    if (image_address !== null) { // null就是使用者沒有上傳照片
        img.setAttribute('src', image_address);
        img.className = 'mem-photo';
        img_box.appendChild(img);
    }
    mem_email.appendChild(email);
    
    activeProcess();
};

function plan_transform(plan) {
    if (plan === 888) {
        return '入門版';
    } else if (plan === 1000) {
        return '專業版';
    }
};

function check_active(active) {
    if (active === 'yes') {
        return true
    } else if (active === 'no') {
        return false
    }
};

function renderBookingClass(data, btn_or_not) {
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
    if (btn_or_not) {
        btn.appendChild(document.createTextNode('取消預定'))
        btn_box.appendChild(btn)
    } else {
        btn_box.appendChild(document.createTextNode('-'))
    }
    time.appendChild(document.createTextNode(data.class_time));
    class_.appendChild(document.createTextNode(data.class_name));
    teacher.appendChild(document.createTextNode(data.teacher));
    room.appendChild(document.createTextNode(data.room));

    booking_class.appendChild(time)
    booking_class.appendChild(class_)
    booking_class.appendChild(teacher)
    booking_class.appendChild(room)
    booking_class.appendChild(btn_box)
    booking_box.appendChild(booking_class)
};

function renderHistory(data, search_days) {
    const booking_box = document.querySelector(`#history-booking-box-${search_days}`);
    const booking_class = document.createElement('div');
    const time = document.createElement('div');
    const class_ = document.createElement('div');
    const teacher = document.createElement('div');
    const room = document.createElement('div');
    const status = document.createElement('div');
    booking_class.id = data.bookingId;
    booking_class.className = 'booking-class'
    time.className = 'time';
    class_.className = 'class';
    teacher.className = 'teacher';
    room.className = 'room';
    status.className = 'status';
    time.appendChild(document.createTextNode(data.class_time));
    class_.appendChild(document.createTextNode(data.class_name));
    teacher.appendChild(document.createTextNode(data.teacher));
    room.appendChild(document.createTextNode(data.room));
    status.appendChild(document.createTextNode('-'));
    booking_class.appendChild(time);
    booking_class.appendChild(class_);
    booking_class.appendChild(teacher);
    booking_class.appendChild(room);
    booking_class.appendChild(status);
    booking_box.appendChild(booking_class);
};

function renderErrMsg(){
    const option_msg = document.querySelector('.option-msg');
    option_msg.innerHTML = '';
    option_msg.appendChild(document.createTextNode('請選擇方案'))  
};

function renderStatementMsg(msg){
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
