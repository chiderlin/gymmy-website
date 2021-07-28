const express = require('express');
const router = express.Router();
const db = require('../db_module.js');
const Member = db.Member;
const User = db.User;
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const multer = require('multer'); //檔案處理
const fs = require('fs');
const auth = require('../middleware/auth.js')

const storage = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, './upload/')
    },
    filename: (req, res, callback) => {
        callback(null, res.originalname);
    }
})
const upload = multer({
    storage: storage,
    // dest: 'upload/', //storage有寫了這邊就不用了
    limits: {
        fieldSize: 1024 * 1024, // 1MB
    },
    fileFilter: (req, res, callback) => {
        if (res.mimetype === 'image/png' || res.mimetype === 'image/jpg' || res.mimetype === 'image/jpeg' || res.mimetype === 'image/gif') {
            callback(null, true)
        } else {
            callback(null, false)
            return callback(new Error('請上傳圖片格式'));
        }
    },
})


const mybucket = 'gymmy';
router.post('/member/img-upload', upload.single('img'), auth, function (req, res, next) {
    // console.log(req.file);

    const stream = fs.createReadStream(`./upload/${req.file.originalname}`);
    const params = { Bucket: mybucket, Key: `member_img/${req.file.originalname}`, Body: stream, ACL: 'public-read' };
    const options = { partSize: 1024 * 1024 * 5, queueSize: 1 };
    try {
        s3.upload(params, options, (err, data) => {
            if (err) {
                throw err;
            }

            fs.unlink(`./upload/${req.file.originalname}`, (err) => { //刪除本機圖片
                if (err) { return console.error(err) }
                console.log('deleted');
            })
            User.findOne({
                where: {
                    email: req.user.email,
                },
                include: Member,
            }).then((result) => {
                return JSON.stringify(result, null, 4);
            }).then((data) => {
                data = JSON.parse(data);
                const userId = data.id
                const address = `https://d1o9l25q4vdj2h.cloudfront.net/member_img/${req.file.originalname}`
                if (data.Member === null) { //member沒有這個會員圖片資料
                    // 在這邊新增資料
                    Member.create({
                        image_name: req.file.originalname,
                        image_address: address,
                        UserId: userId,
                    }).then(() => {
                        return res.json({ ok: true, address: address });
                    })

                } else { //已經有紀錄->更新圖片
                    Member.findOne({
                        where: {
                            UserId: userId,
                        }
                    }).then((mem) => {
                        mem.update({
                            image_name: req.file.originalname,
                            image_address: address,
                        })
                    }).then(() => {
                        console.log('update done')
                        return res.json({ ok: true, address: address });
                    })
                }
            })
        })
    } catch (e) {
        e = e.toString()
        res.status(500).json({ error: true, message: e });
    }
})


// for member頁面取得資料
router.get('/member/info', auth, (req, res) => {
    User.findOne({
        where: {
            email: req.user.email,
        },
        include: Member,
    }).then((result) => {
        return JSON.stringify(result, null, 4);
    }).then((api_data) => {
        api_data = JSON.parse(api_data);
        const member_email = api_data.email;
        const member_plan = api_data.plan;
        const member_active = api_data.active;
        let member_image;
        if (api_data.Member !== null) {
            member_image = api_data.Member.image_address;
        } else {
            member_image = null;
        }
        const data = {
            'email': member_email,
            'plan': member_plan,
            'active': member_active,
            'image': member_image
        }
        return res.json(data);
    });
});

module.exports = router;
