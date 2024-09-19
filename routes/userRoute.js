const express = require('express')

const router = express.Router()

const {body} = require('express-validator')
 
const usersController = require('../Contoller/usersController')
const verifyToken = require('../midelWare/verifyToken')
const multer = require('multer')
const appError = require('../utils/appError')
const diskStorage = multer.diskStorage({
    destination:  function(req, file, cb){
        // console.log(file)
        cb(null, 'uploads');
    },
    filename: function(req, file, cb){
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType === "image"){
        return cb(null, true)
    }else{
        return cb(appError.create('the file must be an image',400 ),false)
    }
}

const upload = multer({ storage:diskStorage, 
    fileFilter
})


// Users CRUD API


//Get all users
// register
router.route('/')
            .get(verifyToken, usersController.getAllUsers)


router.route('/:userId')
            .get(verifyToken, usersController.getUser)
            .delete(verifyToken, usersController.deleteUser)
            .patch(verifyToken, usersController.updateUser)


router.route('/:userId/enroll/:courseId')
            .post(verifyToken, usersController.enrollToCourse);


router.route('/:userId/enrolled-courses')
            .get(verifyToken,  usersController.getUserEnrolledCourses);


router.route('/register')
            .post(upload.single("avatar"), usersController.register)


router.route('/login')
            .post(usersController.login)

//Get Course by Id



module.exports=router
