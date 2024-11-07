const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responseHandler');
const { STATUS_CODE, MESSAGE } = require('../utils/constants');

// Generate token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role 
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION,
        }
    );
};

// Verify Token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return responseHandler(res, STATUS_CODE.UNAUTHORIZED, MESSAGE.TOKEN_REQUIRED, null);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return responseHandler(res, STATUS_CODE.UNAUTHORIZED, MESSAGE.TOKEN_EXPIRED, null);
            }
            if (err.name === 'JsonWebTokenError') {
                return responseHandler(res, STATUS_CODE.UNAUTHORIZED, MESSAGE.INVALID_TOKEN, null);
            }

            return responseHandler(res, STATUS_CODE.FORBIDDEN, MESSAGE.FAILED_TO_AUTHENTICATE, null);
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role 
        };
        next();
    });
};

module.exports = {
    generateToken,
    verifyToken,
};
