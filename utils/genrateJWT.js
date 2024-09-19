const JWT = require('jsonwebtoken')

module.exports = async (payload) => {
    const token = await JWT.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '40m'});
    return token;
}