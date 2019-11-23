const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const {Schedule} = require("../models");

const moment = require('moment');

const whatToTake = async(req, res, next) => {
    const hour = moment().format('hh');
    var query = "SELECT scheName AS medicineList_toTake, scheID AS askWhatToTake_scheID " + 
        "from SCHEDULES WHERE scheDate=DATE(:scheDate) AND userID=:userID" + 
        "AND (scheHour BETWEEN :hour-1 AND :hour+1)";
    await sequelize.query(query, 
            {replacements: {scheDate: moment().format('YYYY-MM-DD'), userID: 1, hour: hour}, type: Sequelize.QueryTypes.SELECT}
    ).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
        next(error);
    });
}

const medication_yes = async(req, res, next) => {
    await Schedule.update({intake: true},{
        where: {
            scheID : req.body.action.parameters.askWhatToTake_scheID
        }
    }).catch(error => {
        console.error(error);
        next(error);
    })
}

module.exports = {
    whatToTake,
    medication_yes
};