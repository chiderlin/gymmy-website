const express = require('express');
const router = express.Router();
const db = require('../db_module.js');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const Classes = db.Classes;
// const app = express();
// const io = app.get('socket.io')




router.get('/class', (req, res) => {
    let io = req.app.get('socket.io');
    // console.log(io);
    io.on('connection',(socket)=>{
        console.log('a user connected');
        setInterval(() => {
            socket.emit('current class', new Date());
        }, 5000); //1秒
    })

    try {
        sequelize.sync().then(() => {
            Classes.findAll({
                order:[
                    ['weekday', 'asc'],
                    ['start_time', 'asc']
                ]
            }).then((res) => {
                return JSON.stringify(res, null, 4);
            }).then((data)=>{
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
            })
        }).catch((e)=>{
            e = e.toString();
            return res.status(500).json({ 'error': true, 'message': e });
        });
        
    } catch (e) {
        e = e.toString();
        return res.status(500).json({ 'error': true, 'message': e });
    }

});


router.get('/class/:classId', (req, res) => {
    const classId = req.params.classId;
    try {
        sequelize.sync().then(() => {
            Classes.findOne({
                where: {
                    id: classId,
                },
            }).then((res) => {
                return JSON.stringify(res, null, 4);
            }).then((data)=>{
                console.log(data);
                if (data === 'null') {
                    return res.json({ 'data': null });
                } else {
                    data = data.replace(/(?:\\[rn])+/g, '');
                    data = JSON.parse(data);
                    return res.json(data);
                }
            })
        }).catch((e)=>{
            e = e.toString();
            return res.status(500).json({ 'error': true, 'message': e });
        });

    } catch (e) {
        e = e.toString();
        return res.status(500).json({ 'error': true, 'message': e });
    }
});

module.exports = router;