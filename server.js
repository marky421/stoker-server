/*
 * File   : server.js
 * Author : Mark Spain
 * Date   : 6/25/16
 */


// BASE SETUP
//--------------------------------------
var express    = require('express');
var fs         = require('fs');
var request    = require('request');
var bodyParser = require('body-parser');
var cheerio    = require('cheerio');
var util       = require('./util.js');
var app        = express();
var router     = express.Router();

// bodyParser() will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.port || 8080;

var stokerUrl      = 'http://10.0.1.11';
var fireSensorName = 'Fire';
var meatSensorName = 'Meat';
var logPath        = '/Users/maspain/Desktop/test/log.csv';



// setup our routes
//--------------------------------------
// test route to make sure every thing is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api' });
});


// route to get the current temperatures
router.get('/status', function(req, res) {
  util.getTemperatures(stokerUrl, fireSensorName, meatSensorName, function(err, json) {
    if (!err) res.json(json);
  });
});


// register our routes
//--------------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// start the server
//--------------------------------------
app.listen(port);
console.log('Magic happens on port: ' + port);
exports = module.exports = app;


setInterval(function() {
  util.getTemperatures(stokerUrl, fireSensorName, meatSensorName, function(err, json) {
    if (!err && typeof json !== 'undefined') {
      console.log('updating log: ' + JSON.stringify(json));
      var time = util.getFormattedTime(new Date());
      util.updateLog(logPath, time, json.fireTemp, json.meatTemp);
    } else {
      console.log('can\'t update log');
    }
  });
}, 5000);