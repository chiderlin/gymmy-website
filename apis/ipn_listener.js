const express = require('express');
const router = express.Router();

router.post('/',(req,res)=>{
    console.log('It works! 😀');
    res.status(200).send('OK');
    res.end();


})

module.exports = router;
