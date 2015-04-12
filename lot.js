var path = require('path');
var express    = require('express'); var bodyParser = require('body-parser');
var app        = express();
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var JP = require('./models/jp1');
var Award = require('./models/award1');

var port     = 2020; 
var router = express.Router();

//tyson
var intv = 2;
var people = 0;
var start = 0;
//var start = 1;
var online = {};


app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, '/image')));
app.use(express.static(path.join(__dirname, '/')));


//app.use(bodyParser.urlencoded());
//app.use(bodyParser.json());

router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});


router.route('/selfcheck')
  .post(function(req, res) {
    id = req.body.id;
    if (start == 0){
      res.json({message:"wait"});
    } else {
      if(online[id]) {
        res.json({message:"done"});
      } else {
        res.json({message:"go"});
      }
    }
  });


router.route('/admin') 
  .get(function(req, res){
    res.sendFile(__dirname + '/admin.html');
  })
  .post(function(req, res){
    var msg = req.body.message;
    if(msg=="login") {
      var user = req.body.user;
      var pwd  = req.body.pwd;
      if (user=="admin" && pwd=="ty2015") {
	      res.json({message:"login"});
      } else {
	      res.json({message:"logout"});
      }
    } else if (msg == "go"){

      start = 1;
      people = 0;
      online={};
      JP.remove({}, function(err) { 
        console.log('collection removed') 
      });
      var jp = new JP();
      jp.jp = "一等奖";
      jp.amount = 1;
      jp.save();
      var jp = new JP();
      jp.jp = "二等奖";
      jp.amount =2;
      jp.save();
      var jp = new JP();
      jp.jp = "三等奖";
      jp.amount = 0;
      jp.save();
      Award.remove({}, function(err) { 
        console.log('collection removed') 
      });

      res.json({message:"go"});
    } else if (msg == "stop"){
      start = 0;
      people = 0;
      online={};
      res.json({message:"stop"});
    }
  });
/*
  .post(function(req, res) {
    console.log("start lottery");
    start = 1;
    people = 0;
    online={};
    JP.remove({}, function(err) { 
      console.log('collection removed') 
    });
    var jp = new JP();
    jp.jp = "ipad";
    jp.amount = 1;
    jp.save();
    var jp = new JP();
    jp.jp = "mini";
    jp.amount = 0;
    jp.save();

    Award.remove({}, function(err) { 
      console.log('collection removed') 
    });
    res.json({message:"start lottery"});
  });
*/

var jiaping = function(id, cb) {
  if (start) {
    online[id]=id;
    people = people+1;
    if(people % intv == 0) {

      JP.findOne({amount: {$gt:0}}, function(err,jp){
	if(jp) {
	  console.log(jp);
          jp.amount-=1;
	  console.log(jp);
	  jp.save(function (err) {
            if(err) {
              console.error('ERROR!');
            }
	  });
	
	  var award = new Award();
      	  award.mobile = id;
      	  award.jiaping = jp.jp;
	  award.save();

          var currentdate = new Date(); 
          var datetime = "" + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

          cb({message: "bingo", jiaping: jp.jp, time: datetime});
	} else {
      	  cb({message: "sorry"});
	}
      });
    } else {
      cb({message: "sorry"});
    }
  } else {
    cb({message: "wait"});
  }
}
router.route('/look') 
  .post(function(req, res) {
    var id = req.body.id;
    if (online[id]) {
      console.log("repeat");
      res.json({message:"done", jiaping:"ipad"});
    } else {
      jiaping(id, function(content){
	    res.json(content);
      });
    }
  });

router.route('/check') 
  .post(function(req, res) {
    var id = req.body.id;
    Award.findOne({mobile:id}, function(err,aw){
     console.log(aw);
     if(aw){
       res.json({message:"bingo", time:aw.time, jiaping: aw.jiaping})
     } else {
       res.json({message:"sorry"});
     }
    });
  });


router.route('/question')
  .get(function(req, res) {
    res.sendFile(__dirname + '/question.html');

    //if (req.query.mobile && req.query.mobile!=="undefined") {
    //} else {
    //  console.log("error question");
    //}
  })
  .post(function(req, res) {
    res.json({message: "wait"});
  });


router.route('/qiz')
  .post(function(req, res){
    var qiz = req.body.qiz;
    console.log(qiz);
    qiz = {questions:qiz};
	  fs.writeFile('qiz.json', JSON.stringify(qiz), function (err) {
    	  if (err) {
     	    res.json({message:"question update ok"});
    	  }
     	    res.json({message:"question update fail"});
	  });
  });


router.route('/jp')
  .post(function(req, res){
    Award.find({}, function(err,aws){
      //console.log(aws);
      res.json(aws);
    });
  });

app.use('/', router);
app.listen(port);
console.log('magic happens on port ' + port);
