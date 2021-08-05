
let all_class_data; 
let selected_classId;
let current_class_data;
let index = 1;
let student_amount;
let per_class_booking_student;
let all_student_list;
let token;

init();

// controller
function init() {
    getJwtToken();
    getAllClass();
    checkLogIn();
    getStudentList();
};

function getJwtToken(){
    document.cookie.split('; ').find(row=>{
        let jwt = row.startsWith('jwt')
        if(jwt){
            token = row.split('=')[1];
            // break;
        } else {
            token = null
        }
    })
};

function selectDay() {
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
    renderStudentList(all_student_list, day);
};

//TODO:選取課程=>查詢=>取得學員名單
function selectClass(){
    selected_classId = document.getElementById('select_class').value;
    getSelectedClass(selected_classId,(res)=>{ //傳classId過去
        const class_name_zh = res.class_name_zh
        renderClassTitle(class_name_zh)
    })

};

// 查詢按鈕，fetch booking get (where classId=後台classId，關聯UserId)，選取user-name & email 
const class_btn = document.querySelector('.class-btn');
class_btn.addEventListener('click',(e)=>{
    bookedStudent(selected_classId)
});

// 新增按鈕
const overlay_statement = document.querySelector('.overlay-statement');
const add_btn = document.getElementById('add-btn');
add_btn.addEventListener('click',()=>{
    overlay_statement.style.display = 'block';
});

// 確認新增按鈕
const confirm_btn = document.getElementById('check-btn');
confirm_btn.addEventListener('click',()=>{
    let checkedUser = [];
    const checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    for(let i=0; i<checkboxes.length; i++){
        const userId = parseInt(checkboxes[i].value);
        if(per_class_booking_student !== null){
            for(let j=0; j<per_class_booking_student.length; j++){
                if(per_class_booking_student[j].userId === userId){
                    // booking之前先check這個人是否已經在上面列表
                    renderErrMsg('學員重複預定');
                    return 
                }
            }
        }
        checkedUser.push(userId)
    }

    if(checkboxes.length !==0){
        // booking之前先check課堂人數是否滿15人
        if(student_amount+checkboxes.length>15 || student_amount===15){
            renderErrMsg('每堂課最多預定15人');
            return 
        }

        //post資料到後端，在booking新增此學員到此課程
        booking(checkedUser,(res)=>{
            if(res.ok === true){
                bookedStudent(selected_classId) // 直接更新表單顯示出來，
                emptySelected(checkboxes) //清空student list選過的資料＆顯示的訊息
            }
        })
    } else { //新增的地方沒有選取任何學員
        renderErrMsg('請選擇要增加的學員');
        return ;
    }
});

function emptySelected(checkboxes){
    overlay_statement.style.display = 'none';
    for(let i=0; i<checkboxes.length; i++){
        checkboxes[i].checked = false
    }
    const add_msg = document.querySelector('.add-msg');
    add_msg.innerHTML = ''
};

// 關閉按鈕
const close_btn_for_img_statement = document.getElementById('close-btn-for-img-statement');
close_btn_for_img_statement.addEventListener('click',()=>{
    overlay_statement.style.display = 'none';
});

const delete_btn = document.getElementById('delete-btn');
delete_btn.addEventListener('click',()=>{
    let checked = [];
    const checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

    for(let i=0; i<checkboxes.length; i++){
        const bookingId = parseInt(checkboxes[i].value);
        checked.push(bookingId)
    }
    if(checkboxes.length !==0){
        if(window.confirm("確定要刪除此預約課程嗎?") == true) {
            deleteStudent(checked, (del)=>{
                if(del.ok === true) {
                    bookedStudent(selected_classId) // 直接更新表單顯示出來，
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

function renderBookedStudent(data){
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

function renderStudentList(data, selected_day){
    const student_list = document.querySelectorAll('.student-list');
    const statement_page = document.querySelector('.statement-page');
    if(student_list !== null){ //先check有無render的資料，有先清空
        for(let i=0; i<student_list.length; i++){
            statement_page.removeChild(student_list[i]);
        };
    };

    for(let i=0; i<data.length;i++){ // 六日方案888的學員不能顯示在增加名單裡面
        if(selected_day === 6 || selected_day===7){
            if(data[i].plan === 888){
                continue;
            }
        }
        const check_btn = document.querySelector('.check-btn')
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
        statement_page.insertBefore(member, check_btn)
    }
};

function renderClassTitle(class_name_zh){
    const member_block = document.querySelector('.member-block');
    const class_title = document.querySelector('.class-title');
    class_title.innerHTML = '';
    const member_box = document.querySelector('.member-box');
    class_title.appendChild(document.createTextNode(`課程：${class_name_zh}`));
    member_block.insertBefore(class_title,member_box);
};

function renderErrMsg(msg){
    const add_msg = document.querySelector('.add-msg');
    add_msg.innerHTML = '';
    add_msg.appendChild(document.createTextNode(msg));
};


// model
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
        if(api_data.data === null) {
            window.location.href = '/backside-login'
        }
    })
};

function logout(){
    const url = '/api/user';
    fetch(url,{
        method: "DELETE",
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`
        }
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
    });
};

function bookedStudent(classId){
    const url = `/api/booking/student/${classId}`
    fetch(url,{
        method: "GET",
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then((res)=>{
        return res.json();
    })
    .then((api_data)=>{
        const data = api_data.data;
        if(data === null){
            student_amount = 0;
        } else {
            student_amount = api_data.data.length
        }
        per_class_booking_student = data;
        renderBookedStudent(data); // 因為要清空原本的list所以不管data有沒有null都要跑

    })
};

function deleteStudent(checked, callback){
    const url = '/api/booking';
    for(let i=0; i<checked.length; i++){
        const booking_info = {'bookingId':checked[i]}
        fetch(url,{
            method:"DELETE",
            credentials: 'include',
            headers:{
                "Content-Type":"application/json",
                'Authorization': `Bearer ${token}`
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
    fetch(url,{
        method: "GET",
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res)=>{
        return res.json()
    }).then((api_data)=>{
        const data = api_data.data
        all_student_list = data;
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
            credentials: 'include',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
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