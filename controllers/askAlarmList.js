const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);
const { Schedule, Medicine, MediSchedule } = require("../models");
const moment = require('moment');

const alarmList = async(req, res, next) => {
    let parameter = req.body.action.parameters;
    //오늘을 요청했을 때
    //오류나면 Object.keys(parameter).equal==='u_today' 해보기
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
}

module.exports = {
    alarmList,
};