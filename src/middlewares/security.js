const jwt = require('jsonwebtoken');
const Response = require('../helpers/response');

const nonRestricted = [
    "/create-account",
    "/login",
    "/send-password-reset-code",
    "/resend-email-verification-code",
    "/validate-password-reset-code",
    "/update-password",
]

module.exports = (req, res, next) => {
    if(nonRestricted.includes(req.path)) {
        next();
    } else {
        // Verify the token
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            jwt.verify(token, process.env.JWT_KEY, (err, user) => {
                if(err) {
                    return Response.forbiddenResponse('Token is invalid or has expired!', res);
                }
                req.auth = user;
                next();
            });
        } else {
            return Response.unAuthorizedResponse('You are not authorized!', res);
        }
    }
}