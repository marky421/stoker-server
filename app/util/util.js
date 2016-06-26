module.exports = {}
var request = require('request')
var ip = 'dev.maspain.com';
request('http://' + ip, function(err, res, body) {
  if (!err && res.statusCode == 200) {
    console.log(body);
  }
});

module.exports = "util";
