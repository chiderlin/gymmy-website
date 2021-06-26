const Tue = document.getElementById('Tue');
const Wed = document.getElementById('Wed');
const Thu = document.getElementById('Thu');
const Fri = document.getElementById('Fri');
const Sat = document.getElementById('Sat');
const Sun = document.getElementById('Sun');

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
        for(let i=0; i<20; i++) {
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



// view
function renderBigClass(class_time,class_name_zh,class_name_eng,class_teacher,class_room) {
    const Mon = document.getElementById('Mon');
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
    Mon.appendChild(class_block);
    

};

function renderSmallClass(class_time,class_name_zh,class_name_eng,class_teacher,class_room){

};