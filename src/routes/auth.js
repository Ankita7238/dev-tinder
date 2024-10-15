const express = require ("express");
const bcrypt = require ("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router()

authRouter.post("/signup", async (req , res) => {
    // const user = new User ({
    //     firstName: "Ankita",npm i jsonwebtoken
    //     lastName: "Singh",
    //     emailId: "ankita@gmail.com",
    //     password: "ankita123"
    // })
    try{
        validateSignUpData(req)
        
        const { firstName, lastName, emailId, password, gender, age } = req.body;

        const passwordHash = await bcrypt.hash(password,10)
        const user = new User ({
            firstName,
            lastName, 
            emailId, 
            password: passwordHash,
            gender,
            age
        })
        await user.save()
        res.send("User signed up successfully")
    }
    catch(err){
        res.status(400).send("Error Signing up:" + err.message)
    }    
})

authRouter.post("/login", async (req , res) => {

    try{
        const {emailId, password} = req.body
        const user= await User.findOne({emailId:emailId})
        if(!user)
            return res.send("INVALID CREDENTIALS")
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid)
        {
            const token = await user.getJWT()
            res.cookie("token", token, {expires: new Date( Date.now() + 7 * 24 * 60 * 60 * 1000)})
            return res.send("Login successful")
        }     
        else
            return res.send("can not logged in -invalid credentials")
    }
    catch(err){
        return res.status(400).send("Error logging in:" + err.message)
    }  
})

authRouter.post("/logout", async (req , res) => {

    try{
        res.cookie("token", null, {expires: new Date( Date.now() )})
        res.send("Logout successful")
    }
    catch(err){
        return res.status(400).send("Error logging in:" + err.message)
    }  
})
module.exports = authRouter