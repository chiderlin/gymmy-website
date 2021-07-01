require('dotenv/config'); //要放在Sequelize之前 才會讀取到.env的資料
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PWD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: process.env.DB_POOL,
    timezone: '+08:00',
})


// 建立user model => 會印出db裡面的table name
const Classes = sequelize.define('Classes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    weekday: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    start_time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    end_time:{
        type: Sequelize.DATE,
        allowNull: false,
    },
    class_time: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    class_name_zh: {
        type: Sequelize.STRING(50),
    },
    class_name_eng: {
        type: Sequelize.STRING(50),
    },
    class_teacher: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    class_room: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    desc: {
        type: Sequelize.STRING(1000),
        allowNull: false,
    },
    img: {
        type: Sequelize.STRING(1000),
    }
}, { // 設定時間要不要有
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});

const User = sequelize.define('User',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    auth: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
})

const Payment = sequelize.define('Payment',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    card_key: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
    },
    card_token:{
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
    },
});
// 雙向關聯
User.hasOne(Payment);
Payment.belongsTo(User);


// function
// 執行程式，在資料庫建立欄位，回傳promise，用then接
function insert_data(table, inputdata, callback) {
    sequelize.sync().then(() => {
        // 在這邊新增資料
        table.create(inputdata).then(() => {
            // 執行成功印出
            return callback('ok');
        })
    })
};

function delete_data(table, value) {
    sequelize.sync().then(() => {
        table.findOne({
            where: {
                id: value // id 不能設成變數
            }
        }).then(user => {
            user.destroy().then(() => {
                console.log('delete done');
            })
        })
    })
};

function get_data(table, callback) {
    sequelize.sync().then(() => {
        table.findAll({
            where: {

            },
            order:[
                ['weekday', 'asc'],
                ['start_time', 'asc']
            ]
        }).then(data => {
            return callback(JSON.stringify(data, null, 4));
        })
    })
};


// for classes
function get_id_data(table, value, callback) {
    sequelize.sync().then(() => {
        table.findOne({
            where: {
                id: value,
            },
            include: Payment
        }).then(data => {
            return callback(JSON.stringify(data, null, 4));
        })
    })
};

// for user
function user_check_data(table, value, callback) {
    sequelize.sync().then(() => {
        table.findOne({
            where: {
                email: value,
            }
        }).then(data => {
            return callback(JSON.stringify(data, null, 4));
        })
    })
};

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Classes = Classes;
db.User = User;
db.Payment = Payment;


db.insert_data = insert_data;
db.delete_data = delete_data;
db.get_data = get_data;


db.user_check_data = user_check_data; //user
db.get_id_data = get_id_data; // classes


module.exports = db;







// sequelize.sync().then(()=>{
//     User.findAll().then((users)=>{
//         // 用JSON.stringfy()來格式化輸出
//         // console.log('all users:', JSON.stringify(users, null, 4))
//         console.log(users[0].firstName)
//     })
// });

// =======================

// 練習用sequelize-cli 時的寫法
// const db = require('./models');
// const User = db.User;
// const Comment = db.Comment; 

// User.create({
//     firstName: 'Hello',
//     lastName: 'World'
// }).then(()=>{
//     console.log('done');
// })