const {User} = require('../models/userModel')
const {Course} = require('../models/coursesModel')
const asyncWrapper = require('../midelWare/aysncWrapper')
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")
const bcrypt = require('bcrypt');
const aysncWrapper = require('../midelWare/aysncWrapper');
const JWT = require('jsonwebtoken')
const genrateJwt = require('../utils/genrateJWT');
const { error } = require('jsend');

//User Crud Api
const getAllUsers = asyncWrapper(
    async (req, res, next) => {
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page - 1) * limit;

        const Users = await User.find({}, { __v: false, "password": false }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: {Users } });
    }
);



const getUser = asyncWrapper(
    async(req, res, next) => {
        const userId = req.params.userId;
        const user = await User.findById(userId, {"__v": false, password: false, token: false});
        if (!user){
            const error = appError.create("no user found with this Id", 404, httpStatusText.FAIL);
            next(error);
        };
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: {user} });

    }

);



const deleteUser = asyncWrapper(
    async(req, res, next) => {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser){
            const error = appError.create("no user found with this Id", 404, httpStatusText.FAIL);
            next(error);
        }
        return res.status(200).json({status: httpStatusText.SUCCESS, data: `user ${deletedUser.email} deleted successfully`});
    }
);



const updateUser = asyncWrapper(
    async(req, res, next) => {
        const userId = req.params.userId;
        const updatedUser = await User.findByIdAndUpdate(userId, {$set : {...req.body}});
        if (!updatedUser){
            const error = appError.create("no user found with this is id", 404, httpStatusText.FAIL);
            next(error);
        }
        return res.status(200).json({status: httpStatusText.SUCCESS,msg: "user updated successfully", data: updatedUser});
    }
)




const enrollToCourse = asyncWrapper(async (req, res) => {
      const { userId, courseId } = req.params;
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the course by ID
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Check if the user is already enrolled in the course
      if (user.enrolledCourses.includes(courseId)) {
        return res.status(400).json({ message: 'User is already enrolled in this course' });
      }
  
      // Add the course to the user's enrolledCourses array
      user.enrolledCourses.push(courseId);
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: 'Enrolled in course successfully', user });
  });



const getUserEnrolledCourses = asyncWrapper(async (req, res) => {

      const { userId } = req.params;
  
      // Find the user by ID and populate the enrolledCourses field
      const user = await User.findById(userId).populate('enrolledCourses');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user's enrolled courses
      res.status(200).json({ enrolledCourses: user.enrolledCourses });
  });
  
  


//Auth process

const register = asyncWrapper(
    async(req, res, next) => {
        const {fullName, email, password, passwordConfirmation ,role} = req.body
        const user = await User.findOne({email: email});
        console.log(user)
        if(user){
            const error = appError.create("user already exists", 400, httpStatusText.FAIL)
            return next(error)

        }
        if(password === passwordConfirmation){

        //password hashing
            hashedPassword = await bcrypt.hash(password, 10)
            if(req.file && req.file.filename)
                {

                    const newUser = new User({
                        fullName,
                        email,
                        password: hashedPassword,
                        passwordConfirmation: hashedPassword,
                        role,
                        avatar: req.file.filename || 'profile.png'
                        }
                    )
                    const token = await genrateJwt({email: newUser.email, id: newUser._id, role: newUser.role})
                    newUser.token = token
                    
                    await newUser.save();
                    return res.status(201).json({ status: httpStatusText.SUCCESS, data: newUser });
                }else{
                    const newUser = new User({
                        fullName,
                        email,
                        password: hashedPassword,
                        passwordConfirmation: hashedPassword,
                        role
                    })
                        //genrate JWT token 
                        const token = await genrateJwt({email: newUser.email, id: newUser._id, role: newUser.role})
                        newUser.token = token
                        
                        await newUser.save();
                        return res.status(201).json({ status: httpStatusText.SUCCESS, data: newUser });
                }

        }
        


});


const login = aysncWrapper(async (req, res, next) => {
    const {email, password} = req.body;
    if (!email && !password){
        const error = appError.create("email and password are requird", 400, httpStatusText.FAIL)
        return next(error)
    }
    const user = await User.findOne({email: email})
    if(!user){
        const error = appError.create("user not exists", 400, httpStatusText.FAIL)
        return next(error)
    }
    const matchedPassword = await bcrypt.compare(password, user.password)
    if(!matchedPassword){
        const error = appError.create("Wrong Password", 400, httpStatusText.FAIL)
        return next(error)
    }
    if (user && matchedPassword){
        const token = await genrateJwt({email: user.email, id: user._id, role: user.role})
        return res.status(200).json({token:token, email:user.email, id:user._id, role: user.role})
    }

});



module.exports = {
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    enrollToCourse,
    getUserEnrolledCourses,
    register,
    login
}