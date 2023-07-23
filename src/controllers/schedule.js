const Response = require('../helpers/response');
const generalHelper = require('../helpers/generalHelper');
const { Schedule } = require('../model');

const createSchedule = async(req, res) => {
    try{
        const { title, date, startTime, endTime } = req.body;
        const authId = req.auth.id;
        const newSchedule = await Schedule.create({
            account: authId,
            title: title,
            date: date,
            startTime: startTime,
            endTime: endTime
        });
        if(!newSchedule) {
            return Response.UnprocessableResponse('Unable to create a schedule', res);
        }
        return Response.createdResponse('Schedule created successfully', newSchedule, res);
            
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in Schedule Creation endpoint',
            res, err
        );
    }
}

const getAllSchedules = async(req, res) => {
    try{
        const authId = req.auth.id;
        const allSchedules = await Schedule.find({account: authId});

        if(!allSchedules) {
            return Response.UnprocessableResponse(`Error fetching all schedules`, res);
        }
        return Response.successResponse('Schedules retrieved successfully', allSchedules, res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in get all schedules endpoint',
            res, err
        );
    }
}

const deleteSchedule = async(req, res) => {
    try{
        const { scheduleId } = req.body;
        const authId = req.auth.id;
        //Check if schedule exist
        const schedule = await Schedule.findOne({_id: scheduleId, account: authId});
        if(!schedule) {
            return Response.UnprocessableResponse("Schedule does not exist", res);
        }

        await Schedule.deleteOne({_id: scheduleId, account: authId});

        return Response.simpleResponse('Schedule deleted successfully', res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in delete schedule endpoint',
            res, err
        );
    }
}

const getSchedule = async(req, res) => {
    try{
        const authId = req.auth.id;
        const { scheduleId } = req.query;
        const schedule = await Schedule.findOne({account: authId, _id:  scheduleId});
        if(!schedule) {
            return Response.UnprocessableResponse("Schedule does not exist", res);
        }
        return Response.successResponse('Schedule retrieved successfully', schedule, res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in get schedule endpoint',
            res, err
        );
    }
}

module.exports = {
    createSchedule,
    getAllSchedules,
    getSchedule,
    deleteSchedule,
}