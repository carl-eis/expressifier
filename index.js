/*======================================*\
    Expressifier!
    API in a box.

    Developed by: Carl Eiserman
\*======================================*/

/*======================================*\
    NPM Packages
\*======================================*/

var consoleMessages = require("./components/messages/messages.js");
consoleMessages.welcome();

var express = require('express');
var cors = require('cors');
var request = require('request');
var open = require("open");

//Logging library
var winston = require("winston");


/*======================================*\
    Winston logging settings
\*======================================*/

winston.add(winston.transports.File, {
    filename: './logs/nodelogger.log',
    maxsize: 300000,
    maxfiles: 10
});
// winston.add(winston.transports.Console);
winston.level = 'debug';
// winston.log("This is a test!");

/*======================================*\
    Request Options
\*======================================*/

var app = express();
var bodyParser = require("body-parser");
var spawn = require("child_process").spawn,
    child;

app.use(bodyParser.urlencoded({
    extended: false,
    limit: '10mb'
}));

app.use(bodyParser.json({
    limit: '10mb'
}));

app.use(bodyParser.raw({
    limit: '10mb'
}));

app.use(cors());

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

/*======================================*\
    Request Options
 \*======================================*/

app.listen(8080, function() {
    console.log('API Server running on port 8080!\n');
    //Only do this once the server is running:\n

    var rest_driver = require("./components/REST/driver");

    //Launch the rest api
    rest_driver.init(app);

});
console.log("==========================================\n");
