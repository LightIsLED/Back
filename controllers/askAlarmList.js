const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const moment = require('moment');
const json = require('./responseController');

const alarmList = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);

    //오늘 알람 리스트를 물었을 경우
    ///Answer-alarmListToday
    var scheDate = moment().format('YYYY-MM-DD').tz('Asia/Seoul');

    //특정일의 알람 리스트를 물었을 경우
    ///Answer-alarmListTheDay
    if((req.body.action.parameters).hasOwnProperty('u_today') === false){
        var dateFormat = (moment().format('YYYY').tz('Asia/Seoul')).toString() + req.body.action.parameters.u_themonth.value + req.body.action.parameters.u_theDay.value;
        console.log('dateFormat: ', dateFormat);
        scheDate = moment(dateFormat).format('YYYY-MM-DD').tz('Asia/Seoul');
    }
    //쿼리는 공통적
    var query = "SELECT DISTINCT scheName " + 
        "from SCHEDULES WHERE scheDate=DATE(:scheDate) AND userID=:userID";
        await sequelize.query(query, 
            {replacements:  {scheDate: scheDate, userID: req.body.action.parameters.userID_1.value}, type: Sequelize.QueryTypes.SELECT}
        ).then((results) => {
            console.log(results);
            //울릴 알람이 여러개일 경우
            let resultList = '';
            for(var i = 0; i < results.length; i++){
                resultList = resultList +results[i].scheName;
                if(i < results.length -1){
                    resultList = resultList + ', '
                }
            }
            //RESPONSE SAMPLE 형식에 맞춤
            let resObj = json.resObj();
            resObj.version = req.body.version;

            //오늘 알람을 물었을 경우
            if((req.body.action.parameters).hasOwnProperty('u_today') === true){
                resObj.output.medicineList_today = resultList;
            }
            //특정일 알람을 물었을 경우
            else{
                resObj.output.medicineList_theDay = resultList;
            }

            console.log(resObj);
            
            //NUGU에 전달
            res.json(resObj);
            res.end();
            return;
        }).catch((error) => {
            console.error(error);
            next(error);
        });
}

module.exports = {
    alarmList
};