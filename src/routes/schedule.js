const { Router } = require('express');
const schedule = require('../controllers/schedule');
const { validate } = require("../middlewares");
const validator = require("../validator/schedule");

const routes = Router();

routes.post(
    "/create-schedule", 
    validate(validator.createSchedule), 
    schedule.createSchedule
);
routes.get(
    "/get-schedule", 
    validate(validator.getSchedule), 
    schedule.getSchedule
);
routes.get(
    "/get-all-schedules", 
    schedule.getAllSchedules
);
routes.delete(
    "/delete-schedule", 
    validate(validator.deleteSchedule), 
    schedule.deleteSchedule
);

module.exports = routes;