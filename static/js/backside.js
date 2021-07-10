let class_data; 
let selected_class;
let index = 1;
init();

// controll
function init() {
    get_class();
    checkLogIn();
};

function select_day() {
    // 如果有選過的話 先清空option選項(週一～週日)
    let option = document.querySelectorAll('option');
    if(option.length > 8) {
        for(let remove=9; remove<option.length; remove++) {
            option[remove].parentNode.removeChild(option[remove]);
        }
    }
    let day = document.getElementById('select_day').value;
    day = parseInt(day);
    if(class_data === undefined){return;} //防止還沒跑完init報錯
    for(let i=0; i<class_data.length; i++) {
        const weekday = class_data[i].weekday;
        if(day === weekday) {
            const class_id = class_data[i].id;
            const zh_name = class_data[i].class_name_zh;
            render_class(class_id,zh_name); // 再render
        }
    } 
};

//TODO:選取課程=>查詢=>取得學員名單
function select_class(){
    selected_class = document.getElementById('select_class').value;
};

// 查詢按鈕，fetch booking get (where classId=後台classId，關聯UserId)，選取user-name & email 
const class_btn = document.querySelector('.class-btn');
console.log(class_btn)
class_btn.addEventListener('click',(e)=>{
 
    check_student(selected_class)
});

// 刪除按鈕
const delete_btn = document.getElementById('delete-btn');
delete_btn.addEventListener('click',()=>{
    let checked = [];
    const checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    console.log(checkboxes);
    for(let i=0; i<checkboxes.length; i++){
        const bookingId = parseInt(checkboxes[i].value);
        checked.push(bookingId)
    }
    if(checkboxes.length !==0){
        if(window.confirm("確定要刪除此預約課程嗎?") == true) {
            deleteStudent(checked, (del)=>{
                if(del.ok === true) {
                    window.location.reload();
                }
            });
        }
    }
});

// view
function render_class(classid,zh_name){
    const select_class = document.getElementById('select_class');
    const option = document.createElement('option');
    option.value = classid;
    option.appendChild(document.createTextNode(zh_name));
    select_class.appendChild(option);
};

function render_student(data){
    const member_box = document.querySelector('.member-box');
    const member_check = document.querySelectorAll('.member'); 
    if(member_check.length !==0){ //先check有無render的資料，有先清空
        for(let i=0; i<member_check.length; i++){
            member_box.removeChild(member_check[i]);
        };
    };
    if(data !== null) { //確定有資料再跑迴圈
        for(let i=0; i<data.length; i++){
            const member = document.createElement('div');
            const checkbox = document.createElement('input');
            const num = document.createElement('div');
            const username = document.createElement('div');
            const email = document.createElement('div');
            member.className = 'member';
            checkbox.type = 'checkbox';
            checkbox.value = data.bookingId; // 用bookingId刪除
            num.className = 'num';
            username.className = 'username';
            email.className = 'email';
            num.appendChild(document.createTextNode(i+1))
            username.appendChild(document.createTextNode(data[i].username));
            email.appendChild(document.createTextNode(data[i].email));
            member.appendChild(checkbox);
            member.appendChild(num);
            member.appendChild(username);
            member.appendChild(email);
            member_box.appendChild(member);
        }
    }
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

function check_student(classId){
    const url = `/api/booking/student/${classId}`
    fetch(url)
    .then(res=>res.json())
    .then((api_data)=>{
        const data = api_data.data;
        console.log(api_data.data);
        render_student(data);
    })
};
function deleteStudent(checked, callback){
    const url = '/api/booking';
    for(let i=0; i<checked.length; i++){
        console.log(checked[i])
        const booking_info = {'bookingId':checked[i]}
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
    }

};
