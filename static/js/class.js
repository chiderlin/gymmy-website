const get_route = location.pathname
let classId = get_route.split('/')[2]
classId = parseInt(classId);
let class_info;
let check_login = false;
let check_active;
let amount_of_class;
let student_amount;


// controller
init();
async function init() {
    getClassData();
    checkLogIn();
    await bookingStudent(classId);
    checkRender()
};

// 預定按鈕流程
function checkBookingBtn(weekday){
    const overlay_login = document.querySelector('.overlay-login');
    const booking_btn = document.getElementById('booking-btn');
    let today_weekday = new Date().getDay();
    if(today_weekday ===0){
        today_weekday = 7;
    }
    // 今天不可預定
    if(weekday === today_weekday){
        booking_btn.disabled = true;
    }

    booking_btn.addEventListener('click',()=>{
        //判斷有沒有登入
        //判斷有沒有繳費
        // 呼叫booking api
        if(check_login) {
            if(check_active === 'yes') {
                if(student_amount === 15) {
                    renderStatement('課程人數已額滿');
                    overlay_statement.style.display = 'block';
                    return
                }
                if(check_plan === 888){
                    if(weekday === 6 || weekday === 7){
                        renderStatement('方案入門版只能預定週一至週五課程');
                        overlay_statement.style.display = 'block';
                        return
                    }
                    if(amount_of_class === 22){
                        renderStatement('本月課程數量已達上限22堂');
                        overlay_statement.style.display = 'block';
                        return
                    }
                }
                booking((res)=>{
                    console.log(res);
                    if(res.ok === true){
                        renderStatement('完成預約');
                        overlay_statement.style.display = 'block';
                    } else if(res.error === true){
                        renderStatement(res.message);
                        overlay_statement.style.display = 'block';
                    }                 
                });

            } else {
                // 跳出視窗確認是否要完成繳費程序(提醒視窗)
                overlay_statement.style.display = 'block';
                renderStatement('請到會員中心完成開通帳號手續');
            }
        } else {
            // 展開login頁面
            overlay_login.style.display = 'block';
        }
    });
};


//model
function checkLogIn(){
    const url = '/api/user';
    fetch(url,{
        method: "GET",
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        console.log(api_data);
        if(api_data.data !== null) {
            check_login = true;
            check_active = api_data.data.active;
            check_plan = api_data.data.plan;
            if(check_plan === 888) {
                getBooking((class_count)=>{ 
                    amount_of_class = class_count
                });
            }

        }
    })
};

// 先取得課程資料 => 重新寫入booking db 
function getClassData(){
    const url = `/api${get_route}`
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        class_info = api_data;
        const weekday = class_info.weekday;
        const class_name_zh = api_data.class_name_zh;
        const desc = api_data.desc;
        const img = api_data.img;
        renderClass(class_name_zh, desc, img);
        checkBookingBtn(weekday)
    }).catch((err)=>{
        console.log(err);
    });
};

function booking(cb){
    const class_data= {
        'data':{
            'classId': class_info.id,
            'month': class_info.month,
            'weekday': class_info.weekday,
            'class_time':class_info.class_time,
            'start_time':class_info.start_time,
            'end_time':class_info.end_time,
            'class_name':class_info.class_name_zh,
            'teacher':class_info.class_teacher,
            'room': class_info.class_room,
        }
    };
    const url = '/api/booking'
    fetch(url,{
        method:"POST",
        credentials: 'include',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(class_data),
    }).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        return cb(api_data);
    });
};

function getBooking(cb){
    const url = '/api/booking'
    fetch(url,{
        method: "GET",
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        const data = api_data.data
        let current_month_class_amount = [] // for 888方案計算堂數
        if (data.length !== 0 && data !== "未登入") {
            for (let i = 0; i < data.length; i++) {
                // 判斷時間 
                const class_time = data[i].class_time.substring(0, 10)
                const class_month = new Date(class_time).getMonth()+1
                const current_month = new Date().getMonth()+1
                if(class_month === current_month) {
                    current_month_class_amount.push(data[i])
                }
            }
            cb(current_month_class_amount.length)
        }
    });
};

function bookingStudent(classId) {
    const url = `/api/booking/student/${classId}`
    fetch(url,{
        method: "GET",
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then((api_data) => {
            student_amount = api_data.data.length
        })
};


//view
function renderClass(class_name_zh, desc, img){
    const title_name = document.querySelector('.title-name');
    const desc_box = document.querySelector('.desc-box');
    let p;
    const class_img_block = document.querySelector('.class-img-block');
    const image = document.createElement('img');
    const class_booking_btn_blcok = document.querySelector('.class-booking');
    const booking_btn = document.createElement('button');
    booking_btn.className = 'btn btn-lg btn-hover';
    booking_btn.id = 'booking-btn';
    

    let list_desc = Array.from(desc);
    let str_desc = '';
    for(let i=0; i< list_desc.length; i++) {
        str_desc += list_desc[i];
        if(list_desc[i] === '。') {
            p = document.createElement('p');
            p.appendChild(document.createTextNode(str_desc))
            desc_box.appendChild(p);
            str_desc = '';
        }
        
    }
    title_name.appendChild(document.createTextNode(class_name_zh));
    image.className = 'img-class'
    // image.className = 'img-fluid';
    image.setAttribute('src', img);
    class_img_block.appendChild(image);
    booking_btn.appendChild(document.createTextNode('預定課程'))
    class_booking_btn_blcok.appendChild(booking_btn)
};

// render提示視窗
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

function checkRender() {
    const loading_circle = document.querySelector('.loading-box');
    loading_circle.style.display = 'none';
};