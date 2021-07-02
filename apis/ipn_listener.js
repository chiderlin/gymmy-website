const express = require('express');
const router = express.Router();

router.post('/ipn_listener',(req,res)=>{
    console.log('It works! 😀');
    res.status(200).send('OK');
    res.end();
})

module.exports = router;