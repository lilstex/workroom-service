const { Router } = require('express');
const invoice = require('../controllers/invoice');
const client = require('../controllers/client');
const { validate } = require("../middlewares");
const validator = require("../validator/invoice");

const routes = Router();

routes.post(
    "/create-invoice", 
    validate(validator.createInvoice), 
    invoice.createInvoice
);
routes.get(
    "/get-all-invoices", 
    validate(validator.getAllInvoices), 
    invoice.getAllInvoices
);
routes.get(
    "/get-invoice-by-invoice-number", 
    validate(validator.getInvoice), 
    invoice.getInvoice
);
routes.get(
    "/get-number-of-invoices-and-clients", 
    invoice.getTotalInvoices
);
routes.delete(
    "/delete-invoice", 
    validate(validator.deleteInvoice), 
    invoice.deleteInvoice
);

// CLIENT ROUTES
routes.get(
    "/get-all-clients", 
    validate(validator.getAllClients), 
    client.getAllClients
);
routes.put(
    "/update-client", 
    validate(validator.updateClient), 
    client.updateClient
);
routes.get(
    "/get-client-by-id", 
    validate(validator.viewClient), 
    client.viewClient
);
routes.delete(
    "/delete-client", 
    validate(validator.deleteClient), 
    client.deleteClient
);



module.exports = routes;