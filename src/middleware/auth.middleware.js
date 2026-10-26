
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function userAuthMiddleware(req, res, next) {
    try {
        const authHeader = req.get('Authorization');

        const token =
            req.cookies?.token ||
            (authHeader?.startsWith('Bearer ')
                ? authHeader.split(' ')[1]
                : null);

        if (!token) {
            return res.status(401).json({
                status: 'failed',
                message: 'Authentication token is missing',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                status: 'failed',
                message: 'User not found',
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                status: 'failed',
                message: 'User is blocked',
            });
        }

        req.user = user;

        return next();
    } catch (error) {
        if (
            error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError' ||
            error.name === 'NotBeforeError'
        ) {
            return res.status(401).json({
                status: 'failed',
                message: 'Invalid or expired authentication token',
            });
        }

        return next(error);
    }
}

module.exports = { userAuthMiddleware };
