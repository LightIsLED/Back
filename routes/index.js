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

const express = require("express");
const router = express.Router();

//Answer.alarmList
router.get('/alarmList', alarmList);

//Ask.whatToTake
router.get('/whatToTake', whatToTake);
router.get('/medication_yes', medication_yes);

//Change.medicationInfo
router.get('/alarmNameToChange', alarmNameToChange);

module.exports = router;
