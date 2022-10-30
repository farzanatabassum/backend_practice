const jwt=require('jsonwebtoken')
const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')

const protect=asyncHandler(async(req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //Get token from the user
            token=req.headers.authorization.split(' ')[1]
            //Verify token
            const decodedToken=jwt.verify(token,process.env.JWT_SECRET)
            //Get user from the token
            req.user=await User.findById(decodedToken.id).select("-password")
            next()
        }catch(error){
            console.log(error)
                res.status(401)
                throw new Error('Not authorized')

            
        }
    }
if(!token){
    req.status(401)
    throw new Error('Not authorized, no token')
}
})
module.exports={protect}