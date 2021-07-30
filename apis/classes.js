const express = require('express');
const router = express.Router();
const db = require('../db_module.js');
const Classes = db.Classes;

// 照上課時間排小到大
router.get('/class', (req, res) => {
    try {
        Classes.findAll({
            order: [
                ['weekday', 'asc'],
                ['start_time', 'asc']
            ]
        }).then((res) => {
            return JSON.stringify(res, null, 4);
        }).then((data) => {
            data = data.replace(/(?:\\[rn])+/g, ''); // 把\r\n replace
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {
                // 把時間覆蓋過去
                data[i].start_time = new Date(data[i].start_time).toLocaleString('chinese', { hour12: false });
                data[i].end_time = new Date(data[i].end_time).toLocaleString('chinese', { hour12: false });            
            }
            const all_data = {
                data: data,
            }
            return res.json(all_data);
        })
    } catch (e) {
        e = e.toString();
        return res.status(500).json({ error: true, message: e });
    }

});

// 單一課程介紹
router.get('/class/:classId', (req, res) => {
    const classId = req.params.classId;
    try {
        Classes.findOne({
            where: {
                id: classId,
            },
        }).then((res) => {
            return JSON.stringify(res, null, 4);
        }).then((data) => {

            if (data === 'null') {
                return res.json({ data: null });
            } else {
                data = data.replace(/(?:\\[rn])+/g, '');
                data = JSON.parse(data);
                data.img = data.img.split(',')[0]
                return res.json(data);
            }
        })
    } catch (e) {
        e = e.toString();
        return res.status(500).json({ error: true, message: e });
    }
});

module.exports = router;