
let tmp;
let socket = io();
let booking_list = []
let count = 0;

// controller
init();
function init() {
    getClassList()
};

//用/api/booking/student 查看人數，render對應的資料在網頁上
//1.可預約
//2.已額滿
//3.當日不可預約

//model
function getClassList() {
    const url = '/api/class';
    fetch(url).then((res) => {
        return res.json();
    }).then(async (api_data) => {
        const data = api_data.data;
        class_data = data;
        for (let i = 0; i < class_data.length; i++) {//再一起render
            let renderBox = {
                'id': class_data[i].id,
                'weekday': class_data[i].weekday,
                'time': class_data[i].class_time,
                'title_zh': class_data[i].class_name_zh,
                'title_en': class_data[i].class_name_eng,
                'teacher': class_data[i].class_teacher,
                'room': class_data[i].class_room,
                'start_time': class_data[i].start_time,
                'end_time': class_data[i].end_time
            }
            renderBigClass(renderBox)
            renderSmallClass(renderBox)
        }
        // changeLoadingStatus()

    }).catch((err) => {
        console.log(err);
    })
};

function bookingStudent(classId, weekday, class_block) {
    const url = `/api/booking/student/${classId}`
    fetch(url)
        .then(res => res.json())
        .then((api_data) => {
            const data = api_data.data;
            let today_weekday = new Date().getDay();
            if (today_weekday === 0) {
                today_weekday = 7;
            }
            if (weekday === today_weekday) {
                renderBookingStatus('不可預定', class_block);

            } else {

                if (data === null) {
                    renderBookingStatus('可預約', class_block);
                } else {
                    let people = api_data.data.length
                    if (people >= 15) {
                        renderBookingStatus('已額滿', class_block);
                    } else {
                        renderBookingStatus('可預約', class_block);
                    }
                }
            }
        })
};



//view
function renderBigClass(renderBox) {

    const column = document.getElementById(renderBox.weekday);
    const container = document.getElementById('class-plan-big');
    const class_block = document.createElement('div');
    const link = document.createElement('a');
    const time = document.createElement('div');
    const title_zh = document.createElement('div');
    const title_en = document.createElement('div');
    const teacher = document.createElement('div');
    const classroom = document.createElement('div');
    const current_class = document.createElement('div');
    current_class.appendChild(document.createTextNode('上課中'));

    current_class.className = 'current-class';
    class_block.className = 'class-block';
    link.setAttribute('href', `/class/${renderBox.id}`)
    time.className = 'time';
    title_zh.className = 'title-zh';
    title_en.className = 'title-en';
    teacher.className = 'teacher';
    classroom.className = 'class-room';
    time.appendChild(document.createTextNode(renderBox.time));
    title_zh.appendChild(document.createTextNode(renderBox.title_zh));
    title_en.appendChild(document.createTextNode(renderBox.title_en));
    teacher.appendChild(document.createTextNode(renderBox.teacher));
    classroom.appendChild(document.createTextNode(renderBox.room));
    class_block.appendChild(time);
    class_block.appendChild(title_zh);
    class_block.appendChild(title_en);
    class_block.appendChild(teacher);
    class_block.appendChild(classroom);
    link.appendChild(class_block);
    column.appendChild(link);
    container.appendChild(column);
    const compare_time = {
        'weekday': renderBox.weekday,
        'start_time': renderBox.start_time,
        'end_time': renderBox.end_time
    }
    socket_listener(class_block, current_class, compare_time)
    bookingStudent(renderBox.id, renderBox.weekday, class_block)
    setInterval(() => {
        socket_listener(class_block, current_class, compare_time)
    }, 1000*60);
};

function socket_listener(block, current_class, compare_time) {

    const current = new Date();
    let current_day = current.getDay();
    if (current_day === 0) {
        current_day = 7;
    }
    if (compare_time.weekday === current_day) {
        const current_hour = current.getHours();
        const current_min = current.getMinutes();
        const start_hour = new Date(compare_time.start_time).getHours();
        const start_min = new Date(compare_time.start_time).getMinutes();
        const end_hour = new Date(compare_time.end_time).getHours();
        const end_min = new Date(compare_time.end_time).getMinutes();

        // 小時/分鐘都要比對 
        if (start_hour < current_hour) {
            if (current_hour < end_hour) {
                block.classList.add('active-class');
                block.appendChild(current_class)
            } else if (current_hour === end_hour) {
                if (current_min < end_min) {
                    block.classList.add('active-class');
                    block.appendChild(current_class)
                }
            }
        } else if (start_hour === current_hour) {
            if (start_min <= current_min) {
                if (current_hour < end_hour) {

                    block.classList.add('active-class');
                    block.appendChild(current_class)
                } else if (current_hour === end_hour) {
                    if (current_min < end_min) {

                        block.classList.add('active-class');
                        block.appendChild(current_class)
                    } else if (current_min === end_min) {
                        current_class.innerHTML = '';
                        block.classList.remove('active-class');
                        block.appendChild(current_class)
                    }
                }
            }
        }
    }


    // socket.on('current class', (msg)=>{

    //     const current = new Date(msg);
    //     let current_day = current.getDay();
    //     if(current_day === 0){
    //         current_day = 7;
    //     }
    //     if(compare_time.weekday === current_day) { 
    //         const current_hour = current.getHours();
    //         const current_min = current.getMinutes();
    //         const start_hour = new Date(compare_time.start_time).getHours();
    //         const start_min = new Date(compare_time.start_time).getMinutes();
    //         const end_hour = new Date(compare_time.end_time).getHours();
    //         const end_min = new Date(compare_time.end_time).getMinutes();

    //         // 小時/分鐘都要比對 
    //         if(start_hour<current_hour){
    //             if(current_hour<end_hour){
    //                 block.classList.add('active-class');
    //                 block.appendChild(current_class)
    //             } else if (current_hour === end_hour) {
    //                 if(current_min<end_min){
    //                     block.classList.add('active-class');
    //                     block.appendChild(current_class)
    //                 }
    //             }
    //         } else if(start_hour===current_hour) {
    //             if(start_min<=current_min){
    //                 if(current_hour<end_hour){

    //                     block.classList.add('active-class');
    //                     block.appendChild(current_class)
    //                 } else if (current_hour === end_hour) {
    //                     if(current_min<end_min){

    //                         block.classList.add('active-class');
    //                         block.appendChild(current_class)
    //                     } else if(current_min === end_min) {
    //                         current_class.innerHTML = '';
    //                         block.classList.remove('active-class');
    //                         block.appendChild(current_class)
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // })
};

