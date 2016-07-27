var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var request = require("request");
var router = express.Router();

var TINDER_API = 'https://api.gotinder.com';

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('*', function (req, res, next) {
  res.render('index');
});

// request Tinder auth token using Facebook access token
app.post('/auth', upload.array(), function (req, res) {
  var requestBody = {
    facebook_token: req.body.facebookAccessToken
  };
  request({
    url: TINDER_API + "/auth",
    method: "POST",
    json: true,
    headers: {
      "User-Agent": "Tinder/5.3.1 (iPhone; iOS 9.3.3; Scale/2.00)"
    },
    body: requestBody
  }, function (error, response, body){
    res.send(body);
  });
});

module.exports = app;