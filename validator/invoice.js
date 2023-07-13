const Joi = require("joi");

module.exports = {
    createInvoice: {
        service: Joi.string().required(),
        products: Joi.array().items(
            Joi.object({
                productName: Joi.string().required(),
                description: Joi.string(),
                rate: Joi.string().required(),
                quantity: Joi.number().required(),
                amount: Joi.string().required(),
            })
        ).required(),
        invoiceTo: Joi.object({
            name: Joi.string().required(),
            email: Joi.string(),
            phone: Joi.any(),
            address: Joi.string().required(),
        }).required(),
        dueDate: Joi.date().required(),
        issuedDate: Joi.date().required(),
        signer: Joi.string().required(),
        signerRole: Joi.string().required(),
        subTotal: Joi.any().required(),
        discount: Joi.any(),
        tax: Joi.any(),
        grandTotal: Joi.any().required(),
    },
    getAllInvoices: {
        page: Joi.number(),
    },
    getInvoice: {
        invoiceNumber: Joi.string().required(),
    },
    deleteInvoice: {
        invoiceId: Joi.string().required(),
    },

    // CLIENTS 

    getAllClients: {
        page: Joi.number(),
    },
    updateClient: {
        clientId: Joi.string().required(),
        name: Joi.string(),
        email: Joi.string(),
        phone: Joi.any(),
        address: Joi.string(),
    },
    viewClient: {
        clientId: Joi.string().required(),
    },
    deleteClient: {
        clientId: Joi.string().required(),
    },

}