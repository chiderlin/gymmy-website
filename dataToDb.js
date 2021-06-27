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
    console.log(class_data.data.length);
    for(let j=0; j<class_data.data.length; j++) {
        let class_ =  class_data.data[j].class;
        for(let i=0; i<class_.length; i++) {
            // clean time first
            const time = class_[i].class_time;
            let start_time = time.slice(0,4);
            let end_time = time.slice(5,9);
            let start_time_str = '';
            let end_time_str = '';
            for(let i=0; i<end_time.length; i++) {
                if(i===2) {
                    end_time_str += ':'+ end_time[i];
                    start_time_str += ':'+ start_time[i];
                }else {
                    end_time_str += end_time[i];
                    start_time_str += start_time[i];

                }
            }
            const weekday = class_[i].weekday
            start_time = new Date(`2021-06-26T${start_time_str}`)
            end_time = new Date(`2021-06-26T${end_time_str}`);
            const class_name_zh = class_[i].class_name_zh
            const class_name_eng = class_[i].class_name_eng
            const class_teacher = class_[i].class_teacher
            const class_room = class_[i].class_room
            const desc = class_[i].desc
            const img = class_[i].img
            insert(Classes, {
                weekday: weekday,
                start_time: start_time,
                end_time: end_time,
                class_time: time,
                class_name_zh: class_name_zh,
                class_name_eng: class_name_eng,
                class_teacher: class_teacher,
                class_room: class_room,
                desc: desc,
                img: img.toString(),
            })
        }
    }
});