const express = require('express');
const app = express();
require('dotenv/config');


app.set('views', './templates');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

const classes = require('./apis/classes');
app.use('/api', classes);

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


// 會員中心頁面
app.get('/member/:username', (req, res) => {
    return res.render('member');
});


// 後台頁面
app.get('/backstage', (req, res) => {
    return res.render('backstage');
});

app.get('/backstage-login', (req, res) => {
    return res.render('backstage-login');
});

app.listen(3001);