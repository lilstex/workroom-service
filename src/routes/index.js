const { Router } = require('express');
const authRoutes = require('./auth');
const invoiceRoutes = require('./invoice');
const serviceRoutes = require('./service');
const scheduleRoutes = require('./schedule');
const Response = require('../helpers/response');

const routes = Router();

routes.use("", authRoutes);
routes.use("/invoice", invoiceRoutes);
routes.use("/service", serviceRoutes);
routes.use("/schedule", scheduleRoutes);

routes.use((_, res) => {
    Response.notFoundResponse('Route not found', res);
});

module.exports = routes;