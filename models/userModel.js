const validator = require('validator');
const mongoose = require('mongoose')
const userRoles = require('../utils/userRoles')


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "filed must be a valid email address"]
    },
    password: {
        type: String,
        required: true
    },
    passwordConfirmation: {
        type: String,
        required: true
    },
    token:{
        type: String
    },
    role: {
        type: String,
        enum: [userRoles.ADMIN, userRoles.MANGER, userRoles.USER],
        default: userRoles.USER
    },
    avatar:
    {
        type: String,
        default:'uploads/profile.png'

    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
})


const User = mongoose.model('User', userSchema)

module.exports = {
    User
}