const {
    alarmList
} = require("../controllers/askAlarmList")
const express = require("express");
const router = express.Router();
//Answer.alarmList
router.get('/alarmList', alarmList);
//Ask.whatToTake
router.get('/whatToTake', )
module.exports = router;
