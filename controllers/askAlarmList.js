const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const moment = require('moment');
const json = require('./responseController');

const alarmListToday = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);
    console.log('userID: '. req.body.action.parameters.userID_1);

    var query = "SELECT DISTINCT scheName " + 
        "from SCHEDULES WHERE userID=:userID";//scheDate=DATE(:scheDate) AND
        await sequelize.query(query, 
            {replacements:  {userID: 1}, type: Sequelize.QueryTypes.SELECT}//{scheDate: moment().format('YYYY-MM-DD')
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

const alarmListTheDay = async(req, res, next) => {
    console.log(req.body.action.parameters);
    console.log('userID: ', req.body.action.parameters.userID_1);
    console.log('theDay: ', req.body.action.parameters.u_theDay);
    console.log('theMonth: ',req.body.action.parameters.u_theMonth);
    res.end();
    return;

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
    alarmListToday,
    alarmListTheDay
};