const errorHandler=(err,req,res,next)=>{
const statusCode= res.statusCode? res.statusCode: 500
//res.statusCode is the res.status(400) given in controller
//500=> internal server error

res.status(statusCode)
res.json({
    message:err.message,
    stack:process.env.NODE_ENV==='production'? null : err.stack,
//err.stack will give the line numbers giving error
})
}
module.exports={
    errorHandler,
}