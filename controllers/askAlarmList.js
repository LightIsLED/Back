const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const moment = require('moment');
const json = require('./responseController');

const alarmList = async(req, res, next) => {
    var scheDate = moment().format('YYYY-MM-DD');
    if(!(req.body.action.parameters).hasOwnProperty('u_today')){
        var dateFormat = (moment().format('YYYY')).toString() + req.body.acton.parameters.u_theMonth.value + req.body.action.parameters.u_theDay.value;
        scheDate = moment(dateFormat).format('YYYY-MM-DD');

    }

    console.log(req.body);
    console.log(req.body.action.parameters);

    var query = "SELECT DISTINCT scheName " + 
        "from SCHEDULES WHERE scheDate=DATE(:scheDate) AND userID=:userID";
        await sequelize.query(query, 
            {replacements:  {scheDate: scheDate, userID: req.body.action.parameters.userID_1.value}, type: Sequelize.QueryTypes.SELECT}
        ).then((results) => {
            console.log(results);
            let resultList = '';
            for(var i = 0; i < results.length; i++){
                resultList = resultList +results[i].scheName;
                if(i < results.length -1){
                    resultList = resultList + ', '
                }
            }
            let resObj = json.resObj();

            resObj.version = req.body.version;
            resObj.output.medicineList_today = resultList;

            console.log(resObj);
            res.json(resObj);
            res.end();
            return;
        }).catch((error) => {
            console.error(error);
            next(error);
        });
}

/*
    else if(parameter.u_today === null && (parameter.u_themonth!= null && parameter.u_theDay!=null)){
        var date = moment([moment().format('YYYY'), parameter.u_themonth, parameter.u_theDay]).format('YYYY-MM-DD');
        var query = "SELECT DISTINCT scheName AS medicineList_theDay " + 
        "from SCHEDULES WHERE scheDate=DATE(:scheDate) AND userID=:userID";
        await sequelize.query(query, 
            {replacements: {scheDate: date, userID: 1}, type: Sequelize.QueryTypes.SELECT}
        ).then((result) => {
            console.log(result);
            //JSON 형식 수정 필요
            res.json(result);
        }).catch((error) => {
            console.error(error);
            next(error);
        });
    }
*/

module.exports = {
    alarmList
};