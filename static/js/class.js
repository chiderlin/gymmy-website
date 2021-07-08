// controller
const get_route = location.pathname
let classId = get_route.split('/')[2]
classId = parseInt(classId);
let class_info;

init();
function init() {
    get_class_data();
};


const booking_btn = document.getElementById('booking-btn');
booking_btn.addEventListener('click',()=>{
    // 呼叫booking api
    booking();
    
});


//model
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
        render(class_name_zh, desc, img);
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
function render(class_name_zh, desc, img){
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