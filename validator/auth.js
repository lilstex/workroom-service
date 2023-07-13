const Joi = require("joi");

module.exports = {
  accountRegistration: {
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),
    password: Joi.string().required(),
  },

  login: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },

  sendPasswordResetCode: {
    email: Joi.string().email().required(),
  },

  resendEmailVerificationCode: {
    email: Joi.string().email().required(),
  },


  validatePasswordResetCode: {
    email: Joi.string().email().required(),
    passwordCode: Joi.number().required(),
  },

  updateAccount: {
    companyName: Joi.string(),
    phone: Joi.any(),
    address: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    zip: Joi.string(),
    tinNumber: Joi.string(),
    website: Joi.string(),
    accNumber: Joi.string(),
    bankName: Joi.string(),
    logoUrl: Joi.string(),
  },

  updatePassword: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },

};
