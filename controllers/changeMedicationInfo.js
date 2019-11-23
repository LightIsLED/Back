const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);
const {Schedule} = require("../models");

const alarmNameToChange = async(req, res, next) => {
    const alarmName = req.body.action.parameters.AlarmName;
    var query = 'SELECT scheID AS changeMedicationInfo_scheID' + 
    'FROM SCHEDULES WHERE scheName=:alarmName';

    sequelize.query(query, 
        {replacements: {alarmName : alarmName}, type: Sequelize.QueryTypes.SELECT}
    ).then(result => {
        res.json(result);
    }).catch(error => {
        console.error(error);
    });
}

const endDateToChange = async(req, res, next) => {
    Schedule.find({
        where: {scheID: req.body.action.parameters.changeMedicationInfo_scheID},
        attributes: ['endDate']
    }).then((end)=> {
        if(Date.parse(end.dataValues.endDate) <= Date.parse()){
            
        }
    })
}

module.exports = {
    alarmNameToChange,
};