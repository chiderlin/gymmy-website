const fs = require('fs');
const db = require('./db_module.js');
const Classes = db.Classes;
const insert = db.insert_data;

function readFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
        const class_data = JSON.parse(data);
        return callback(class_data)
    });
};

// 非同步 所以在這邊是undifined
// console.log(class_data);

readFile('./data/taipei-101', function (class_data) { // callback回來的json data

    for (let i = 0; i < class_data.data.length; i++) {
        const time = class_data.data[i].class_time;
        const class_name_zh = class_data.data[i].class_name_zh;
        const class_name_eng = class_data.data[i].class_name_eng;
        const class_teacher = class_data.data[i].class_teacher;
        const class_room = class_data.data[i].class_room;
        const desc = class_data.data[i].desc;
        const img = class_data.data[i].img;

        //writing data into db.
        insert(Classes, {
            class_time: time,
            class_name_zh: class_name_zh,
            class_name_eng: class_name_eng,
            class_teacher: class_teacher,
            class_room: class_room,
            desc: desc,
            img: img.toString(),
        })

    }
})