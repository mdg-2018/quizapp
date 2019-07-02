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

function recordAnswer(id,answer,callback){
    data = {
        "time": Date.now(),
        "correct": answer
    }
    client.connect(function(err){
        var db = client.db(config.db);
        db.collection('exam_questions').updateOne({"_id":ObjectID(id)},{"$push":{"attempts":data}}).then((err,result) => {
            if(err){
                console.log(err);
            }
    
            console.log(result);
            callback();
            client.close();
        })
    })
}

module.exports = {
    getNextQuestion: function (callback) {
        client.connect(function (err) {
            var db = client.db(config.db);
            getUser(function (user) {
                var pipeline = [
                    {
                      '$addFields': {
                        'attempts': {
                          '$ifNull': [
                            '$attempts', []
                          ]
                        }
                      }
                    }, {
                      '$addFields': {
                        'attempt_count': {
                          '$size': '$attempts'
                        }, 
                        'correct_count': {
                          '$size': {
                            '$filter': {
                              'input': '$attempts', 
                              'as': 'attempt', 
                              'cond': {
                                '$eq': [
                                  '$$attempt.correct', true
                                ]
                              }
                            }
                          }
                        }, 
                        'incorrect_count': {
                          '$size': {
                            '$filter': {
                              'input': '$attempts', 
                              'as': 'attempt', 
                              'cond': {
                                '$eq': [
                                  '$$attempt.correct', false
                                ]
                              }
                            }
                          }
                        }
                      }
                    }, {
                      '$sort': {
                        'attempt_count': 1
                      }
                    }, {
                      '$limit': 1
                    }
                  ];
                db.collection('exam_questions').aggregate(pipeline, function (err, result) {
                    result.toArray(function(err,docs){
                        console.log(docs[0])
                        callback(docs[0])
                    })
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
                recordAnswer(result._id,correct,function(){
                    callback(correct)
                });
            })
        })
        
    }
}