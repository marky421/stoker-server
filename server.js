// server.js

// BASE SETUP
//======================================
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var request    = require('request');

// bodyParser() will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.port || 8080;  // set our port


// ROUTES FOR OUR API
//======================================
var router = express.Router();

// test route to make sure every thing is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api' });
  require('./app/util/util.js');
});


// REGISTER OUR ROUTES
//======================================
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
//======================================
app.listen(port);
console.log('Magic happens on port: ' + port);
