const moment = require('moment-timezone');
const { Schedule, Medicine, MediSchedule } = require("../models");


const insertAlarm = async(req, res, next) => {
    console.log(req.body);
    console.log(req.body.action.parameters);
    try {
        let timeCount = 0;
        //사용자가 알람별로 등록한 시간 갯수에 따라서 루프 돌아감.
        //사용자가 시간을 3개 등록했으면, 3 번 돌아감.
        while (1) {
            //time이 23:00형식으로 받아지기 때문에, ':'을 기준으로 hour과 minute를 나누는 함수
            let time = timeSplit(req.body.time, timeCount);
            let startDate = moment().format('YYYY-MM-DD');
            var dateFormat = (moment().tz('Asia/Seoul').format('YYYY')).toString() + req.body.action.parameters.endDate_input.value[0] + req.body.action.parametersendDate_input.value[1];
            let endDate = moment(dateFormat).format('YYYY-MM-DD');
            let tempDate = moment().format('YYYY-MM-DD');

            if(startDate>endDate){
                throw new Error("시작일이 종료일보다 큽니다.");
            }

            while(tempDate <= endDate){
                let schedule = await Schedule.create({
                    //테스트를 위해 임시로 1로 둠
                    userID: 1,//req.session.user.userID,
                    scheName: req.body.action.parameters.alarmName_input,
                    scheDate: tempDate,
                    scheHour: time[0],
                    scheMin: time[1],
                    startDate: startDate,
                    endDate: endDate
                });
                //Date를 다음 일자로 넘김.
                tempDate = moment(tempDate).add(1, 'd');

                let mediCount = 0;
                //사용자가 알람에 등록한 약 갯수에 따라서 루프 돌아감
                //사용자가 약을 3개 등록했으면, 3 번 돌아감
                while (1) {
                    //focus medicine과 dose를 담는 object
                    let tempMedi = mediSelect(req.body.mediName, req.body.dose, mediCount);
                    //medicine 이름이 DB에 있으면 select, 없으면 insert
                    await Medicine.findOrCreate({
                        where: { medicineName: tempMedi.medicine },
                        attributes: ["medicineID", "medicineName"]
                    }).spread( async(medicine) => {
                        MediSchedule.create({
                            medicineID: medicine.dataValues.medicineID,
                            scheID: schedule["dataValues"]["scheID"],
                            dose: tempMedi.dose,
                            medicineName: medicine.dataValues.medicineName,
                        });
                    }).catch((error) => {
                        console.error(error);
                        next(error);
                    });

                    //다음 약으로 넘어감
                    mediCount = mediCount + 1;

                    //약을 여러개 입력(type이 object일 때) and 약 개수가 초과하지 않았을 때
                    //약을 하나 입력했거나(type이 string일때)
                    if ((typeof(req.body.mediName)=== "object" && !(req.body.mediName[mediCount])) || typeof( req.body.mediName) === "string") {
                        break;
                    }
                }
            }
            timeCount = timeCount + 1;
            if ((typeof(req.body.time) === "object" && !(req.body.time[timeCount])) || typeof req.body.time == "string") {
                break;
            }
        }
        res.redirect('/medicines');
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = { insertAlarm };