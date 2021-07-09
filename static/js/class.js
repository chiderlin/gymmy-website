// controller
const get_route = location.pathname
let classId = get_route.split('/')[2]
classId = parseInt(classId);
let class_info;
let check_login = false;
let check_active;
init();
function init() {
    get_class_data();
    checkLogIn();
};

const overlay_login = document.querySelector('.overlay-login');
const booking_btn = document.getElementById('booking-btn');
booking_btn.addEventListener('click',()=>{
    //判斷有沒有登入
    //判斷有沒有繳費
    // 呼叫booking api
    if(check_login) {
        if(check_active === 'yes') {
            const current_weekday = new Date().getDay()
            if(class_info.weekday !== current_weekday){ //可以訂不是今天的課程
                booking();
            } else {
                console.log('今日課程已不開放預訂')
            }

        } else {
            // 跳出視窗確認是否要完成繳費程序 （提醒視窗我還沒做）
            console.log('請完成繳費程序')
        }
    } else {
        // 展開login頁面
        overlay_login.style.display = 'block';
    }

    
});


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
function get_class_data(){
    const url = `/api${get_route}`
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        class_info = api_data;
        console.log(class_info)
        const class_name_zh = api_data.class_name_zh;
        const desc = api_data.desc;
        const img = api_data.img;
        render_class(class_name_zh, desc, img);
    }).catch((err)=>{
        console.log(err);
    });
};
function booking(){
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
        console.log(api_data);
    });
};


//view
function render_class(class_name_zh, desc, img){
    const title_name = document.querySelector('.title-name');
    const desc_box = document.querySelector('.desc-box');
    let p;
    const class_img_block = document.querySelector('.class-img-block');
    const image = document.createElement('img');
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
}