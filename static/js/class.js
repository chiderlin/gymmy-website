
const get_route = location.pathname
const url = `/api${get_route}`
init();
function init() {
    get_class_data();
};

function get_class_data(){
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        const class_name_zh = api_data.class_name_zh;
        const desc = api_data.desc;
        const img = api_data.img;
        render(class_name_zh, desc, img);
    }).catch((err)=>{
        console.log(err);
    });
};


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
    image.setAttribute('src', img);
    class_img_block.appendChild(image);
}