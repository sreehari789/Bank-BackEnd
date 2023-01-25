// import mongoose in db.js

const mongoose= require ('mongoose')

// using mongoose difine a connection string

mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('MongoDb Connected');
})

const User= mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transation:[]
})

module.exports={
    User
}