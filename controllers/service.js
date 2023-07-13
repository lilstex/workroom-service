const Response = require('../helpers/response');
const generalHelper = require('../helpers/generalHelper');
const { Service } = require('../model');

const createService = async(req, res) => {
    try{
        const { serviceName } = req.body;
        const authId = req.auth.id;
        // check if service name already exist
        const serviceExist = await Service.findOne({
            serviceName: serviceName
        });
        if(serviceExist) {
            return Response.UnprocessableResponse('A service already exist with this name', res);
        }
        // Generate a unique code for a service
        const serviceCode = generalHelper.generateServiceCode(serviceName);
        const newService = await Service.create({
            account: authId,
            serviceName: serviceName,
            code: serviceCode,
        });
        if(!newService) {
            return Response.UnprocessableResponse('Unable to create service', res);
        }
        return Response.createdResponse('Service created successfully', newService, res);
            
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in Invoice Creation endpoint',
            res, err
        );
    }
}

const getAllServices = async(req, res) => {
    try{
        const authId = req.auth.id;
        const allServices = await Service.find({account: authId})
            .sort({ createdAt: -1 });

        if(!allServices) {
            return Response.UnprocessableResponse(`Error fetching all services`, res);
        }
        return Response.successResponse('Services retrieved successfully', allServices, res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in get all services endpoint',
            res, err
        );
    }
}

const deleteService = async(req, res) => {
    try{
        const { serviceId } = req.body;
        const authId = req.auth.id;
        //Check if service exist
        const service = await Service.findOne({_id: serviceId, account: authId});
        if(!service) {
            return Response.UnprocessableResponse("Service does not exist", res);
        }

        await Service.deleteOne({_id: serviceId, account: authId});

        return Response.simpleResponse('Service deleted successfully', res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in delete service endpoint',
            res, err
        );
    }
}

const updateService = async(req, res) => {
    try{
        const authId = req.auth.id;
        const { serviceId, serviceName } = req.body;
        //Check if service exist
        const service = await Service.findOne({_id: serviceId, account: authId});
        if(!service) {
            return Response.UnprocessableResponse("Service does not exist", res);
        }
        //Update service details
        service.serviceName = serviceName !== undefined ? serviceName : service.serviceName;
        await service.save();

        return Response.simpleResponse('Service updated successfully', res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in update service endpoint',
            res, err
        );
    }
}

module.exports = {
    createService,
    getAllServices,
    updateService,
    deleteService,
}