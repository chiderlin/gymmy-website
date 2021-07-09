// 測試環境
// require('dotenv/config'); //要放在Sequelize之前 才會讀取到.env的資料
// const Sequelize = require('sequelize');
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
    month: {
        type: Sequelize.INTEGER,
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
    plan:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    active: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    auth: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
})

const Payment = sequelize.define('Payment',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    card_key: {
        type: Sequelize.STRING(200),
        unique: true,
    },
    card_token:{
        type: Sequelize.STRING(200),
        unique: true,
    },
    rec_trade_id: {
        type: Sequelize.STRING(50),
        unique: true,
    },
    bank_transaction_id: {
        type: Sequelize.STRING(50),
        unique: true,
    },
    subscriptionId:{
        type: Sequelize.STRING(50),
        unique: true,
    },
    next_pay_date: {
        type: Sequelize.DATE,
    },
    type:{
        type: Sequelize.STRING(50),
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: sequelize.fn('NOW'),
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
    rec_trade_id:{
        type: Sequelize.STRING(50),
        unique: true,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: sequelize.fn('NOW'),
    },

}, { // 設定時間要不要有
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});

const Member = sequelize.define('Member',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    image_name:{
        type: Sequelize.STRING(100),
    },
    image_address:{
        type: Sequelize.STRING(100),
    },

});


const Booking = sequelize.define('Booking', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    classId:{
        type: Sequelize.INTEGER, 
    },
    month:{
        type: Sequelize.INTEGER,
    },
    weekday:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    class_date:{
        type: Sequelize.DATE,
        allowNull: false,
    },
    start_time:{
        type: Sequelize.DATE,
        allowNull: false,
    },
    end_time:{
        type: Sequelize.DATE,
        allowNull: false,
    },
    class_time:{
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    class_name:{
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    teacher:{
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    room:{
        type: Sequelize.STRING(50),
        allowNull: false,
    },

},{ // 設定時間要不要有
    timestamps: true,
    createdAt: true,
    updatedAt: false,
});

// 雙向關聯
User.hasOne(Payment);
Payment.hasMany(Order);
User.hasOne(Member);
User.hasMany(Booking);

Payment.belongsTo(User);
Order.belongsTo(Payment);
Booking.belongsTo(User);
Member.belongsTo(User);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Classes = Classes;
db.User = User;
db.Payment = Payment;
db.Order = Order;
db.Member = Member;
db.Booking = Booking;
module.exports = db;






