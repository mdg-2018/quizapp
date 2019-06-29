const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');
const filedir = "./practice_exam/";


//mdb configs
const uri = config.uri;
//end configs

const client = new MongoClient(uri);

class mongoquestion {
    constructor(question, course) {
        this._id = question.id;
        this.course = course;
        this.questionHtml = question.problem.questionHtml;
        this.problemType = question.problem.problemType;
        this.choices = question.problem.choices;
    }
}

module.exports = {
    load: function (type) {
        client.connect(function (err) {
            const questionsCollection = client.db("study").collection("questions");
            const examCollection = client.db("study").collection("exam_questions");

            fs.readdir(filedir, (err, files) => {
                files.forEach(file => {
                    fs.readFile(filedir + file, function (err, data) {
                        if (type == 'exam') {
                            var sections = JSON.parse(data.toString()).studentExam.sections;
                            sections.forEach(function(section){
                                section.problems.forEach(function(problem){
                                    problem.questionkey = problem.text.substring(0,999);
                                    examCollection.insertOne(problem,function(err,result){
                                        if(err){
                                            console.log(err);
                                        } else {
                                            console.log(result);
                                        }
                                    });
                                })
                            })
                        } else {
                            var course = file.split("-")[0];
                            var question = JSON.parse(data.toString()).data.lesson;
                            var testquestion = new mongoquestion(question, course);
                            questionsCollection.insertOne(testquestion);
                            console.log(testquestion);
                        }

                    })
                })
            })
        })

    }
}

