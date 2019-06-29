const config = require('./config');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const client = new MongoClient(config.uri);

function getUser(callback) {
    client.connect(function (err) {
        var db = client.db(config.db);
        db.collection("user").findOne({}, function (err, user) {
            callback(user);
            client.close();
        })
    })
}

module.exports = {
    getNextQuestion: function (callback) {
        client.connect(function (err) {
            var db = client.db(config.db);
            getUser(function (user) {
                var query = {};
                if(user.quizzes[user.currentQuiz] != null){
                    query = {
                        "_id":{
                            "$nin": user.quizzes[user.currentQuiz].completedQuestions
                        }
                    }
                }

                //for testing
                //query.problemType = "multipleChoice";

                db.collection('exam_questions').findOne(query, function (err, result) {
                    callback(result);
                    client.close();
                });
            })
        })
    },
    checkAnswer: function(body,callback){
        console.log(JSON.stringify(body));
        var query = {
            _id: new ObjectID(body._id),

        }

        var correct = true;
        client.connect(function(err){
            var db = client.db(config.db);
            db.collection('exam_questions').findOne(query,function(err,result){
                var trueArray = [];
                result.choices.forEach(choice => {
                    if(choice.correct){
                        trueArray.push(result.choices.indexOf(choice));
                    }
                })
                console.log(trueArray);
                console.log(body.result);
                if(body.result.length != trueArray.length){
                    correct = false;
                } else {
                    for(var i = 0; i < trueArray.length; i++){
                        if(trueArray[i] != Number.parseInt(body.result[i])){
                            correct = false;
                        }
                    }
                }
                console.log(correct);
                callback(correct);
            })
        })
        
    }
}