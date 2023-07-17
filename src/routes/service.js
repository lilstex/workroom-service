const { Router } = require('express');
const service = require('../controllers/service');
const { validate } = require("../middlewares");
const validator = require("../validator/service");

const routes = Router();

routes.post(
    "/create-service", 
    validate(validator.createService), 
    service.createService
);
routes.get(
    "/get-services", 
    service.getAllServices
);
routes.put(
    "/update-service", 
    validate(validator.updateService), 
    service.updateService
);
routes.delete(
    "/delete-service", 
    validate(validator.deleteService), 
    service.deleteService
);

module.exports = routes;