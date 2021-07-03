// 測試環境
require('dotenv/config'); //要放在Sequelize之前 才會讀取到.env的資料
const Sequelize = require('sequelize');
// const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PWD, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     pool: process.env.DB_POOL,
//     timezone: '+08:00',
// })
// ============================================

// 正式環境
require('dotenv/config'); //要放在Sequelize之前 才會讀取到.env的資料
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PWD, {
    host: process.env.DB_HOST,
    port: 3306,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: 'mysql',
    dialectOptions: {
        ssl:'Amazon RDS'
    },
    pool: process.env.DB_POOL,
    timezone: '+08:00',
    language: 'en',
})

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

const Order = sequelize.define('Order',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    transaction_id:{
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
    },
    currency:{
        type: Sequelize.STRING(50),
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull: false,
    },
    
    
})

// 雙向關聯
User.hasOne(Payment);
Payment.belongsTo(User);


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Classes = Classes;
db.User = User;
db.Payment = Payment;
db.Order = Order;
module.exports = db;






