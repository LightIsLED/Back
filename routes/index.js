const {alarmList} = require("../controllers/askAlarmList");
const { whatToTake, medicationYes } = require("../controllers/askWhatToTake");
const { updateEndDate, updateAlarmTime, updateMedicineName } = require("../controllers/changeMedicationInfo");
const { selectAlarmList, updateIntake } = require("../controllers/checkMedicineTaken")
const {findAlarmInfo, deleteAlarm} = require("../controllers/deleteMedicationInfo");
const {insertAlarm} = require("../controllers/inputMedicationInfo");

const express = require("express");
const router = express.Router();

//Answer-alarmList
router.post('/Answer-alarmListToday', alarmList);
router.post('/Answer-alarmListTheDay', alarmList);

//Ask-whatToTake
router.post('/Answer-whatToTake', whatToTake);
router.post('/Confirm-medication', medicationYes);

//Change-medicationInfo
router.post('/Check-endDate', updateEndDate);
router.post('/Check-alarmTime', updateAlarmTime);
router.post('/Check-medicineName', updateMedicineName);

//Check-MedicineTaken
router.post('/Check-alarmTaken', selectAlarmList);
router.post('/Check-MedicineTaken_missing', updateIntake);

//Delete-MedicationInfo
router.post('/Ask-alarmNameToDelete', findAlarmInfo);
router.post('/Check-delete', deleteAlarm);

//Input-MedicationInfo  
router.post('/Check-alarmInfo', insertAlarm);

module.exports = router;
