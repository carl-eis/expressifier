/*
    Expressifier!
    API in a box.

    Developed by: Carl Eiserman
*/


var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

app.get('/', function(req, res) {
  res.headers = {
    "Access-Control-Allow-Origin": "*"
  }
    res.send('Hello World!')
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

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

// app.all('/*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });
