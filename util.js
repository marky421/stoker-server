var request    = require('request');
var cheerio    = require('cheerio');
var fs         = require('fs');
var mkdirp     = require('mkdirp');
var getDirName = require('path').dirname;
var Sensor     = require('./sensor.js');

module.exports = {

  getData: function(url, fireSensorName, meatSensorName, callback) {
    request(url, (err, status, html) => {
      var json = {};
      if (!err) {
        var $ = cheerio.load(html);
        json.fireSensor = parse($, fireSensorName);
        json.meatSensor = parse($, meatSensorName);
      }
      callback(err, json);
    });
  },

  updateLog: function(path, time, fireTemp, meatTemp) {
    var line = time + ',' + fireTemp + ',' + meatTemp + '\n';

    fs.access(path, fs.R_OK | fs.W_OK, (err) => {
      if (err) {
        console.log('File not found. Creating new file: ' + path);
        line = 'time,fireTemp,meatTemp\n' + line;
      }

      mkdirp(getDirName(path), (err) => {
        if (err) return console.log(err);
        console.log(line);
        fs.appendFile(path, line);
      });
    });
  },

  // returns "month/date/year hours:minutes:seconds"
  // ex: "06/07/2014 06:30:00"
  getFormattedTime: function(d) {
    var month = d.getMonth() + 1;
    var date  = d.getDate();
    var year  = d.getFullYear();
    var hours = d.getHours();
    var mins  = d.getMinutes();
    var secs  = d.getSeconds();

    if (month < 10) month = '0' + month;
    if (date  < 10) date  = '0' + date;
    if (hours < 10) hours = '0' + hours;
    if (mins  < 10) mins  = '0' + mins;
    if (secs  < 10) secs  = '0' + secs;
    
    return month + '/' + date + '/' + year + ' ' + hours + ':' + mins + ':' + secs;
  }

}

function parse($, sensorName) {
  var sensor = {};
  $('input[value=' + sensorName + ']').filter(function() {
    var serialNumber = $(this).attr("name").substring(Sensor.prefixSerial.length);
    sensor = new Sensor({
      name: sensorName,
      serial: serialNumber,
      temps: {
        current : $(this).parent().next('td').text(),
        target  : $('input[name=' + Sensor.prefixTarget + serialNumber + ']').val(),
        low     : $('input[name=' + Sensor.prefixLow    + serialNumber + ']').val(),
        high    : $('input[name=' + Sensor.prefixHigh   + serialNumber + ']').val()
      }
    });
  });
  return sensor;
}