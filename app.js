const express = require('express');
const app = express();
require('dotenv/config');
const session = require('express-session');
const MemoryStore = session.MemoryStore;
const cookieParser = require('cookie-parser');


app.set('views', './templates');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.use(express.json()); // for server receive json data
app.use(cookieParser());

// 設data 不能用
// let expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toLocaleString('chinese',{hour12: false});
app.use(session({
    secret: process.env.SECRET_KEY,
    name: 'sessionId',
    resave: true, // store sets an expiration date on stored sessions
    saveUninitialized: true, //useful for implementing login sessions reducing server storage usage
    store: new MemoryStore(),
    cookie: {
        secure: false,
        httpOnly: true,
        }, 
    })
)
const classes = require('./apis/classes');
const user = require('./apis/user');
const payment = require('./apis/payment');
const ipn_listener = require('./apis/ipn_listener.js')
app.use('/api', classes);
app.use('/api', user);
app.use('/api', payment);
app.use('/api', ipn_listener);


app.get('/', (req, res) => {
    return res.render('index');
});


// 方案頁面
app.get('/products', (req, res) => {
    return res.render('products');
});


app.get('/booking', (req, res) => {
    return res.render('booking');
});


// 課程頁面
app.get('/classes', (req, res) => {
    return res.render('classes');
});
app.get('/class/:id', (req, res) => {
    return res.render('class');
});


// 註冊頁面
app.get('/signup-info', (req, res) => {
    return res.render('signup_info');
});
app.get('/signup-payment', (req, res) => {
    return res.render('signup_payment');
});

app.get('/thankyou',(req,res)=>{
    return res.render('thankyou');
})


// 會員中心頁面
app.get('/member/:username', (req, res) => {
    return res.render('member');
});
// 最新消息頁面
app.get('/news', (req, res) => {
    return res.render('news');
});

// 後台頁面
app.get('/backstage', (req, res) => {
    return res.render('backstage');
});

app.get('/backstage-login', (req, res) => {
    return res.render('backstage-login');
});

app.listen(3001);