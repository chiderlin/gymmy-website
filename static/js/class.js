// controller
const get_route = location.pathname
let classId = get_route.split('/')[2]
classId = parseInt(classId);
let class_info;
let check_login = false;
let check_active;
const overlay_statement = document.querySelector('.overlay-statement');

init();
function init() {
    getClassData();
    checkLogIn();
};

// 預定按鈕流程
function checkBookingBtn(weekday){
    const overlay_login = document.querySelector('.overlay-login');
    const booking_btn = document.getElementById('booking-btn');
    let today_weekday = new Date().getDay();
    // 今天不可預定
    if(today_weekday ===0){
        today_weekday = 7;
    }
    if(weekday === today_weekday){
        booking_btn.disabled = true;
    }

    booking_btn.addEventListener('click',()=>{
        //判斷有沒有登入
        //判斷有沒有繳費
        // 呼叫booking api
        if(check_login) {
            if(check_active === 'yes') {
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
}


//提示視窗關閉按鈕
const close_btn = document.getElementById('close-btn');
const close_btn_for_img_statement = document.getElementById('close-btn-for-img-statement');
close_btn.addEventListener('click',()=>{
    overlay_statement.style.display = 'none';
})
close_btn_for_img_statement.addEventListener('click',()=>{
    overlay_statement.style.display = 'none';
})




//model
function checkLogIn(){
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        console.log(api_data);
        if(api_data.data !== null) {
            check_login = true;
            check_active = api_data.data.active;
        }
    })
}

// 先取得課程資料 => 重新寫入booking db 
function getClassData(){
    const url = `/api${get_route}`
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        class_info = api_data;
        console.log(class_info)
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
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify(class_data),
    }).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        return cb(api_data);
    });
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
    // desc = desc.replace(' ','');
    // desc = desc.replaceAll('。', '。\n\n')
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
    // image.className = 'img-fluid';
    image.setAttribute('src', img);
    class_img_block.appendChild(image);
    booking_btn.appendChild(document.createTextNode('預定課程'))
    class_booking_btn_blcok.appendChild(booking_btn)
}

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