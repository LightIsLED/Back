var express = require("express");
var bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var { sequelize } = require("./models");

var app = express();
sequelize.sync();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("", indexRouter);
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use((err, req, res) => {
    res.locals.message = err.mesage;
    res.locals.error = req.app.get("env") || "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
