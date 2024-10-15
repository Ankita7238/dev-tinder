const express = require ("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router()

profileRouter.get("/profile/view", userAuth, async (req , res) => {
    try{
        const user = req.user
        res.send(user)
        }  
    catch(err){
        return res.status(400).send("Error logging in:" + err.message)
    }  
})

profileRouter.patch("/profile/edit", userAuth, async (req , res) => {
    try{
        if(!validateEditProfileData){
            throw new Error("Invalid Edit request")
        }
        const loggedinUser = req.user
        Object.keys(req.body).forEach((key) => (loggedinUser[key]=req.body[key]))
        await loggedinUser.save()
        res.send("Profile updated successfully")

        }  
    catch(err){
        return res.status(400).send("Error logging in:" + err.message)
    }  
})

module.exports = profileRouter