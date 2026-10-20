const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY_JWT

function signToken(payload) {
    return jwt.sign(payload, secretKey)
}

function verifyToken(token) {
    return jwt.verify(token, secretKey)
}

module.exports = { signToken, verifyToken }