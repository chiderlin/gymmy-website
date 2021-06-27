const Tue = document.getElementById('Tue');
const Wed = document.getElementById('Wed');
const Thu = document.getElementById('Thu');
const Fri = document.getElementById('Fri');
const Sat = document.getElementById('Sat');
const Sun = document.getElementById('Sun');
let tmp;

init();
function init(){
    getClassList();
};

function getClassList(){
    const url = '/api/class';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        const data = api_data.data;
        console.log(data);
        for(let i=0; i<data.length; i++) {
            const id = data[i].id;
            const class_time = data[i].class_time;
            const class_name_zh = data[i].class_name_zh;
            const class_name_eng = data[i].class_name_eng;
            const class_teacher = data[i].class_teacher;
            const class_room = data[i].class_room;
            renderBigClass(class_time,class_name_zh,class_name_eng,class_teacher,class_room);
            renderSmallClass(class_time,class_name_zh,class_name_eng,class_teacher,class_room);
        }
    })
};
let column = document.getElementById("Mon");
// view
function renderBigClass(class_time,class_name_zh,class_name_eng,class_teacher,class_room) {
    let time_text = class_time.slice(5,9);
    let compare_time = '';

    for(let i=0; i<time_text.length; i++) {
        if(i===2) {
            compare_time += ':'+ time_text[i];
        }else {
            compare_time += time_text[i];
        }
    }
    let compareTime = new Date(`2021-06-26T${compare_time}`);
    
    if(tmp === undefined){
        tmp = compareTime
    } else {
        if(compareTime<tmp){
            column = document.createElement('div');
            column.className = 'column'
            tmp = compareTime
        } else if (compareTime>tmp){
            tmp = compareTime
        }
    }
    
    
    const container = document.getElementById('class-plan-big');
    const class_block = document.createElement('div');
    const time = document.createElement('div');
    const title_zh = document.createElement('div');
    const title_en = document.createElement('div');
    const teacher = document.createElement('div');
    const classroom = document.createElement('div');
    class_block.className = 'class-block';
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
    column.appendChild(class_block);
    container.appendChild(column);
};

function renderSmallClass(class_time,class_name_zh,class_name_eng,class_teacher,class_room){

};