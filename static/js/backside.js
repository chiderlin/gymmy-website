let class_data; 
init();

// controll
function init() {
    get_class();
    checkLogIn();
};
function select_day() {
    // 如果有選過的話 先清空option選項 
    let option = document.querySelectorAll('option');
    if(option.length > 8) {
        for(let remove=9; remove<option.length; remove++) {
            option[remove].parentNode.removeChild(option[remove]);
        }
    }
    let day = document.getElementById('select_day').value;
    day = parseInt(day);
    for(let i=0; i<class_data.length; i++) {
        const weekday = class_data[i].weekday;
        if(day === weekday) {
            const zh_name = class_data[i].class_name_zh;
            render_class(zh_name); // 再render
        }
    } 
};
function select_class(){
    const select_class = document.getElementById('select_class').value;

};


// view
function render_class(zh_name){
    const select_class = document.getElementById('select_class');
    const option = document.createElement('option');
    option.value = zh_name;
    option.appendChild(document.createTextNode(zh_name));
    select_class.appendChild(option);
};


// model
function checkLogIn(){
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        if(api_data.data === null) {
            window.location.href = '/backside-login'
        }
    })
};
function logout(){
    const url = '/api/user';
    fetch(url,{
        method: "DELETE",
    }).then((res)=>{
        return res.json();
    }).then((data)=>{
        window.location.href = '/backside-login';
    })
};

function get_class() {
    let url = 'api/class'
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        class_data = api_data.data;
    });
};

