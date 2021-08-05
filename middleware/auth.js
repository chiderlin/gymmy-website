const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
    const authHeader = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ''
    if(authHeader === 'null'){
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