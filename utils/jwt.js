const jwt = require('jsonwebtoken');

function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
}

module.exports = { generateToken, verifyToken };