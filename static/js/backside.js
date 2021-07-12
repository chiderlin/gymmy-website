
let all_class_data; 
let selected_classId;
let current_class_data;
let index = 1;
init();

// controll
function init() {
    getAllClass();
    checkLogIn();
    getStudentList();
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
    if(all_class_data === undefined){return;} //防止還沒跑完init報錯
    for(let i=0; i<all_class_data.length; i++) {
        const weekday = all_class_data[i].weekday;
        if(day === weekday) {
            const class_id = all_class_data[i].id;
            const zh_name = all_class_data[i].class_name_zh;
            renderClass(class_id,zh_name); // 再render
        }
    } 
};

//TODO:選取課程=>查詢=>取得學員名單
function select_class(){
    selected_classId = document.getElementById('select_class').value;
    getSelectedClass(selected_classId,(res)=>{ //傳classId過去
        const class_name_zh = res.class_name_zh
        renderClassTitle(class_name_zh)
    })

};

// 查詢按鈕，fetch booking get (where classId=後台classId，關聯UserId)，選取user-name & email 
const class_btn = document.querySelector('.class-btn');
console.log(class_btn)
class_btn.addEventListener('click',(e)=>{
    checkStudent(selected_classId)
});

// 新增按鈕
const overlay_statement = document.querySelector('.overlay-statement');
const add_btn = document.getElementById('add-btn');
add_btn.addEventListener('click',()=>{
    overlay_statement.style.display = 'block';
})

// 確認新增按鈕
const confirm_btn = document.getElementById('close-btn');
confirm_btn.addEventListener('click',()=>{
    let checkedUser = [];
    const checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    console.log(checkboxes);
    for(let i=0; i<checkboxes.length; i++){
        const userId = parseInt(checkboxes[i].value);
        checkedUser.push(userId)
    }

    if(checkboxes.length !==0){
        //post資料到後端，在booking新增此學員到此課程
        //前端reload，在查看一次該課程，學員已新增
        booking(checkedUser,(res)=>{
            if(res.ok === true){
                window.location.reload();
            }
        })
    } else { //新增的地方沒有選取任何學員
        return ;
    }
});

// 關閉按鈕
const close_btn_for_img_statement = document.getElementById('close-btn-for-img-statement');
close_btn_for_img_statement.addEventListener('click',()=>{
    overlay_statement.style.display = 'none';
})



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
function renderClass(classid,zh_name){
    const select_class = document.getElementById('select_class');
    const option = document.createElement('option');
    option.value = classid;
    option.appendChild(document.createTextNode(zh_name));
    select_class.appendChild(option);
};

function renderStudent(data){
    console.log(data);
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
            checkbox.value = data[i].bookingId; // 用bookingId刪除
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

function renderStudentList(data){
    for(let i=0; i<data.length;i++){
        const statement_page = document.querySelector('.statement-page');
        const close_btn = document.querySelector('.close-btn')
        const member = document.createElement('div');
        const checkbox = document.createElement('input');
        const num = document.createElement('div');
        const username = document.createElement('div');
        const email = document.createElement('div');
        member.className = 'student-list';
        checkbox.type = 'checkbox';
        checkbox.value = data[i].userId; // 用userId新增資料
        num.className = 'num';
        username.className = 'username';
        email.className = 'email';
        num.appendChild(document.createTextNode(i+1))
        username.appendChild(document.createTextNode(data[i].name));
        email.appendChild(document.createTextNode(data[i].email));
        member.appendChild(checkbox);
        member.appendChild(num);
        member.appendChild(username);
        member.appendChild(email);
        statement_page.insertBefore(member, close_btn)
    }
};

function renderClassTitle(class_name_zh){
    const member_block = document.querySelector('.member-block');
    const class_title = document.querySelector('.class-title');
    class_title.innerHTML = '';
    const member_box = document.querySelector('.member-box');
    class_title.appendChild(document.createTextNode(`課程：${class_name_zh}`));
    member_block.insertBefore(class_title,member_box);
}



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

function getAllClass() {
    let url = 'api/class'
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        all_class_data = api_data.data;
        console.log(all_class_data)
    });
};

function checkStudent(classId){
    const url = `/api/booking/student/${classId}`
    fetch(url)
    .then(res=>res.json())
    .then((api_data)=>{
        const data = api_data.data;
        console.log(api_data.data);
        renderStudent(data);
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

function getStudentList(){
    const url = '/api/users';
    fetch(url).then((res)=>{
        return res.json()
    }).then((api_data)=>{
        console.log(api_data);
        const data = api_data.data
        renderStudentList(data);
    })
};

function booking(checkedUser, cb){
    for(let i=0;i<checkedUser.length;i++){
        const class_info= {
            'data':{
                'classId': current_class_data.id,
                'month': current_class_data.month,
                'weekday': current_class_data.weekday,
                'class_time':current_class_data.class_time,
                'start_time':current_class_data.start_time,
                'end_time':current_class_data.end_time,
                'class_name':current_class_data.class_name_zh,
                'teacher':current_class_data.class_teacher,
                'room': current_class_data.class_room,
                'userId':checkedUser[i]
            }
        };
        const url = '/api/booking'
        fetch(url,{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(class_info),
        }).then((res)=>{
            return res.json();
        }).then((api_data)=>{
            return cb(api_data);
        });

    }
};

function getSelectedClass(classId, cb){
    const url = `/api/class/${classId}`;
    fetch(url).then((res)=>{
        return res.json()
    }).then((data)=>{
        current_class_data = data;
        return cb(data);
    })
};