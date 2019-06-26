const quiz = require('../quiz');

function testGetNextQuestion(){
    quiz.getNextQuestion(function(quizItem){
        console.log(quizItem);
    });
}

testGetNextQuestion();