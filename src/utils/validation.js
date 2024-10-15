const validator = require ( "validator")

const validateSignUpData=(req)=>{
    const {firstName, lastName, emailId, password} = req.body

    if((!firstName) || (!lastName))
        throw new Error("name cant be empty")
    else if (!validator.isEmail(emailId))
        throw new Error("Email is not valid")
    else if (!validator.isStrongPassword(password))
        throw new Error("Enter a strong password")
}

const validateEditProfileData=(req)=>{
     //To update only specific fields- restricting user to update the email field
     const ALLOWED_UPDATES=["photoUrl", "about", "skills", "age", "gender", "firstName", "lastName"]
     const isUpdateAllowed = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k))
     return isUpdateAllowed
}
module.exports = { validateSignUpData , validateEditProfileData}