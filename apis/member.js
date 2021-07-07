const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const multer = require('multer');
const fs = require('fs');
const app = express();
const storage = multer.diskStorage({
    destination: (req,res,callback)=>{
        callback(null, './upload/')
    },
    filename: (req,res, callback)=>{
        callback(null, res.originalname);
    }
})
const upload = multer({
    storage: storage,
    // dest: 'upload/', //storage有寫了這邊就不用了
    limits:{
        fieldSize: 1024*1024, // 1MB
    },
    fileFilter: (req,res,callback)=>{
        if(res.mimetype === 'image/png' || res.mimetype === 'image/jpg' || res.mimetype === 'image/jpeg' || res.mimetype === 'image/gif'){
            callback(null, true)
        } else {
            callback(null, false)
            return callback(new Error('請上傳圖片格式'));
        }
    },
})

//TODO:
//1.檔案上傳s3
//2.把檔名＆圖片網址紀錄到member db（圖片才會永久保存，在init時前端render出來）
//，之後如果要更換照片時刪除s3上面的照片


const mybucket = 'gymmy';

router.post('/upload', upload.single('img'),function(req,res,next){
    // console.log(req.file);

    const stream = fs.createReadStream(`./upload/${req.file.originalname}`);
    const params = {Bucket: mybucket, Key:`member_img/${req.file.originalname}`, Body:stream, ACL:'public-read'};
    const options = {partSize: 1024*1024*5, queueSize:1};
    try {
        s3.upload(params,options, (err, data)=>{
            if(err){
                throw err;
            }
            console.log(data.Location);
            fs.unlink(`./upload/${req.file.originalname}`,(err)=>{
                if(err){return console.error(err)}
                console.log('deleted');
            })
            res.json({'ok':true, 'address':`https://d1o9l25q4vdj2h.cloudfront.net/member_img/${req.file.originalname}`});
        })
    } catch(e){
        e = e.toString()
        res.status(500).json({'error':true,'message':e});
    }

})

module.exports = router;
