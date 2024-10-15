const express = require("express");
const { userAuth } = require("../middlewares/auth"); // Assuming you have auth middleware
const requestsRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest"); // Properly import the model
const User = require("../models/user");

requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  
    try {
        const fromUserId = req.user._id; // Assuming `userAuth` middleware attaches the user object
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Validate status to ensure it's in allowed values
        const validStatuses = ["ignored", "interested"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status type" });
        }

        const istoUserId = await User.findById(toUserId)
        if(!istoUserId)
        {
            return res.status(400).json({ message: "User do not exist" });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {toUserId,fromUserId},
                {toUserId:fromUserId,fromUserId:toUserId}
            ]
        })
        if(existingConnectionRequest)
        {
            return res.status(400).send("Connection request already exists")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();
        res.json({ message: "Connection request sent successfully", data });
    } catch (err) {
        return res.status(400).json({ message: "Error processing request: " + err.message });
    }
});

requestsRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user
        const {status , requestId} = req.params
        const validStatuses = ["accepted", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status type" });
        }
        const connectionRequest =await ConnectionRequest.findOne({
            _id : requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
        if(!connectionRequest)
        {
            return res.status(400).json({ message: "Invalid connection request - not found" });
        }
        connectionRequest.status = status
        const data = await connectionRequest.save()
        return res.json({ message: "connection request"+ status , data
        }
        );
    }
    catch(err)
    {
        return res.status(400).json({ message: "Error processing request: " + err.message });
    }
}
)
module.exports = requestsRouter;
