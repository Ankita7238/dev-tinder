const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://ankita:hellomynameisanku@devtinder.rgtvc.mongodb.net/devtinder")
}
 module.exports = connectDB