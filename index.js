var parseArgs = require('minimist');
var LoadQuestions = require('./loadquestions');
var Quiz = require('./quiz');
//Quiz webapp
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// parse command line arguments and route to appropriate action
var args = parseArgs(process.argv.slice(2));


if(args._[0] === "load"){
    LoadQuestions.load(args.type);
}

if(args._[0] === "quiz"){
    console.log("Starting quiz");
    startQuiz();
}

function startQuiz(){
    app.use(express.static('views'));

    app.get('/', function (req, res) {
        res.redirect("index.html");
    })

    app.get('/question',function(req,res){
        Quiz.getNextQuestion(function(data){
            res.send(data);
        })
    })

    app.post('/answer',function(req,res){
        Quiz.checkAnswer(req.body,function(result){
            res.send(result);
        })
    })

    app.post('/new',function(req,res){
        //TODO - start new quiz
    })
     
     var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port
        
        console.log("Example app listening at http://%s:%s", host, port)
     })
}