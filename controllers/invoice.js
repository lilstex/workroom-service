const Response = require('../helpers/response');
const { Invoice, Service, Client } = require('../model');
const { createClient } = require('./client');

const createInvoice = async(req, res) => {
    try{
        const { service, invoiceTo, ...invoiceData } = req.body;
        const authId = req.auth.id;
        //Generate an invoice number based on the invoice service
        const serviceExist = await Service.findOne({
            serviceName: service
        });
        if(!serviceExist) {
            return Response.UnprocessableResponse(`This service <${service}> has not been created. Please create the service`, res);
        }

        //Update the service invoice number count
        const newInvoiceNumber = serviceExist.numOfInvoices + 1;
        serviceExist.numOfInvoices = newInvoiceNumber;
        await serviceExist.save(); 
        const serviceCode = serviceExist.code;
        const invoiceNumber = `${serviceCode}${newInvoiceNumber}`;

        // Create the client and use the id to generate the invoice
        if(invoiceTo.email) { // Check if client has email and proceed to create
           const { data } = await createClient(invoiceTo, authId);
            if(data) {
                const newInvoice = await Invoice.create({
                    account: authId,
                    client: data.id,
                    service: service,
                    invoiceNumber: invoiceNumber,
                    ...invoiceData,
                });
                if(!newInvoice) {
                    return Response.UnprocessableResponse('Unable to create invoice', res)
                }
                return Response.createdResponse('Invoice created successfully', newInvoice, res)
            }

            const newInvoice = await Invoice.create({
                account: authId,
                service: service,
                invoiceNumber: invoiceNumber,
                ...invoiceData,
            });
            if(!newInvoice) {
                return Response.UnprocessableResponse('Unable to create invoice', res);
            }
            return Response.createdResponse('Invoice created successfully', newInvoice, res);
        } else {
            const newInvoice = await Invoice.create({
                account: authId,
                service: service,
                invoiceNumber: invoiceNumber,
                ...invoiceData,
            });
            if(!newInvoice) {
                return Response.UnprocessableResponse('Unable to create invoice', res);
            }
            return Response.createdResponse('Invoice created successfully', newInvoice, res);
            
        }
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in Invoice Creation endpoint',
            res, err
        );
    }
}

const getAllInvoices = async(req, res) => {
    try{
        const { page } = req.query;
        const authId = req.auth.id;
        const pageCount = 15;
        const totalInvoices = await Invoice.countDocuments({account: authId});
        const allInvoices = await Invoice.find({account: authId})
            .limit(pageCount)
            .skip(pageCount * (page - 1))
            .sort({ createdAt: -1 });

        if(!allInvoices) {
            return Response.UnprocessableResponse(`Error fetching all invoices`, res);
        }
        return Response.paginatedSuccessResponse('Invoices retrieved successfully', page, totalInvoices, pageCount, allInvoices, res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in get all invoices endpoint',
            res, err
        );
    }
}

const getInvoice = async(req, res) => {
    try{
        const { invoiceNumber } = req.query;
        const authId = req.auth.id;
        const invoice = await Invoice.findOne({account: authId, invoiceNumber:  invoiceNumber});
        if(!invoice) {
            return Response.UnprocessableResponse("Invoice does not exist", res);
        }
        return Response.successResponse('Invoice retrieved successfully', invoice, res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in get invoice by invoice number endpoint',
            res, err
        );
    }
}

const getTotalInvoices = async(req, res) => {
    try{
        const authId = req.auth.id;
        const totalInvoices = await Invoice.countDocuments({account: authId});
        const totalClients = await Client.countDocuments({account: authId});
        const data = {
            totalInvoices: totalInvoices,
            totalClients: totalClients,
        };
        return Response.successResponse('Total number of invoices and clients retrieved successfully', data, res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in get all invoices endpoint',
            res, err
        );
    }
}

const deleteInvoice = async(req, res) => {
    try{
        const { invoiceId } = req.body;
        const authId = req.auth.id;
        //Check if invoice exist
        const invoice = await Invoice.findOne({_id: invoiceId, account: authId});
        if(!invoice) {
            return Response.UnprocessableResponse("invoice does not exist", res);
        }

        await Invoice.deleteOne({_id: invoiceId, account: authId});

        return Response.simpleResponse('Invoice deleted successfully', res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in delete invoice endpoint',
            res, err
        );
    }
}


module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoice,
    getTotalInvoices,
    deleteInvoice,
}