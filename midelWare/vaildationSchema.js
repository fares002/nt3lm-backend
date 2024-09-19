
const {body} = require("express-validator")

const vaildationSchema = () => {
    return [body('title')
        .notEmpty()
        .withMessage("title is requird")
        .isLength({min:5})
        .withMessage("title must be at least 5 digits"),
    body('price')
        .notEmpty()
        .withMessage("price is required")]
}


module.exports = {
    vaildationSchema
}