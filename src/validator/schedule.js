const Joi = require("joi");

module.exports = {
    createSchedule: {
        title: Joi.string().required(),
        date: Joi.any().required(),
        startTime: Joi.any().required(),
        endTime: Joi.any(),
    },
    getSchedule: {
        scheduleId: Joi.string().required(),
    },
    deleteSchedule: {
        scheduleId: Joi.string().required(),
    },

}