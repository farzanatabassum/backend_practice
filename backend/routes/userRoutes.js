const express=require('express')
const router=express.Router()
const {register,login,getMe}=require('../controllers/userController')
// router.route('/').post(register)
const {protect}=require('../middleware/authMiddleware')
 router.post('/', register)
router.route('/login').post(login)
router.route('/me').get(protect,getMe)
module.exports=router