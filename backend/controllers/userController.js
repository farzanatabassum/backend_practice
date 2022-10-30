const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require("bcryptjs")

//api/users
//post
//public
const register= asyncHandler(async(req,res)=>{
   const {name,email,password}=req.body
   if(!name||!email||!password){
    res.status(400)
    throw new Error('Please add all fields')
   }
   //Check if user Exist
   const userExist=await User.findOne({email})
   if(userExist){
    res.status(400)
    throw new Error('User already exist')
   }
   //Hash password
   const salt= await bcrypt.genSalt(10)
   const hashedPassword=await bcrypt.hash(password,salt)
   //Create User
   const user=await User.create({
    name,
    email,
    password:hashedPassword,
   })
   if(user){
    res.status(201).json({
        _id:user.id,
        name: user.name,
        email:user.email,
        token:generateToken(user._id),
    })
   }else{
    res.status(400)
    throw new Error('Invalid user data')
   }
})
//api/users/login
//post
//public
const login= asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        res.status(400)
        throw new Error('Please add all fields')
    }
    const user=await User.findOne({email})
    if(user && (await bcrypt.compare(password,user.password))){
        res.status(201).json({
            _id:user.id,
            name: user.name,
            email:user.email,
            token:generateToken(user._id),

        })
       }else{
        res.status(400)
        throw new Error('Invalid user data')
       }
    // res.status(200).json({message:'User logged in'})
})

//api/users/me
//get
//private
const getMe= asyncHandler(async(req,res)=>{
    const {_id,name,email}=await User.findById(req.user.id)


    res.status(200).json({
        id:_id,
        name,
        email,
    })
})
//generate a token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d',
    })
}
module.exports={
    register,login,getMe
}