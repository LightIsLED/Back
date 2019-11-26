const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const {Schedule} = require("../models");
const json = require('./responseController');

const moment = require('moment');

const whatToTake = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);

    //현재 시간으로부터 전후 1시간에 울릴 알람 리스트
    const hour = moment().format('hh').tz('Asia/Seoul');

    var query = "SELECT scheName, scheID " + 
        "from SCHEDULES WHERE scheDate=DATE(:scheDate) AND userID=:userID " + 
        "AND (scheHour BETWEEN :hour-1 AND :hour+1)";
    
    await sequelize.query(query, 
            {replacements: {scheDate: moment().format('YYYY-MM-DD').tz('Asia/Seoul'), userID: req.body.action.parameters.userID_2.value, hour: parseInt(hour)}, type: Sequelize.QueryTypes.SELECT}
    ).then(results => {
        //울릴 알람이 여러개일 경우
        let alarmNameList = '';
        let scheIDList = '';
        for(var i = 0; i < results.length; i++){
            alarmNameList = alarmNameList +results[i].scheName;
            scheIDList = scheIDList + results[i].scheID;
            if(i < results.length -1){
                alarmNameList = alarmNameList + ', ';
                scheIDList = scheIDList + ', ';
            }
        }

        //RESPONSE SAMPLE 형식에 맞춤
        let resObj = json.resObj();
        resObj.version = req.body.version;
        resObj.output.medicineList_toTake = alarmNameList;
        resObj.output.askWhatToTake_scheID = scheIDList;

        console.log(resObj);

        res.json(resObj);
        res.end();
        return;
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