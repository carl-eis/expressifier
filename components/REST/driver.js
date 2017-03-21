var app;
var cors = require('cors');
var request = require('request');

var fs = require("fs");

function init(express){
    app = express;

    console.log("Launching REST API...");

    var req_wildcard = require("./req_wildcard.js");
    req_wildcard.init(app);

    console.log("REST API Initialized.\n");
}

module.exports = {
    init: init
};
