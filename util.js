var request    = require('request');
var cheerio    = require('cheerio');
var fs         = require('fs');
var mkdirp     = require('mkdirp');
var getDirName = require('path').dirname;

module.exports = {

  getTemperatures: function(url, fireSensorName, meatSensorName, callback) {
    request(url, (err, status, html) => {
      var fireTemp, meatTemp;
      var json = { fireTemp : '', meatTemp : ''};
      
      if (!err) {
        // cheerio essentially gives us jQuery functionality
        var $ = cheerio.load(html);

        $('input[value=' + fireSensorName + ']').filter(function() {
          fireTemp = $(this).parent().next('td').text();
        });

        $('input[value=' + meatSensorName + ']').filter(function() {
          meatTemp = $(this).parent().next('td').text();
        });

        json.fireTemp = fireTemp;
        json.meatTemp = meatTemp;
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