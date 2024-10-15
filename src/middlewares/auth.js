const jwt = require("jsonwebtoken")
const User = require ("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please login");
        } else {
            const decodedMessage = await jwt.verify(token, "DevTinder@790");
            const { _id } = decodedMessage;
            const user = await User.findById(_id);
            if (!user) {
                return res.status(404).send("User does not exist");
            } else {
                req.user = user;
                next();
            }
        }
    } catch (err) {
        console.error("Auth Error:", err); // Log the error
        return res.status(500).send("Error in authentication: " + err.message);
    }
};

module.exports = {userAuth}