const express = require('express');
const router = express.Router();
const db = require('../db_module.js');
const Booking = db.Booking;
const User = db.User;
const moment = require('moment');
const auth = require('../middleware/auth.js')


// 後台統計每堂課學員人數
router.get('/booking/student/:classId', (req, res) => {
    const classId = req.params.classId;
    const student_list = []
    Booking.findAll({
        where: {
            classId: classId,
        },
        include: User,
    }).then((result) => {
        return JSON.stringify(result, null, 4);
    }).then((data) => {
        console.log(data);
        if (data !== '[]') {
            data = JSON.parse(data);
            for (let i = 0; i < data.length; i++) {

                const current_date = moment().format('YYYY-MM-DD')
                const class_date = data[i].class_date;
                const userId = data[i].User.id;
                const username = data[i].User.name;
                const email = data[i].User.email;
                const bookingId = data[i].id;
                const student_info = {
                    'bookingId': bookingId,
                    'class_date': class_date,
                    'userId': userId,
                    'username': username,
                    'email': email
                }
                if (class_date >= current_date) { //大於等於今天的日期，才可以被query出來，不然會跟之前的課重複到
                    student_list.push(student_info)
                }
            }
            return res.json({ 'data': student_list });
        } else {
            return res.json({ 'data': null });
        }

    }).catch((e) => {
        e = e.toString();
        return res.status(500).json({ 'error': true, 'message': e });
    })
});

// 會員中心預約的課程(本月紀錄)
router.get('/booking',auth, (req, res) => {
    console.log(req.user);
    if(req.user.userId){ //req.session.userid
        let list_of_class = []
        Booking.findAll({
            where: {
                UserId: req.user.userId //req.session.userid
            },
            order: [
                ['class_date', 'asc'],
                ['start_time', 'asc']
            ]
        }).then((result) => {
            return JSON.stringify(result, null, 4);
        }).then((data) => {
            console.log(data);
            data = JSON.parse(data)
            if (data !== null) {
                for (let i = 0; i < data.length; i++) {
                    const booking_data = {
                        'bookingId': data[i].id,
                        'weekday': data[i].weekday,
                        'start_time': data[i].start_time,
                        'end_time': data[i].end_time,
                        'class_time': data[i].class_time,
                        'class_name': data[i].class_name,
                        'teacher': data[i].teacher,
                        'room': data[i].room
                    }
                    const class_time = new Date(data[i].class_time.substring(0,10)).getMonth()+1;
                    const current_mon = new Date().getMonth()+1;
                    // if(class_time === current_mon || class_time>current_mon) { 
                        list_of_class.push(booking_data)
                    // }
                }
                const class_data = {
                    'data': list_of_class
                }
                return res.json(class_data);
            } else {
                return res.json({ 'data': null });
            }
        })
    } else {
        return res.json({'data':'未登入'})
    }
});

router.delete('/booking', (req, res) => {
    // 要傳該bookingId近來才可以取消課程/刪除課程
    const bookingId = req.body.bookingId;
    Booking.findOne({
        where: {
            id: bookingId,
        }
    }).then(booking => {
        booking.destroy().then(() => {
            return res.json({ 'ok': true });
        });
    });
});

router.post('/booking',auth,(req, res) => {
    const class_info = req.body.data;
    if(class_info === undefined){
        return
    }
    const weekday = class_info.weekday;
    const current = new Date()
    let current_day = current.getDay(); //4
    let class_date;
    if (current_day === 0) { //把週日換成7來計算
        current_day = 7;
    }
    if (weekday < current_day) { //下禮拜的課
        const calculation＿date = 7 - current_day + weekday;
        // class_date = current.setDate(current.getDate()+calculation＿date);
        class_date = moment().add(calculation＿date, 'days').format('YYYY-MM-DD')

    } else if (weekday === current_day) {
        return res.status(400).json({ 'error': true, 'message': '今日課程不可再預定' });

    } else if (weekday > current_day) { //本週課程
        const calculation＿date = weekday - current_day
        // class_date = current.setDate(current.getDate()+calculation＿date);
        class_date = moment().add(calculation＿date, 'days').format('YYYY-MM-DD')
    }

    const class_data_format = class_date + ' 時段' + class_info.class_time
    if (class_info.userId) { // admin會傳userId近來，就會跑這邊
        Booking.create({
            UserId: class_info.userId,
            classId: class_info.classId,
            month: class_info.month,
            weekday: class_info.weekday,
            class_date: class_date,
            class_time: class_data_format,
            start_time: class_info.start_time,
            end_time: class_info.end_time,
            class_name: class_info.class_name,
            teacher: class_info.teacher,
            room: class_info.room,
        }).then((result) => {
            return JSON.stringify(result, null, 4);
        }).then(() => {
            return res.json({ 'ok': true });
        })
    } else if (req.user.email) { //一般使用者就會跑這邊 //req.session.email
        
        User.findOne({
            where: {
                email: req.user.email,
            },
            include: Booking,
        }).then((result) => {
            return JSON.stringify(result, null, 4);
        }).then((data) => {
            console.log(data);
            data = JSON.parse(data);
            const userId = data.id;
            if (JSON.stringify(data.Bookings) === '[]') { //沒有booking資料
                // 在這邊新增資料
                Booking.create({
                    UserId: userId,
                    classId: class_info.classId,
                    month: class_info.month,
                    weekday: class_info.weekday,
                    class_date: class_date,
                    class_time: class_data_format,
                    start_time: class_info.start_time,
                    end_time: class_info.end_time,
                    class_name: class_info.class_name,
                    teacher: class_info.teacher,
                    room: class_info.room,
                }).then(() => {
                    return res.json({ 'ok': true });
                })
            } else {
                //比對日期＆classId如果一樣表示booking過了
                let new_booking = class_info.classId;
                const bookings = data.Bookings
                for (let i = 0; i < bookings.length; i++) {
                    const class_time = bookings[i].class_time.substring(0, 10)
                    if (bookings[i].classId === new_booking) {
                        if (class_time === class_date) {// 比對日期
                            return res.status(400).json({ 'error': true, 'message': '此課程已預訂過' })
                        }
                    }
                }
                Booking.create({
                    UserId: userId,
                    classId: class_info.classId,
                    month: class_info.month,
                    weekday: class_info.weekday,
                    class_time: class_data_format,
                    class_date: class_date,
                    start_time: class_info.start_time,
                    end_time: class_info.end_time,
                    class_name: class_info.class_name,
                    teacher: class_info.teacher,
                    room: class_info.room,

                }).then(() => {
                    return res.json({ 'ok': true });
                })
            }
            
        }).catch((e) => {
            e = e.toString();
            return res.status(500).json({ 'error': true, 'message': e });
        })
        
    } else {
        return res.status(400).json({ 'error': true, 'message': '請先登入' });
    }
});





module.exports = router;