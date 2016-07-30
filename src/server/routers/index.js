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

// retrieve Tinder Facebook friends who are opted-in to Tinder Social
app.post('/friends', upload.array(), function (req, res) {
  request({
    url: TINDER_API + "/group/friends",
    method: "GET",
    headers: {
      "User-Agent": "Tinder/5.3.1 (iPhone; iOS 9.3.3; Scale/2.00)",
      "X-Auth-Token": req.body.tinderAuthToken
    },
  }, function (error, response, body){
    res.send(body);
  });
});

// retrieve Tinder profile information for the requested user
app.post('/user', upload.array(), function (req, res) {
  var userUrl = TINDER_API + "/user/" + req.body.tinderUserId;
  var method = "GET";
  if(req.body.share) {
    userUrl = userUrl + '/share';
    method = "POST";
  }
  request({
    url: userUrl,
    method: method,
    headers: {
      "User-Agent": "Tinder/5.3.1 (iPhone; iOS 9.3.3; Scale/2.00)",
      "X-Auth-Token": req.body.tinderAuthToken
    },
  }, function (error, response, body){
    res.send(body);
  });
});

// retrieve Tinder user information
app.post('/meta', upload.array(), function (req, res) {
  request({
    url: TINDER_API + "/meta",
    method: "GET",
    headers: {
      "User-Agent": "Tinder/5.3.1 (iPhone; iOS 9.3.3; Scale/2.00)",
      "X-Auth-Token": req.body.tinderAuthToken
    },
  }, function (error, response, body){
    res.send(body);
  });
});

// update Tinder Social group status
app.post('/group/status', upload.array(), function (req, res) {
  var requestBody = {
    status: req.body.status
  };
  request({
    url: TINDER_API + "/group/" + req.body.groupId,
    method: "PUT",
    json: true,
    headers: {
      "User-Agent": "Tinder/5.3.1 (iPhone; iOS 9.3.3; Scale/2.00)",
      "X-Auth-Token": req.body.tinderAuthToken
    },
    body: requestBody
  }, function (error, response, body){
    res.send(body);
  });
});

module.exports = app;