const { Client } = require('../model');
const Response = require('../helpers/response');

const createClient = async(invoiceTo, authId) => {
    try{
        const clientExist = await Client.findOne({email: invoiceTo.email});
        if(clientExist) {
            return {
                status: true,
                message: 'Client already exist',
                data: clientExist,
            }
        }
        const newClient = await Client.create({ 
            client: authId,
            email: invoiceTo.email,
            name: invoiceTo.name,
            phone: invoiceTo.phone,
            address: invoiceTo.address,
        });
        return {
            status: true,
            message: 'Client created successfully',
            data: newClient,
        }
    } catch(err) {
        return {
            status: false,
            message: 'Error creating client'
        }
    }
}

const getAllClients = async(req, res) => {
    try{
        const { page } = req.query;
        const authId = req.auth.id;
        const pageCount = 15;
        const totalClients = await Client.countDocuments({client: authId});
        const allClients = await Client.find({account: authId})
            .limit(pageCount)
            .skip(pageCount * (page - 1))
            .sort({ createdAt: -1 });

        if(!allClients) {
            return Response.UnprocessableResponse(`Error fetching all clients`, res);
        }
        return Response.paginatedSuccessResponse('Clients retrieved successfully', page, totalClients, pageCount, allClients, res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in get all clients endpoint',
            res, err
        );
    }
}

const deleteClient = async(req, res) => {
    try{
        const { clientId } = req.body;
        const authId = req.auth.id;
        //Check if client exist
        const client = await Client.findOne({_id: clientId, account: authId});
        if(!client) {
            return Response.UnprocessableResponse("Client does not exist", res);
        }

        await Client.deleteOne({_id: clientId, account: authId});

        return Response.simpleResponse('Client deleted successfully', res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in delete client endpoint',
            res, err
        );
    }
}

const updateClient = async(req, res) => {
    try{
        const authId = req.auth.id;
        const { clientId, name, address, phone, email} = req.body;
        //Check if client exist
        const client = await Client.findOne({_id: clientId, account: authId});
        if(!client) {
            return Response.UnprocessableResponse("Client does not exist", res);
        }
        //Update client details
        client.email = email !== undefined ? email : client.email;
        client.address = address !== undefined ? address : client.address;
        client.phone = phone !== undefined ? phone : client.phone;
        client.name = name !== undefined ? name : client.name;
        await client.save();

        return Response.simpleResponse('client updated successfully', res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in update client endpoint',
            res, err
        );
    }
}

const viewClient = async(req, res) => {
    try{
        const { clientId } = req.query;
        const authId = req.auth.id;
        const client = await Client.findOne({account: authId, _id:  clientId});
        if(!client) {
            return Response.UnprocessableResponse("Client does not exist", res);
        }
        return Response.successResponse('Client retrieved successfully', client, res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in get client by ID endpoint',
            res, err
        );
    }
}



module.exports = {
    createClient,
    getAllClients,
    updateClient,
    viewClient,
    deleteClient,
}