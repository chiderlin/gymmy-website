const AWS = require('aws-sdk');
const s3 = new AWS.S3();


const mybucket = 'gymmy';
const params = {Bucket: mybucket, Key:`member_img/g.jpeg`};
const options = {partSize: 1024*1024*5, queueSize:1};

s3.deleteObject(params,(err,data)=>{
    if(err){
        throw err;
    } else {
        console.log(data);
    }
})