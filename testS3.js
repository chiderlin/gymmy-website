const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const mybucket = 'gymmy';
const mykey = 'gymmys3';
// 下載cli，設定好key就可連線了

s3.listBuckets((err,data)=>{
    if(err){
        throw err;
    } else {
        console.log('success', data.Buckets);
    }
})