function renderSmallClass(renderBox) {
    let weekday;
    if (renderBox.weekday === 1) {
        weekday = "Mon";
    } else if (renderBox.weekday === 2) {
        weekday = "Tue";
    } else if (renderBox.weekday === 3) {
        weekday = "Wed";
    } else if (renderBox.weekday === 4) {
        weekday = "Thu";
    } else if (renderBox.weekday === 5) {
        weekday = "Fri";
    } else if (renderBox.weekday === 6) {
        weekday = "Sat";
    } else if (renderBox.weekday === 7) {
        weekday = "Sun";
    }
    const row = document.getElementById(weekday);
    const col_6 = document.createElement('div');
    const link = document.createElement('a');
    const col_12 = document.createElement('div');
    const time = document.createElement('div');
    const title_zh = document.createElement('div');
    const title_en = document.createElement('div');
    const teacher = document.createElement('div');
    const classroom = document.createElement('div');
    const current_class = document.createElement('div');
    current_class.appendChild(document.createTextNode('上課中'));

    current_class.className = 'current-class';
    link.setAttribute('href', `/class/${renderBox.id}`);
    col_6.className = 'col-6';
    col_12.className = 'col-sm-12 class-format'
    time.className = 'time';
    title_zh.className = 'title-zh';
    title_en.className = 'title-en';
    teacher.className = 'teacher';
    classroom.className = 'class-room';
    time.appendChild(document.createTextNode(renderBox.time));
    title_zh.appendChild(document.createTextNode(renderBox.title_zh));
    title_en.appendChild(document.createTextNode(renderBox.title_en));
    teacher.appendChild(document.createTextNode(renderBox.teacher));
    classroom.appendChild(document.createTextNode(renderBox.room));
    col_12.appendChild(time);
    col_12.appendChild(title_zh);
    col_12.appendChild(title_en);
    col_12.appendChild(teacher);
    col_12.appendChild(classroom);
    link.appendChild(col_12);
    col_6.appendChild(link);
    row.appendChild(col_6);

    const compare_time = {
        'weekday': renderBox.weekday,
        'start_time': renderBox.start_time,
        'end_time': renderBox.end_time
    }
    socket_listener(col_12, current_class, compare_time)
    setInterval(() => {
        socket_listener(col_12, current_class, compare_time)
    }, 1000*60);
    bookingStudent(renderBox.id, renderBox.weekday, col_12)
};

function renderBookingStatus(msg, class_block) {
    const status = document.createElement('div');
    status.className = 'status'
    if (msg === '已額滿') {
        status.style.backgroundColor = 'red';
    } else if (msg === '可預約') {
        status.style.backgroundColor = 'green';
    } else if (msg === '不可預定') {
        status.style.backgroundColor = 'orange';
    }
    status.appendChild(document.createTextNode(msg));
    class_block.appendChild(status);
};




//=================
// renderBigClass裡面的內容： 不用了
    // const status = document.createElement('div');
    // status.className = 'status'
    // class_block.appendChild(status);
    // let today = new Date().getDay()
    // if(today === 0){
    //     today = 7;
    // }
    // if(today === renderBox.weekday) {
    //     status.style.backgroundColor = 'orange';
    //     status.appendChild(document.createTextNode('不可預定'));
    // } else {
    //     if(booking_list[count]>=15){
    //         status.style.backgroundColor = 'red';
    //         status.appendChild(document.createTextNode('已額滿'));
    //     } else {
    //         status.style.backgroundColor = 'green';
    //         status.appendChild(document.createTextNode('可預約'))
    //     }
    // }


    // renderSmallClass裡面的內容： 不用了
    // const status = document.createElement('div');
    // let today = new Date().getDay()
    // if(today === 0){
    //     today = 7;
    // }
    // if(today === renderBox.weekday) {
    //     status.style.backgroundColor = 'orange';
    //     status.appendChild(document.createTextNode('不可預定'));
    // } else {
    //     if(booking_list[count]>=15){
    //         status.style.backgroundColor = 'red';
    //         status.appendChild(document.createTextNode('已額滿'));
    //     } else {
    //         status.style.backgroundColor = 'green';
    //         status.appendChild(document.createTextNode('可預約'))
    //     }
    // }
    // col_12.appendChild(status);



// async function bookingStudent(classId){ //計算每堂課booking人數
//     const url = `/api/booking/student/${classId}`
//     await fetch(url)
//     .then(res=>res.json())
//     .then((api_data)=>{

//         const data = api_data.data;
//         let people;

//         if(data === null){
//             people = 0
//         } else{
//             people = data.length
//         }
//         booking_list.push(people)
//     });
// };
