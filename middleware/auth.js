const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
    console.log("token:",req.cookies.jwt);
    // let authHeader = req.headers.authorization
    // console.log(authHeader)
    // if(authHeader === undefined){
    //     return res.status(400).json({'error':true, 'message':'無token'})
    // } else {
    //     const token = authHeader.split(' ')[1]
    //     console.log(token)
    
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            return res.status(400).json({'error':true, 'message':'驗證不正確'})
        }
        req.user = user
        next();
    })


    // }
}

module.exports = auth;