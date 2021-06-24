const express = require('express');
const router = express.Router();
const db = require('../db_module.js');
const Classes = db.Classes;
const get_data = db.get_data;
const get_per_data = db.get_per_data;


router.get('/class',(req,res)=>{
    get_data(Classes, function(data){
        data = data.replace(/(?:\\[rn])+/g, ''); // 把\r\n replace
        data = JSON.parse(data);
        return res.json(data);

    });
});

router.get('/class/:classId',(req,res)=>{
    const classId = req.params.classId;
    get_per_data(Classes, classId, function(data){
        if(data === 'null'){
            return res.json({'data': null});
        } else {
            data = data.replace(/(?:\\[rn])+/g, '');
            data = JSON.parse(data);
            return res.json(data);
        }
    })
});

module.exports = router;