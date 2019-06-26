const config = require('./config');
const MongoClient = require('mongodb').MongoClient;
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
                db.collection('questions').findOne(query, function (err, result) {
                    callback(result);
                    client.close();
                });
            })
        })
    }
}