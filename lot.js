var path = require('path');
var express    = require('express'); var bodyParser = require('body-parser');
var app        = express();
var fs = require('fs');

var port     = 2020; 
var router = express.Router();

var people = 0;
var start = 0;

var online = {};

var jiaping = function(id) {
  if (start) {
    online[id]=id;
    people = people+1;

    if(people%3 == 0) {
      fs.readFile(__dirname + '/look.json', function (err, data) {
    	if (err) {
          console.log("look up nok");
    	}
        data = JSON.parse(data); 
	data.push({id:id});
	console.log(data);
        fs.writeFile('look.json', JSON.stringify(data), function (err) {
          if (err) {
            // todo
            console.log("look insert nok");
    	  }
          console.log("look insert okay");
        });
      });
      return "中奖了";
    } else {
      return "抱歉未中奖";
    }
  } else {
    return "抽奖活动尚未开始，请耐心等候";
  }
}


app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, '/image')));
app.use(express.static(path.join(__dirname, '/')));


//app.use(bodyParser.urlencoded());
//app.use(bodyParser.json());

router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});




router.route('/start') 
  .get(function(req, res){
    res.sendFile(__dirname + '/start.html');
  })
  .post(function(req, res) {
    console.log("start lottery");
    start = 1;
    fs.writeFile('look.json', '[{"id":"占位"}]', function (err) {
      if (err) {
	console.log("error");
      }
      console.log("start okay");
    });

    res.json({message:"start lottery"});
  });


router.route('/look') 
  .post(function(req, res) {
    var id = req.body.id;
    if (online[id]) {
      console.log("repeat");
      var content = "<html><head><meta charset='UTF-8'></head><body><h1>"+ 
                    "请不要重复抽奖</h1></body></html>";
      res.end(content);
    } else {
      var content = "<html><head><meta charset='UTF-8'></head><body><div>"+ jiaping(id) +
                    "</div><div><a href='http://115.28.11.51:2020/lookup'>查看获奖名单</a></div></body></html>"
      res.end(content);
    }
  });
router.route('/lookup') 
  .get(function(req, res) {
      var content = "<html><head><meta charset='UTF-8'></head><body><h1>中奖名单</h1><ol>" ;
      fs.readFile(__dirname + '/look.json', function (err, data) {
    	if (err) {
          console.log("look up nok");
    	}
        data = JSON.parse(data); 
  	for (i=1;i<data.length;i++){
          content+= "<li><a href='#'>" + data[i].id  + "</a></li>"
        }
        content+="</ol></body></html>";
      	res.end(content);
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
    res.redirect('./question#lottery');
  });

router.route('/qiz/:id') 
  .get(function(req, res) {
      var qid = req.params.id;
      fs.readFile(__dirname + '/qiz.json', function (err, data) {
    	if (err) {
      	  res.writeHead(500);
          return res.end('Error loading question');
    	}
	var qiz = JSON.parse(data);
	console.log(qiz.questions.length);

	if (qid > qiz.questions.length){
      	  res.writeHead(500);
          return res.end('Error loading question');
	}
	
	qid = qid-1;
	sid = qid+1;
	console.log(qiz.questions[qid].q);
	var select = "<select form='tyson'  name='r'>" +
  		"<option value ='" +  qiz.questions[qid].a + "'>" + qiz.questions[qid].a + "</option>" +
  		"<option value ='" +  qiz.questions[qid].b + "'>" + qiz.questions[qid].b + "</option>" +
  		"<option value ='" +  qiz.questions[qid].c + "'>" + qiz.questions[qid].c + "</option>" +
  		"<option value ='" +  qiz.questions[qid].d + "'>" + qiz.questions[qid].d + "</option>" +
		"</select>";
	var form = "<html><head><meta charset='UTF-8'></head><body>"+
		"<form method='post' id='tyson' action='/qiz/"+ sid + "'>" +
		"<p><textarea name='q' rows='5' cols='30'>" +  qiz.questions[qid].q + 
		"</textarea></p>" +
		"<p><input type='text' name='a' value='" + qiz.questions[qid].a + "' placeholder='" + qiz.questions[qid].a + "'>A</p>" +
		"<p><input type='text' name='b' value='" + qiz.questions[qid].b + "' placeholder='" + qiz.questions[qid].b + "'>B</p>" +
		"<p><input type='text' name='c' value='" + qiz.questions[qid].c + "' placeholder='" + qiz.questions[qid].c + "'>C</p>" +
		"<p><input type='text' name='d' value='" + qiz.questions[qid].d + "' placeholder='" + qiz.questions[qid].d + "'>D</p>" +
	        "<p>"+select+"正确答案</p>"+
  		"<p><input type='submit' value='提交问题'></p>" +
  		"</form></body></html>";
        res.writeHead(200, {'Content-Type': 'text/html',
			    'Content-Encoding':'utf-8',
        		    'charset' : 'utf-8'});
 	res.end(form);	
      });

  })
  .post(function(req, res) {
      var qid = req.params.id;
      fs.readFile(__dirname + '/qiz.json', function (err, data) {
    	if (err) {
      	  res.writeHead(500);
          return res.end('Error loading question');
    	}
	var qiz = JSON.parse(data);
	console.log(qiz.questions.length);

	if (qid > qiz.questions.length){
      	  res.writeHead(500);
          return res.end('Error loading question');
	}
     	qid = qid-1;
     	sid = qid+1;

	qiz.questions[qid].q = req.body.q;
	qiz.questions[qid].a = req.body.a;
	qiz.questions[qid].b = req.body.b;
	qiz.questions[qid].c = req.body.c;
	qiz.questions[qid].d = req.body.d;
	qiz.questions[qid].r = req.body.r;
	
	fs.writeFile('qiz.json', JSON.stringify(qiz), function (err) {
    	  if (err) {
     	    res.writeHead(500);
            return res.end('Error Writing question');
    	  }
      	  res.writeHead(500);
          return res.end('success update');
	});

      });
  });


app.use('/', router);
app.listen(port);
console.log('magic happens on port ' + port);
