var question = {
    type:"",
    _id:""
};

function nextQuestion(){
    fetch("/question").then((response) => {
        response.json().then(data => {
            console.log(data);
            question.type = data.problemType;
            question._id = data._id;
            printExamQuestion(data);
        })
    })
}

function printExamQuestion(data){
    console.log(data);
    var questionText = document.getElementById("currentQuestionText");
    var choices = document.getElementById("choices");
    var answer = document.getElementById("answer");
    var instructions = document.getElementById("instructions");

    //print answer choices based on problem type
    if(data.problemType == "checkAllThatApply"){
        instructions.innerHTML = "Check all that apply";
        var choiceList = document.createElement("ul");
        choices.appendChild(choiceList);

        data.choices.forEach(choice => {
            var choiceHtml = `<li><input type="checkbox" value="${data.choices.indexOf(choice)}">${choice.text}</input></li>`;
            choiceList.innerHTML += choiceHtml;
        });

    } else if(data.problemType == "multipleChoice"){
        instructions.innerHTML == "Choose the best answer";
        data.choices.forEach(choice => {
            var choiceHtml = `<input type="radio" name="response" value="${data.choices.indexOf(choice)}">${choice.text}</input><br>`;
            choices.innerHTML += choiceHtml;
        })
    }

    

    questionText.innerHTML = data.text;
    answer.innerHTML = data.answerExplanation;
    

}

function showAnswer(){
    document.getElementById("answer").style = "display:inline;";
}

function submitAnswer(){
    var answer = {
        _id:question._id,
        type: question.type
    };

    if(question.type == "multipleChoice"){
        answer.result = document.querySelector('input[name="response"]:checked').value
    } else if(question.type == "checkAllThatApply") {
        answer.result = [];
        var options = document.getElementsByTagName("input");
        for(var i = 0; i < options.length; i++){
            if(options[i].checked){
                answer.result.push(options[i].value);
            }
        }
    } else {
        console.log("unsupported question type");
    }

    console.log(answer);

    fetch("/answer", {
        method: "POST", 
        body: JSON.stringify(answer),
        headers: {
            'Content-Type': 'application/json'
        }
      }).then(res => {
        res.json().then(data => {
            document.getElementById("result").innerHTML = data;
            if(data){
                document.getElementById("submit").disabled = true;
            }
        })
      });
}

nextQuestion();