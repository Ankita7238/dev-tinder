const mongoose= require("mongoose")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcrypt")

const userSchema= new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        required: [true, 'First name is required'],  // Field is required
        trim: true,  // Removes whitespace from both ends of the string
        minlength: [2, 'First name must be at least 2 characters long'],  // Minimum length validation
        maxlength: [30, 'First name must be less than 30 characters long'],  // Maximum length validation
        match: [/^[A-Za-z]+$/, 'First name can only contain alphabetic characters']  // Alphabetic characters only
    },
    lastName:{
        type: String,
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [30, 'Last name must be less than 30 characters long'],
        match: [/^[A-Za-z]+$/, 'Last name can only contain alphabetic characters']
    },
    emailId:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim : true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required : true
    },
    age:{
        type: Number,
        required: [true, 'Age is required'], // Field is required
        min: [18, 'Age must be at least 18'],
        validate: {
            validator: function(value) {
                // Custom validation logic
                return Number.isInteger(value)
            },
            message: 'Age must be an integer' // Ensure age is an integer
          }
    },
    gender:{
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['Male', 'Female', 'Other'], // Allowed values for gender
            message: '{VALUE} is not a valid gender. Allowed values are Male, Female, Other.'
        }
    },
    photoUrl:{
        type: String,
    },
    about:{
        type: String,
        default:"Some exciting about yourself that defines you the best",
        minlength: [50, 'About section must be at least 10 characters long.'],
        maxlength: [300, 'About section cannot exceed 300 characters.'],
    },
    Skills:{
        type: [String],
    }

}, 
{timestamps:true}
)
userSchema.methods.getJWT= async function(){
    const user = this
    const token = await jwt.sign({_id: user._id}, "DevTinder@790", {expiresIn: "7d"})
    return token
}

userSchema.methods.validatePassword= async function(inputPassword){
    const user = this
    const hashPassword= user.password // = this.password
    const isPasswordValid = await bcrypt.compare(inputPassword, hashPassword)
    return isPasswordValid
}
const User= mongoose.model("User", userSchema)
module.exports= User