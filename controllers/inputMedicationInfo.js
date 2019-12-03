const { Schedule, Medicine, MediSchedule } = require("../models");

const moment = require('moment-timezone');
const json = require('./responseController');

const insertAlarm = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);
    try {
        //NUGU SPEAKER에서는 시간을 하나만 입력받음
        //time이 23:00형식으로 받아지기 때문에, ':'을 기준으로 hour과 minute를 나누는 함수
        let startDate = moment().format('YYYY-MM-DD');
        var dateFormat = (moment().tz('Asia/Seoul').format('YYYY')).toString() + req.body.action.parameters.endDate_month.value + req.body.action.parameters.endDate_day.value;
        let endDate = moment(dateFormat).format('YYYY-MM-DD');
        let tempDate = moment().format('YYYY-MM-DD');

        let hour = parseInt(req.body.action.parameters.alarmTime_hour.value);
        let min = 0;

        if((req.body.action.parameters).hasOwnProperty('alarmTime_min')){
            min = parseInt(req.body.action.parameters.alarmTime_min.value);
        }

        if(startDate>endDate){
            throw new Error("시작일이 종료일보다 큽니다.");
        }

        while(tempDate <= endDate){
            if(alarmTime_duration === 'PM'){
                hour = hour + 12;
                if(hour >= 24){
                    hour = hour - 24
                }
            }
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
            //Date를 다음 일자로 넘김.
            tempDate = moment(tempDate).add(1, 'd');
        }
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