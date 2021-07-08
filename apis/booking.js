const express = require('express');
const router = express.Router();
const db = require('../db_module.js');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const Booking = db.Booking;
const User = db.User;
const Classes = db.Classes;
const moment = require('moment');


router.get('/booking',(req,res)=>{
    
    User.findOne({
        where: {
            email: req.session.email,
        },
        include:Booking,
    }).then((result) => {
        return JSON.stringify(result, null, 4);
    }).then((data)=>{
        // console.log(data);
        data = JSON.parse(data)
        let all_booking_data = [];
        if(JSON.stringify(data.Bookings) !== '[]'){
            const booking = data.Bookings;

            for(let i=0; i<booking.length; i++){
                const bookingId = booking[i].id;
                const class_time = booking[i].class_time;
                const class_name = booking[i].class_name;
                const teacher = booking[i].teacher;
                const room = booking[i].room
                const booking_data = {
                    'bookingId':bookingId,
                    'class_time':class_time,
                    'class_name':class_name,
                    'teacher':teacher,
                    'room':room
                }
                all_booking_data.push(booking_data);
            }
            return res.json({'data':all_booking_data}); 
        } else {
            return res.json({'data':null});
        }
    }).catch((e)=>{
        e = e.toString()
        return res.status(500).json({'error':true, 'message':e});
    })
    
});


router.delete('/booking',(req,res)=>{
    // 要傳該bookingId近來才可以取消課程
    const bookingId = req.body.bookingId;
    sequelize.sync().then(() => {
        Booking.findOne({
          where: {
            id: bookingId,
          }
        }).then(user => {
          user.destroy().then(() => {
            console.log('destroy done!');
          });
        });
      });
    
});

router.post('/booking',(req,res)=>{

    const class_info = req.body.data;
    const weekday = class_info.weekday;
    const current = new Date()
    let current_day = current.getDay(); //4
    let class_date;
    if(current_day === 0) { //把週日換成7來計算
        current_day = 7;
    }
    if(weekday<current_day) { //下禮拜的課
        const calculation＿date = 7-current_day+weekday;
        // class_date = current.setDate(current.getDate()+calculation＿date);
        class_date = moment().add(calculation＿date, 'days').format('YYYY-MM-DD')
        
    } else if(weekday === current_day){
        return res.status(400).json({'error':true, 'message':'今日課程不可再預定'});

    } else if(weekday > current_day){ //本週課程
        const calculation＿date = weekday - current_day
        // class_date = current.setDate(current.getDate()+calculation＿date);
        class_date = moment().add(calculation＿date, 'days').format('YYYY-MM-DD')
    }
    class_date += ' 時段'+class_info.class_time
    console.log(class_date);
    if(req.session.email){
        sequelize.sync().then(() => {
            User.findOne({
                where: {
                    email: req.session.email,
                },
                include:Booking,
            }).then((result) => {
                return JSON.stringify(result, null, 4);
            }).then((data)=>{
                data = JSON.parse(data);
                console.log(data);
                console.log(data.Bookings);
                console.log(typeof(data.Bookings))
 
                const userId = data.id;
                sequelize.sync().then(() => {
                    if(JSON.stringify(data.Bookings) === '[]'){ //沒有booking資料
                        // 在這邊新增資料
                        Booking.create({
                            UserId: userId,
                            classId: class_info.classId,
                            month:class_info.month,
                            weekday:class_info.weekday,
                            class_time:class_date,
                            start_time:class_info.start_time,
                            end_time:class_info.end_time,
                            class_name:class_info.class_name,
                            teacher:class_info.teacher,
                            room: class_info.room,
                
                        }).then(() => {
                                    
                            return res.json({'ok':true});
                        })
                    } else { // 有booking 資料做比對，日期不同可以
                        // 比對classId
                        // 比對日期
                        //兩者都相同者已預訂過，不可再預定
                    }
                    
                })
            }).catch((e)=>{
                e = e.toString();
                return res.status(500).json({'error':true, 'message':e});
            })
        })
    } else {
        return res.status(400).json({'error':true, 'message':'請先登入'});
    }
});




module.exports = router;