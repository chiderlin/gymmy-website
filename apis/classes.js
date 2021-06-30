const express = require('express');
const router = express.Router();
const db = require('../db_module.js');
const Classes = db.Classes;
const get_data = db.get_data;
// const get_data_class = db.get_data_class;
const get_per_data = db.get_per_data;


router.get('/class', (req, res) => {
    try {
        get_data(Classes, function (data) {
            data = data.replace(/(?:\\[rn])+/g, ''); // 把\r\n replace
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {

                // 把時間覆蓋過去
                data[i].start_time = new Date(data[i].start_time).toLocaleString('chinese', { hour12: false });
                data[i].end_time = new Date(data[i].end_time).toLocaleString('chinese', { hour12: false });
            }
            const all_data = {
                "data": data,
            }
            return res.json(all_data);
        });
    } catch (e) {
        return res.status(500).json({ 'error': true, 'message': e });
    }

});

// router.get('/class/:weekday',(req,res)=>{
//     const weekday = req.params.weekday;
//     get_data_class(weekday, function(data){
//         console.log(data);
//         data = data.replace(/(?:\\[rn])+/g, ''); // 把\r\n replace
//         data = JSON.parse(data);
//         for(let i=0; i<data.length; i++) {
//             // 把時間覆蓋過去
//             data[i].start_time = new Date(data[i].start_time).toLocaleString('chinese',{hour12: false});
//             data[i].end_time = new Date(data[i].end_time).toLocaleString('chinese',{hour12: false});
//         }
//         const all_data = {
//             "data": data,
//         }
//         return res.json(all_data);
//     })
// })



router.get('/class/:classId', (req, res) => {
    const classId = req.params.classId;
    try {
        get_per_data(Classes, classId, function (data) {
            if (data === 'null') {
                return res.json({ 'data': null });
            } else {
                data = data.replace(/(?:\\[rn])+/g, '');
                data = JSON.parse(data);
                return res.json(data);
            }
        })
    } catch (e) {
        return res.status(500).json({ 'error': true, 'message': e });
    }

});

module.exports = router;