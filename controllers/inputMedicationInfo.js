const { Schedule, Medicine, MediSchedule } = require("../models");

const moment = require('moment-timezone');
const json = require('./responseController');

const insertAlarm = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);
    try {
        //NUGU SPEAKER에서는 시간을 하나만 입력받음
        //time이 23:00형식으로 받아지기 때문에, ':'을 기준으로 hour과 minute를 나누는 함수
        const startDate = moment().format('YYYY-MM-DD');
        const month = parseInt(req.body.action.parameters.endDate_month.value) >= 10 ? req.body.action.parameters.endDate_month.value : '0' + req.body.action.parameters.endDate_month.value;
        const day = parseInt(req.body.action.parameters.endDate_month.value) >= 10 ? req.body.action.parameters.endDate_month.value : '0' + req.body.action.parameters.endDate_day.value;
        const dateFormat =  req.body.action.parameters.endDate_year.value + month + day;
        const endDate = moment(dateFormat).format('YYYY-MM-DD');
        console.log("endDate: ", endDate);
        let tempDate = moment().format('YYYY-MM-DD');

        let hour = req.body.action.parameters.alarmTime_duration.value === 'PM' ? parseInt(req.body.action.parameters.alarmTime_hour.value) + 12 : parseInt(req.body.action.parameters.alarmTime_hour.value);
        hour = hour >= 24 ? hour-24 : hour;
        let min = (req.body.action.parameters).hasOwnProperty('alarmTime_min') === true ? parseInt(req.body.action.parameters.alarmTime_min.value) : 0;

        if(startDate>endDate){
            throw new Error("시작일이 종료일보다 큽니다.");
        }

        while(tempDate <= endDate){
            let schedule = await Schedule.create({
                //테스트를 위해 임시로 1로 둠
                userID: 1,//req.session.user.userID,
                scheName: req.body.action.parameters.alarmName_input.value,
                scheDate: tempDate,
                scheHour: hour,
                scheMin: min,
                startDate: startDate,
                endDate: endDate
            });
        
            //NUGU SPEAKER에서는 약을 하나만 입력받도록 함
            await Medicine.findOrCreate({
                where: { medicineName: req.body.action.parameters.medicineName_input.value },
                attributes: ["medicineID", "medicineName"]
            }).spread( async(medicine) => {
                MediSchedule.create({
                    medicineID: medicine.dataValues.medicineID,
                    scheID: schedule["dataValues"]["scheID"],
                    dose: req.body.action.parameters.dosage_input.value,
                    medicineName: medicine.dataValues.medicineName,
                });
            }).catch((error) => {
                console.error(error);
                next(error);
            });
            //Date를 다음 일자로 넘김.
            tempDate = moment(tempDate).add(1, 'd');
        }
        //RESPONSE SAMPLE 형식에 맞춤
        let resObj = json.resObj();
        resObj.version = req.body.version;
        console.log(resObj);
        res.json(resObj);
        res.end();
        return;
    }catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = { insertAlarm };