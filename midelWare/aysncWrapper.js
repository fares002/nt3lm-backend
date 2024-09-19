module.exports = (asyncFn) => {
    return (req, res, next) => {
        asyncFn(req, res, next).catch((error) => {
            console.log(error)
            next(error) 
        })
    }
}