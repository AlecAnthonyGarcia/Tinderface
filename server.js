var express = require("express");
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('build'));
app.use('/', require('./src/server/routers/index'));

var server = app.listen(process.env.PORT || 3000);