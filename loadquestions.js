const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');
const filedir = "./questions/";


//mdb configs
const uri = config.uri;
//end configs

const client = new MongoClient(uri);

class mongoquestion {
    constructor(question, course){
        this._id = question.id;
        this.course = course;
        this.questionHtml = question.problem.questionHtml;
        this.problemType = question.problem.problemType;
        this.choices = question.problem.choices;
    }
}

module.exports = {
    load:function(){
        client.connect(function(err){
            const questionsCollection = client.db("study").collection("questions");

            fs.readdir(filedir, (err, files) => {
                files.forEach(file => {
                    fs.readFile(filedir + file, function(err, data){
                        var course = file.split("-")[0];
                        var  question = JSON.parse(data.toString()).data.lesson;
                        var testquestion = new mongoquestion(question,course);
                        questionsCollection.insertOne(testquestion);
                        console.log(testquestion);
                    })
                })
            })
        })
        
    }
}

