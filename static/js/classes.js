
let tmp;

init();
function init() {
    getClassList();
};

function getClassList() {
    const url = '/api/class';
    fetch(url).then((res) => {
        return res.json();
    }).then((api_data) => {
        console.log(api_data);
        const data = api_data.data;
        for (let i = 0; i < data.length; i++) {
            const id = data[i].id;
            const weekday = data[i].weekday;
            const time = data[i].class_time;
            const title_zh = data[i].class_name_zh;
            const title_en = data[i].class_name_eng;
            const teacher = data[i].class_teacher;
            const room = data[i].class_room;
            renderBigClass(weekday, id, time, title_zh, title_en, teacher, room);
            renderSmallClass(weekday, id, time, title_zh, title_en, teacher, room);
        }
    }).then((err)=>{
        console.log(err);
    })
};

// view
function renderBigClass(weekday, id, class_time, class_name_zh, class_name_eng, class_teacher, class_room) {
    const column = document.getElementById(weekday);
    const container = document.getElementById('class-plan-big');
    const class_block = document.createElement('div');
    const link = document.createElement('a');
    const time = document.createElement('div');
    const title_zh = document.createElement('div');
    const title_en = document.createElement('div');
    const teacher = document.createElement('div');
    const classroom = document.createElement('div');
    class_block.className = 'class-block';
    link.setAttribute('href', `/class/${id}`)
    time.className = 'time';
    title_zh.className = 'title-zh';
    title_en.className = 'title-en';
    teacher.className = 'teacher';
    classroom.className = 'class-room';
    time.appendChild(document.createTextNode(class_time));
    title_zh.appendChild(document.createTextNode(class_name_zh));
    title_en.appendChild(document.createTextNode(class_name_eng));
    teacher.appendChild(document.createTextNode(class_teacher));
    classroom.appendChild(document.createTextNode(class_room));
    class_block.appendChild(time);
    class_block.appendChild(title_zh);
    class_block.appendChild(title_en);
    class_block.appendChild(teacher);
    class_block.appendChild(classroom);
    link.appendChild(class_block);
    column.appendChild(link);
    container.appendChild(column);
};

function renderSmallClass(weekday, id, class_time, class_name_zh, class_name_eng, class_teacher, class_room) {
    if (weekday === 1) {
        weekday = "Mon";
    } else if (weekday === 2) {
        weekday = "Tue";
    } else if (weekday === 3) {
        weekday = "Wed";
    } else if (weekday === 4) {
        weekday = "Thu";
    } else if (weekday === 5) {
        weekday = "Fri";
    } else if (weekday === 6) {
        weekday = "Sat";
    } else if (weekday === 7) {
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
    link.setAttribute('href', `/class/${id}`);
    col_6.className = 'col-6';
    col_12.className = 'col-sm-12 class-format'
    time.className = 'time';
    title_zh.className = 'title-zh';
    title_en.className = 'title-en';
    teacher.className = 'teacher';
    classroom.className = 'class-room';
    time.appendChild(document.createTextNode(class_time));
    title_zh.appendChild(document.createTextNode(class_name_zh));
    title_en.appendChild(document.createTextNode(class_name_eng));
    teacher.appendChild(document.createTextNode(class_teacher));
    classroom.appendChild(document.createTextNode(class_room));
    col_12.appendChild(time);
    col_12.appendChild(title_zh);
    col_12.appendChild(title_en);
    col_12.appendChild(teacher);
    col_12.appendChild(classroom);
    link.appendChild(col_12);
    col_6.appendChild(link);
    row.appendChild(col_6);
};