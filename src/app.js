const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")
const cookieParser = require("cookie-parser");


//work for all types routes and all types of methods & server cant read json data we send in req so to read 
//that we include this middleware which can read json data in req body properly. if not included, then body will assigned to undefined
app.use(express.json()) 
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");


app.use("/", authRouter, profileRouter, requestsRouter, userRouter)

//Get user by email
app.get("/userByEmail" , async (req , res) => {
    const userEmail= req.body.emailId
    try{
    //    find - find all the matching documents here with the email
    //    findOne - find only one first matching document here by the email
    //    const user = await User.find({emailId : userEmail}) 
    const user = await User.findOne({emailId : userEmail})
        if (!user)
            res.send("User not found")
        else
            res.send(user)
    }
    catch(err)
    {
    // this block run when there is error in the req - this does not include searching for the user which do not exist
        res.status(400).send("Request unsucessful")
    }
})

//Get user by id
app.get("/userById" , async (req , res) => {
    const userId= req.body.userId
    try{
    const user = await User.findById(userId)
        if (!user)
            res.send("User not found")
        else
            res.send(user)
    }
    catch(err)
    {
        res.status(400).send("Request unsucessful")
    }
})

//Get all users
app.get("/feed" , async (req , res) => {
    try{
        const users = await User.find({})
        res.send(users)
     }
     catch(err)
     {
        res.status(400).send("Users not found")
     }
})

//Delete user by find by id
app.delete("/user" , async (req , res) => {
    const userId = req.body.userId
    try{
        const user = await User.findByIdAndDelete(userId)
        //const user = await User.findByIdAndDelete(_id : userId})
        if (!user)
            res.send("User not found")
        else
        res.send("User deleted successfully")
     }
     catch(err)
     {
        res.status(400).send("Something went wrong")
     }

})

//Update user by find by id
app.patch("/user/:userId" , async (req , res) => { 
    // const userId = req.body.userId
    const userId = req.params.userId
    const data = req.body
   
    try{
         //To update only specific fields- restricting user to update the email field
        const ALLOWED_UPDATES=["photoUrl", "about", "skills", "age", "gender"]
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
        if(!isUpdateAllowed)
            throw new Error("Update not allowed");    
        const user = await User.findByIdAndUpdate( userId, data, {returnDocument: "after", runValidators: true,})
        if (!user)
            res.send("User not found")
        else
        res.send("User updated successfully")
    }
    catch(err)
    {
        res.status(400).send("Something went wrong"+err.message)
    }
    
})




connectDB().then(() => {
    console.log("Database connected successfully")
 })
 .catch((err) => {
    console.log("Database connection failed")
    console.log(err)
 })

const PORT=3000;
app.listen(PORT,()=>{console.log(`server is running at port ${PORT}`)}) ;