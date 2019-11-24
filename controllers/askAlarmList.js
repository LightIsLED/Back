const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

const moment = require('moment');
const json = require('./responseController');

const alarmListToday = async(req, res, next) => {
    //오늘을 요청했을 때
    //오류나면 Object.keys(parameter).equal==='u_today' 해보기
    console.log(req.body);
    var query = "SELECT DISTINCT scheName " + 
        "from SCHEDULES WHERE userID=:userID";//scheDate=DATE(:scheDate) AND
        await sequelize.query(query, 
            {replacements:  {userID: 1}, type: Sequelize.QueryTypes.SELECT}//{scheDate: moment().format('YYYY-MM-DD')
        ).then((results) => {
            console.log(results);
            let resultList = [];
            for(var i = 0; i < results.length; i++){
                resultList.push(results[i].scheName);
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
    /*
    let parameter = req.body.action.parameters;

    if(parameter.u_today != null){
        var query = "SELECT DISTINCT scheName AS medicineList_today " + 
        "from SCHEDULES WHERE scheDate=DATE(:scheDate) AND userID=:userID";
        await sequelize.query(query, 
            {replacements: {scheDate: moment().format('YYYY-MM-DD'), userID: 1}, type: Sequelize.QueryTypes.SELECT}
        ).then((result) => {
            console.log(result);
            //JSON 형식 수정 필요
            res.json(result);
        }).catch((error) => {
            console.error(error);
            next(error);
        });
    }
    //특정 일자를 요청했을 때
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
}

module.exports = {
    alarmListToday,
};