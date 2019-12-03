const {
    alarmList
} = require("../controllers/askAlarmList")

const {
    whatToTake,
    medication_yes
} = require("../controllers/askWhatToTake")

const{
    alarmNameToChange
} = require("../controllers/changeMedicationInfo")

const{
    insertAlarm
} = require("../controllers/inputMedicationInfo")

const express = require("express");
const router = express.Router();

//Answer-alarmList
router.post('/Answer-alarmListToday', alarmList);
router.post('/Answer-alarmListTheDay', alarmList);
//Ask-whatToTake
router.post('/Answer-whatToTake', whatToTake);
router.post('/Confirm-medication_yes', medication_yes);

//Change-medicationInfo
router.post('/alarmNameToChange', alarmNameToChange);

//Input-MedicationInfo  
router.post('/Check-alarmInfo_right', insertAlarm);
module.exports = router;
