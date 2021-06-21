const express = require('express');
const app = express();
require('dotenv/config');


app.set('views','./templates');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));


app.get('/', (req, res) => {
    return res.render('index');
});

app.get('/products', (req, res) => {
    return res.render('products');
});

app.get('/booking', (req, res) => {
    return res.render('booking');
});

app.get('/class/<id>', (req, res) => {
    return res.render('class');
});

app.get('/member/<username>', (req, res) => {
    return res.render('member');
});

app.get('/backstage', (req, res) => {
    return res.render('backstage');
});

app.get('/login', (req,res)=>{
    return res.render('login');
});

app.listen(3001);