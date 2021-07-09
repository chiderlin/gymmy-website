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
    let list_of_class = []
    Booking.findAll({
        where:{
            UserId: req.session.userid
        },
        order:[
            ['class_date', 'asc'],
            ['start_time', 'asc']
        ]
    }).then((result)=>{
        return JSON.stringify(result, null, 4);
    }).then((data)=>{
        data = JSON.parse(data)
        if(data !== null) {
            for(let i=0; i<data.length;i++){
                const booking_data = {
                    'bookingId':data[i].id,
                    'class_time':data[i].class_time,
                    'class_name':data[i].class_name,
                    'teacher':data[i].teacher,
                    'room':data[i].room
                }
                list_of_class.push(booking_data)
            }
            const class_data = {
                'data':list_of_class
            }
            return res.json(class_data);
        } else {
            return res.json({'data':null});
        }
    })
});

// router.get('/history/booking',(req,res)=>{
//     // 過期的
//     console.log(req.session.userid);
//     Booking.findAll({
//         where:{
//             UserId: req.session.userid
//         },
//         order:[
//             ['class_date', 'asc'],
//             ['start_time', 'asc']
//         ]
//     }).then((result)=>{
//         return JSON.stringify(result, null, 4);
//     }).then(async(data)=>{
//         data = JSON.parse(data)
//         if(data !== null) {
//             const history_list = await check_expiry(data);
//             const history_data = {
//                 'data':history_list
//             }
    
//             return res.json(history_data);
//         }
//     })
// });

// function check_expiry(data){
//     const list_of_history = [];
//     for(let i=0; i<data.length;i++){
//         const today = new Date().getDate();
//         const class_date = new Date(data[i].class_date).getDate()
//         const end_hour = new Date(data[i].end_time).getHours();
//         if(today>class_date){
//             // 確定過期
//             const booking_data = {
//                 'bookingId':data.id,
//                 'class_time':data.class_time,
//                 'class_name':data.class_name,
//                 'teacher':data.teacher,
//                 'room':data.room
//             }
//             list_of_history.push(booking_data)

//         }else if(today === class_date) {
//             const current_hour = new Date().getHours();
//             const end_hour = new Date(data[i].end_time).getHours();
//             if(current_hour>end_hour){
//                 // 確定過期
//                 const booking_data = {
//                     'bookingId':data.id,
//                     'class_time':data.class_time,
//                     'class_name':data.class_name,
//                     'teacher':data.teacher,
//                     'room':data.room
//                 }
//                 list_of_history.push(booking_data)
//             }
//         }
//     }
//     return list_of_history;
// };

// function check_class(data){
//     const list_of_class = [];
//     for(let i=0; i<data.length;i++){
//         const today = new Date().getDate();
//         const class_date = new Date(data[i].class_date).getDate()
//         const end_hour = new Date(data[i].end_time).getHours();
//         if(today<class_date){
//             // 確定沒過期
//             const booking_data = {
//                 'bookingId':data.id,
//                 'class_time':data.class_time,
//                 'class_name':data.class_name,
//                 'teacher':data.teacher,
//                 'room':data.room
//             }
//             list_of_class.push(booking_data)

//         }else if(today === class_date) {
//             const current_hour = new Date().getHours();
//             const start_hour = new Date(data[i].start_time).getHours();
//             const end_hour = new Date(data[i].end_time).getHours();
//             if(current_hour>end_hour){
//                 // 確定過期
//                 const booking_data = {
//                     'bookingId':data.id,
//                     'class_time':data.class_time,
//                     'class_name':data.class_name,
//                     'teacher':data.teacher,
//                     'room':data.room
//                 }
//                 list_of_class.push(booking_data)
//             }
//         }
//     }
//     return list_of_class;
// }


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

    const class_data_format = class_date + ' 時段' + class_info.class_time
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
                            class_date:class_date,
                            class_time:class_data_format,
                            start_time:class_info.start_time,
                            end_time:class_info.end_time,
                            class_name:class_info.class_name,
                            teacher:class_info.teacher,
                            room: class_info.room,
                
                        }).then(() => {
                                    
                            return res.json({'ok':true});
                        })
                    } else { // with booking 資料做比對，日期不同可以
                        // 比對classId => 傳進來的classId＆資料庫的比對
                        let new_booking = class_info.classId;
                        const bookings = data.Bookings
                        for(let i=0; i<bookings.length; i++) {
                            if(bookings[i].classId === new_booking){
                                if(bookings[i].class_time.substring(0,10)===class_date){// 比對日期
                                    return res.status(400).json({'error:':true, 'message':'此課程已預訂'})
                                }
                            }
                        }
                        Booking.create({
                            UserId: userId,
                            classId: class_info.classId,
                            month:class_info.month,
                            weekday:class_info.weekday,
                            class_time:class_data_format,
                            class_date:class_date,
                            start_time:class_info.start_time,
                            end_time:class_info.end_time,
                            class_name:class_info.class_name,
                            teacher:class_info.teacher,
                            room: class_info.room,
                
                        }).then(() => {
                                    
                            return res.json({'ok':true});
                        })
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