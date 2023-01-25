const express=require('express')

// create server app using express
const server=express()

const cors=require('cors')
// import dataService
const dataService=require('./services/dataService')

// import jsonwebToken

const jwt =require('jsonwebtoken')

// .................................................................
// setup port
server.listen(3000,()=>{
    console.log('server started at 3000');
})


server.use(cors({
origin:'http://localhost:4200'
}))

server.use(express.json())

// register and call

server.post('/register',(req,res)=>{
    console.log('Inside register Api');
    console.log(req.body);
    // asynchronus
    dataService.register(req.body.uname,req.body.acno,req.body.pswd)
    .then((result)=>{
res.status(result.statusCode).json(result)
    })
    
})

// middleware........................................................

const appMiddleware=(req,res,next)=>{
    console.log('Inside middleware');
    next()
}
server.use(appMiddleware)

// token verify middleware
const jwtMiddleware= (req,res,next)=>{
    console.log('Inside jwtMiddleware');
    // get token from req header
    const token= req.headers['x-token']
    try{

    // verify token 
const data=jwt.verify(token,'22ttnumber')
req.fromAcno=data.currentAcno
console.log('valid Token');
next()
}
catch{
console.log('Invalid Token');
res.status(401).json({
    messege:'please Login'
})
}
}

// Login and call

server.post('/Login',(req,res)=>{
    console.log('Inside login Api');
    console.log(req.body);
    // asynchronus
    dataService.Login(req.body.acno,req.body.pswd)
    .then((result)=>{
res.status(result.statusCode).json(result)
    })
    
})


// getBalance

server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside getBalance body');
    console.log(req.params.acno);
    // asynchronus
    dataService.getBalance(req.params.acno)
    .then((result)=>{
res.status(result.statusCode).json(result)
    })
    
})


// deposit api

server.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log('Inside dposit body');
    console.log(req.body);
    // asynchronus
    dataService.deposit(req.body.acno,req.body.amount)
    .then((result)=>{
res.status(result.statusCode).json(result)
    })
    
})


// Fund Transfer

server.post('/fundTransfer',jwtMiddleware,(req,res)=>{
    console.log('Inside fundTransfer body');
    console.log(req.body);
    // asynchronus
    dataService.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
    .then((result)=>{
res.status(result.statusCode).json(result)
    })
    
})

// getAllTransactions

server.get('/all-transactions',jwtMiddleware,(req,res)=>{
    console.log('Inside getAllTransactions api')
    dataService.getAllTransactions(req)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// deleteMyAccount
server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside delete body');
    console.log(req.params.acno);
    // asynchronus
    dataService.deleteMyAccount(req.params.acno)
    .then((result)=>{
res.status(result.statusCode).json(result)
    })
    
})
