const { Router } = require('express');
const auth = require('../controllers/auth');
const { validate } = require("../middlewares");
const validator = require("../validator/auth");

const routes = Router();

routes.post(
    "/create-account", 
    validate(validator.accountRegistration), 
    auth.accountRegistration
);

routes.post(
    "/login", 
    validate(validator.login), 
    auth.login
);

routes.post(
    "/send-password-reset-code", 
    validate(validator.sendPasswordResetCode), 
    auth.sendPasswordResetCode
);

routes.post(
    "/validate-password-reset-code", 
    validate(validator.validatePasswordResetCode), 
    auth.validatePasswordResetCode
);

routes.post(
    "/resend-email-verification-code", 
    validate(validator.resendEmailVerificationCode), 
    auth.resendEmailVerificationCode
);


routes.post(
    "/update-password", 
    validate(validator.updatePassword), 
    auth.updatePassword
);

routes.post(
    "/update-account", 
    validate(validator.updateAccount), 
    auth.updateAccount
);

routes.get(
    "/get-user-details",  
    auth.getUserDetails
);

routes.delete(
    "/delete-user-account",  
    auth.deleteUserAccount
);

module.exports = routes;