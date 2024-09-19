const express = require('express')

const router = express.Router()

const {body} = require('express-validator')
 
const courseController = require('../Contoller/coursesController')
const { vaildationSchema } = require('../midelWare/vaildationSchema')
const verifyToken = require('../midelWare/verifyToken')
const userRoles = require('../utils/userRoles')
const allowedTo = require('../midelWare/allowedTo')
const upload = require('../midelWare/multer')
// COURSES CRUD API


//Get all courses

router.route('/search')
        .get(courseController.search)

        
router.route('/')
            .get(courseController.getAllcourses)
            .post(vaildationSchema(), upload.fields([
                { name: 'thumbnail', maxCount: 1 },  // Single thumbnail image
                { name: 'videos', maxCount: 5 }      // Up to 5 video files
            ]),
                courseController.addCourse)

//Get Course by Id
router.route('/:courseId')
        .get(courseController.getSingleCoures)
        .patch(vaildationSchema(), courseController.updateCourse)
        .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), courseController.deleteCourse)


router.route('/:courseId/addVideosToCourse')
                .put((req, res, next) => {
                upload.array('videos')(req, res, (err) => {
                if (err) {
                        console.error('Upload error:', err);
                        return res.status(500).json({ message: 'File upload error', error: err.message });
                }
                console.log('Files received:', req.files);
                next();
                });
    }, courseController.addVideosToCourse);


module.exports=router