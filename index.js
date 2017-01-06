/*======================================*\
    Expressifier!
    API in a box.

    Developed by: Carl Eiserman
\*======================================*/



/*======================================*\
    NPM Packages
\*======================================*/

var express = require('express');
var cors = require('cors');
var request = require('request');
var jsforce = require('jsforce');
var cloudinary = require('cloudinary');
var app = express();
var bodyParser = require("body-parser");
var spawn = require("child_process").spawn,
    child;

/*======================================*\
    Settings
\*======================================*/

app.use(bodyParser.urlencoded({
    extended: false,
    limit: '5mb'
}));

// parse application/json
app.use(bodyParser.json({
    limit: '5mb'
}));

app.use(bodyParser.raw({
    limit: '5mb'
}));

// Set cloudinary global parameters
cloudinary.config({
  cloud_name: 'dsytodvcc',
  api_key: '651473314464965',
  api_secret: 'cUN9iMp4dPXswQzNfQus5EfjWB8'
});
//NB: These are on Johan's personal account
//Please create a Techairos account and switch these out.

/*======================================*\
    Request Options
\*======================================*/


app.use(cors());
var responseJSON = {};

app.get('/odk2publisher', function(req, res) {
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
        logResponse(data);
    });
    child.stderr.on("data", function(data) {
        console.log("Powershell Errors: " + data);
        logResponse(data);
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

app.post('/http_record_add_new', function(req, res) {
    res.send('Got a POST request for new record');
    console.log("====================================");
    console.log("Received POST - Printing Headers\n");
    console.log(req.headers);
    console.log("\nHEADERS DONE - PRINTING Body\n");
    try {
        console.log("Printing strinified JSON:");
        console.log(JSON.stringify(req.body, null, 4));
    } catch (ex) {
        console.log("UNABLE TO STRINGIFY BODY\n");
        console.log("PRINTING RAW");
        console.log(req.body);
    }
});

app.post('/imageupload', function(req, res) {
    console.log("====================================");
    console.log("Received POST - Printing Headers\n");
    console.log(req.headers);
    console.log("\nHEADERS DONE - PRINTING Body\n");
    try {
        console.log("Printing strinified JSON:");
        // console.log(JSON.stringify(req.body, null, 4));

        if (typeof(req.body.image) != "undefined") {
            var image_id = req.body.id + "_avatar";

            console.log("Image ID: " + image_id);

            // Upload image to cloudinary
            cloudinary.uploader.upload(req.body.image, function(result) {
                // Print URL to image
                console.log("URL to image: " + result.url);
                
                var query = "SELECT name__c, Id, CreatedDate FROM Ablb_Registration__c WHERE id_number__c = '" + req.body.id + "'";
                console.log('The query: ' + query);
                
                var conn = new jsforce.Connection();
                // Login on SalesForce
                conn.login('carl@techairos.com', 'sPy8uFXuzWOIMHN4XTp4', function(err, res) {
                    if (err) { 
                        return console.error(err); 
                    }
                    
                    // Do the query
                    conn.query(query, function(err, res) {
                        if (err) { 
                            return console.error(err);
                        }
                        
                        console.log(res); // Print the entire response
                        // console.log(res.records.length); // Print the number of retrieved records
                        // console.log(res.records[0].Id); // Print just the first record's Id
                        // console.log(res.records[0].name__c); // Print just the first record's name

                        if (res.records.length > 0) {
                            var latestRecord = res.records[0];
                            for (var i = 1; i < res.records.length; i = i + 1) {
                                var lastestDate = new Date(latestRecord.CreatedDate);
                                var date = new Date(res.records[i].CreatedDate);

                                if (date.getTime() > lastestDate.getTime()) {
                                    latestRecord = res.records[i];
                                }
                            }

                            // Update the entry profile picture using the Id retrieved from above
                            conn.sobject("Ablb_Registration__c").update({
                                Id : latestRecord.Id,
                                photo_selfie__c : result.url
                            }, function(err, ret) {
                                if (err || !ret.success) {
                                    return console.error(err, ret);
                                }

                                console.log('Updated Successfully : ' + ret.id);
                            });
                        } else {
                            console.log("No records were returned from query");
                        }
                        
                    });
                });
            }, {public_id: image_id});
        } else {
            console.log("No image field in JSON");
        }
    } catch (ex) {
        console.log(ex);
        console.log("UNABLE TO STRINGIFY BODY\n");
    }
    console.log("====================================");
    // res.send("This is successful!");
    res.send('Got a POST request')
});

app.put('/user', function(req, res) {
    res.send('Got a PUT request at /user')
});

app.delete('/user', function(req, res) {
    res.send('Got a DELETE request at /user')
});

app.listen(8080, function() {
    console.log('Example app listening on port 8080!')
});

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
function logResponse(data) {
    responseJSON.data += "\n" + data.toString();
}
