/*
    Expressifier!
    API in a box.

    Developed by: Carl Eiserman
*/


var express = require('express');
var cors = require('cors');
var app = express();

var spawn = require("child_process").spawn,
    child;


app.use(cors());
var responseJSON = {};

app.get('/', function(req, res) {
    res.headers = {
        "Access-Control-Allow-Origin": "*"
    };

    //Build Response

    responseJSON.data = "Hello World!";
    responseJSON.test = {
        test1: "test1 text",
        test2: "test2 text"
    }

    //Response data
    console.log("Firing JAVA job...");
    logResponse("Firing JAVA job...");

    child = spawn("powershell.exe", ["C:\\cygwin64\\home\\Carl\\Techairos\\odk2-publisher\\target\\bin\\testpost.bat"]);
    child.stdout.on("data", function(data) {
        console.log("Powershell Data: " + data);
        logResponse("Powershell Data: " + data);
    });
    child.stderr.on("data", function(data) {
        console.log("Powershell Errors: " + data);
        logResponse("Powershell Errors: " + data);
    });
    child.on("exit", function() {
        console.log("Powershell Script finished");
        logResponse("Powershell Script finished");
        res.send(responseJSON);
        console.log(JSON.stringify(res.headers, null, 4));

    });
    child.stdin.end(); //end input




    // res.send(responseJSON);
    // console.log(JSON.stringify(res.headers, null, 4));
});

app.post('/', function(req, res) {
    res.send('Got a POST request')
});

app.put('/user', function(req, res) {
    res.send('Got a PUT request at /user')
});

app.delete('/user', function(req, res) {
    res.send('Got a DELETE request at /user')
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
});

// app.all('/*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });
function logResponse(data) {
    responseJSON.data += "\n" + data.toString();
}
