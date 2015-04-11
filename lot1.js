var path = require('path');
var express    = require('express'); 
var app        = express();

var port     = 2021; 
var router = express.Router();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/lottery.html');
});

app.listen(port);
console.log('lottery page ' + port);
