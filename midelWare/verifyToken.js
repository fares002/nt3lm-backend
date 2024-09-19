const jwt = require('jsonwebtoken')
const asyncWrapper = require('../midelWare/aysncWrapper')
const appError = require("../utils/appError")
const httpStatusText = require('../utils/httpStatusText')


const verifyToken = asyncWrapper(async (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    if(!authHeader){
        return next(appError.create("token is requird", 401, httpStatusText.FAIL))
    }
    const token = authHeader.split(" ")[1];
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.currentUser = currentUser;

    next()
})

module.exports = verifyToken