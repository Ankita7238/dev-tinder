const express =require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router()

//get all pending requests
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  
    try {
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser,
            status:"interested"
        }).populate("fromUserId" , "firstName lastName age photoUrl gender about Skills")
    // }).populate("fromUserId" , ["firstName", "lastName"]) //array and string both works to populate

        res.json({message:"data fetched successfully", connectionRequests})

    }
    catch (err) {
        return res.status(400).json({ message: "Error processing request: " + err.message });
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  
    try {
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
           $or:[
             {toUserId:loggedInUser, status:"accepted"},
             { fromUserId:loggedInUser,status:"accepted"}
           ]
        }).populate("fromUserId" , "firstName lastName age photoUrl gender about Skills")
        .populate("toUserId" , "firstName lastName age photoUrl gender about Skills")
        
        const data = connectionRequests.map(row => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString())
            {
                return row.toUserId
            }
                return row.fromUserId
        })

        res.json({message:"data fetched successfully", data})

    }
    catch (err) {
        return res.status(400).json({ message: "Error processing request: " + err.message });
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  
    try {
        const loggedInUser = req.user
        const page= req.query.page || 1
        let limit =req.query.limit || 10
        limit = limit>50 ? 50 : limit
        const skip = (page-1)*limit
        const connectionRequest = await ConnectionRequest.find(
            { $or: [
                {fromUserIdid:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]}).select("fromUserId toUserId")

        const hideUserFromFeed = new Set()
        connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())
        })
        const users =await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select("firstName lastName age photoUrl gender about Skills")
        .skip(skip)
        .limit(limit)
        
        res.send(users)
    }
    catch (err) {
        return res.status(400).json({ message: "Error processing request: " + err.message });
    }
});
module.exports = userRouter