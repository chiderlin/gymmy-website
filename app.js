const express = require('express');
const app = express();
require('dotenv/config');
const session = require('express-session');
// const MemoryStore = session.MemoryStore;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io')
const io = new Server(server);

app.set('views', './templates');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.use(express.json()); // Parse application/json
app.set('trust proxy', 1) // express-session
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false }));
app.set('socket.io', io)
// 設data 不能用
// let expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toLocaleString('chinese',{hour12: false});
app.use(session({
    secret: process.env.SECRET_KEY,
    name: 'sessionId',
    resave: false, // 設false才會刪除sessionId的cookie
    saveUninitialized: false, // 設false才會刪除sessionId的cookie
    // store: new MemoryStore(),
    cookie: {
        secure: false,
        httpOnly: true,
        }, 
    })
)

const classes = require('./apis/classes');
const user = require('./apis/user');
const payment = require('./apis/payment');
const member = require('./apis/member');
const booking = require('./apis/booking');
const ipn = require('./apis/ipn_listener')
app.use('/api', classes);
app.use('/api', user); 
app.use('/api', payment);
app.use('/api', member);
app.use('/api', booking);
app.use('/ipn', ipn);


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
app.get('/backside', (req, res) => {
    return res.render('backside');
});

app.get('/backside-login', (req, res) => {
    return res.render('backside-login');
});

app.get('/backside-post',(req,res)=>{
    return res.render('backside-post');
})

server.listen(3001); 