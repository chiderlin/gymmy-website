let tmp;
let socket = io.connect('0.0.0.0:3001');

init();
function init() {
    getClassList();
};

socket.on('test', (msg)=>{
    const test = document.getElementById('test');
    test.innerHTML = '';
    test.textContent = msg;

})




function getClassList() {
    const url = '/api/class';
    fetch(url).then((res) => {
        return res.json();
    }).then((api_data) => {
        const data = api_data.data;
        for (let i = 0; i < data.length; i++) {

            let renderBox = {
                'id':data[i].id,
                'weekday':data[i].weekday,
                'time':data[i].class_time,
                'title_zh':data[i].class_name_zh,
                'title_en':data[i].class_name_eng,
                'teacher':data[i].class_teacher,
                'room':data[i].class_room,
                'start_time':data[i].start_time,
                'end_time':data[i].end_time
            }
            renderBigClass(renderBox);
            renderSmallClass(renderBox);
            // let test = start_time.substring(10,15);            

        }
    }).catch((err)=>{
        console.log(err);
    })
};

// view
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


    socket.on('current class', (msg)=>{
        // 上課中 => 如何讓它變成動態的？？？ socket.io如何實現
        // const current = new Date();
        const current = new Date(msg);
        console.log(current);
        // let firstDate = new Date(current.getFullYear(), current.getMonth(), 1); // 取得這個月第一天
        const current_day = current.getDay();
        if(renderBox.weekday === current_day) { 
            const current_hour = current.getHours();
            const current_min = current.getMinutes();

            const start_hour = new Date(renderBox.start_time).getHours();
            const start_min = new Date(renderBox.start_time).getMinutes();
            const end_hour = new Date(renderBox.end_time).getHours();
            const end_min = new Date(renderBox.end_time).getMinutes();
            // console.log(current_hour)
            // console.log(start_hour)
            // console.log(renderBox.title_zh)
            // 小時/分鐘都要比對 
            if(start_hour<current_hour){
                // console.log(renderBox.title_zh)
                if(current_hour<end_hour){
                    class_block.classList.add('active-class');
                    class_block.appendChild(current_class)
                } else if (current_hour === end_hour) {
                    if(current_min<end_min){
                        class_block.classList.add('active-class');
                        class_block.appendChild(current_class)
                    }
                }
            } else if(start_hour===current_hour) {
                // console.log(renderBox.title_zh)

                if(start_min<=current_min){
                    if(current_hour<end_hour){
                        class_block.classList.add('active-class');
                        class_block.appendChild(current_class)
                    } else if (current_hour === end_hour) {
                        if(current_min<end_min){
                            class_block.classList.add('active-class');
                            class_block.appendChild(current_class)
                        } else if(current_min >= end_min) {
                            class_block.classList.remove('active-class');
                            class_block.appendChild(current_class)
                        }
                    }
                }
            }
        }
    })
    
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
};
