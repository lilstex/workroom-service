const Joi = require("joi");

module.exports = {
    createService: {
        serviceName: Joi.string().required(),
    },
    updateService: {
        serviceId: Joi.string().required(),
        serviceName: Joi.string().required(),
    },
    deleteService: {
        serviceId: Joi.string().required(),
    },

}