const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
    // console.log("cookie:",req.cookies.jwt);
    // const token = req.cookies.jwt
    // if(token === undefined){
    //     return res.json({data:null});
    // }
    const authHeader = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ''
    // console.log(authHeader)
    if(authHeader === 'undefined'){
        return res.json({data:null})
    } else {
        jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err){
                return res.status(400).json({'error':true, 'message':'驗證不正確'})
            }
            req.user = user
            next();
        })
    }
}

module.exports = auth;