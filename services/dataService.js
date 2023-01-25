// import db.js
const db=require('./db')

// import
const jwt =require('jsonwebtoken')

// register

const register=(uname,acno,pswd)=>{
    console.log('inside register function in data service');
// check acno is in mongodb - db.users.findOne()
return db.User.findOne({

    acno
}).then((result)=>{
    console.log(result);
    if(result){
        // acno already exist
        return {
            statusCode:403,
            message:'Account Already Exist!!'
        }
    } else{
        // to add new user
        const newUser= new db.User({
            username:uname,
            acno,
            password:pswd,
            balance:0,
            transation:[]
        })
        // to save new User in mongoDb
        newUser.save()
return{
     statusCode:200,
     message:'Registeration successfull'

}
    }
})
}

// Login 
const Login=(acno,pswd)=>{
    console.log('inside login function body');
 return db.User.findOne({
    acno,
    password:pswd
}).then((result)=>{
if(result){
    // generate token

    const token =jwt.sign({
currentAcno:acno
    },'22ttnumber')
    return {
        statusCode:200,
        messege:'Login successfull!!',
        username:result.username,
        currentAcno:acno,
        token
    }
} else{
    return{
        statusCode:404,
        message:'Invalid Account number or password'
    }
   
}
})
}

// getBalance
const getBalance=(acno)=>{
    return db.User.findOne({
        acno
        
    }).then((result)=>{
    if(result){
       
        return {
            statusCode:200,
           balance:result.balance
            
        }
    } else{
        return{
            statusCode:404,
            message:'Invalid Account number or password'
        }
       
    }
    })
}
// deposit 
const deposit=(acno1,amt)=>{
    let acno=Number(acno1)
    let amount=parseInt(amt)
    return db.User.findOne({
        acno
    }).then((result)=>{
        console.log(result);
        if(result){
            result.balance+=amount
            // 
            result.transation.push({
                type:"CREDIT",
                fromAcno:acno,
                toAcno:acno,
                amount
            })
            // to update in mongodb
            result.save()
            return{
                statusCode:200,
                message:`${amount} successfully deposited`
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid Account'
            }
        }
    })
}

// funsTransfer
const fundTransfer=(req,toAcno,pswd,amt)=>{
    let amount=Number(amt)
    let fromAcno=req.fromAcno
    console.log(fromAcno);
    console.log(pswd);
    return db.User.findOne({
        acno:fromAcno,
        password:pswd  
        
    }).then((result)=>{
        console.log(result);

        if(fromAcno==toAcno){
            return{
                statusCode:401,
                message:'permission denied due to own account transfer' 
             }
        }

        if(result){
// debit account details
let fromAcnoBalance= result.balance
if(fromAcnoBalance>=amount){
    result.balance=fromAcnoBalance-amount
    return db.User.findOne({
      acno:toAcno  
    }).then(creditData=>{
        if(creditData){
creditData.balance+= amount

creditData.transation.push({
    type:"CREDIT",
    fromAcno,
    toAcno,
    amount
})

creditData.save();
console.log(creditData);


result.transation.push({
    type:"DEBIT",
    fromAcno,
    toAcno,
    amount
})

result.save();
console.log(result);

return{
    statusCode:200,
    message:'Account Transfer successfully'
}
        }else{
            return{
                statusCode:401,
                message:'invalid credit acc number'
            }
        }
    })
}else{
    return{
        statusCode:403,
        message:'Insufficient Balance'
    }
}
        }else{
            return{
               statusCode:401,
               message:'Invalid Debit account number / password' 
            }
        }
    })
}
// getAllTransactions
const getAllTransactions =(req)=>{
    let acno=req.fromAcno
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return{
                statusCode:200,
                transation:result.transation
            }
        }
        else{
            return{
                statusCode:401,
                message:"invalid accound number"
            }
        }
            
        
    })
}
const deleteMyAccount=(acno)=>{
    return db.User.deleteOne({

    }).then((result)=>{
       if(result){
        return{
            statusCode:200,
            message:"Account deleted successfully"
                }

       }
       else{
        return{
            statusCode:401,
            message:"invalid Account"
        }
       }
    })
}

// export
module.exports={
    register,Login,getBalance,deposit,fundTransfer,getAllTransactions,deleteMyAccount
}