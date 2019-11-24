const {
    alarmListToday
} = require("../controllers/askAlarmList")

const {
    whatToTake,
    medication_yes
} = require("../controllers/askWhatToTake")

const{
    alarmNameToChange
} = require("../controllers/changeMedicationInfo")

const express = require("express");
const router = express.Router();

//Answer.alarmList
router.post('/alarmListToday', alarmListToday);
router.post('/Answer.alarmListToday', alarmListToday);
//Ask.whatToTake
router.post('/whatToTake', whatToTake);
router.post('/medication_yes', medication_yes);

//Change.medicationInfo
router.get('/alarmNameToChange', alarmNameToChange);

module.exports = router;
