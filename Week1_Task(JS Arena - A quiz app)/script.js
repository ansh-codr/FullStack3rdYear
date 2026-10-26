var questions = [
    { question: "Which keyword declares a variable that cannot be reassigned?", options: ["var", "let", "const", "fixed"], answer: "const", explanation: "const creates a variable that cannot be reassigned." },
    { question: "Which method adds an item to the end of an array?", options: ["push()", "pop()", "shift()", "add()"], answer: "push()", explanation: "push() adds one or more items to the end of an array." },
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Multi Language", "Home Text Markup Language"], answer: "Hyper Text Markup Language", explanation: "HTML means Hyper Text Markup Language." },
    { question: "Which symbol is used for a single-line comment in JavaScript?", options: ["<!--", "//", "##", "**"], answer: "//", explanation: "Two forward slashes start a single-line JavaScript comment." },
    { question: "Which value means a variable has no assigned value?", options: ["0", "false", "null", "undefined"], answer: "undefined", explanation: "undefined is the default value of a declared variable without a value." },
    { question: "Which method changes a JSON string into a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.change()"], answer: "JSON.parse()", explanation: "JSON.parse() converts a JSON string into an object." },
    { question: "Which operator checks value and type?", options: ["==", "=", "===", "!="], answer: "===", explanation: "The strict equality operator checks both value and type." },
    { question: "Which event happens when a button is clicked?", options: ["change", "submit", "click", "load"], answer: "click", explanation: "The click event runs when an element is clicked." },
    { question: "Which loop is commonly used to go through an array?", options: ["for", "if", "switch", "try"], answer: "for", explanation: "A for loop can repeat code for every array item." },
    { question: "What is the result of typeof 'hello'?", options: ["text", "String", "string", "word"], answer: "string", explanation: "typeof returns string for text values." }
];
var current = 0;
var score = 0;
var time = 30;
var timer;
var answered = false;
var wrong = [];
var question = document.getElementById("question");
var options = document.getElementById("options");
var next = document.getElementById("next");
var explanation = document.getElementById("explanation");

function showQuestion() {
    clearInterval(timer);
    answered = false;
    time = 30;
    document.getElementById("time").textContent = time;
    document.getElementById("number").textContent = "Question " + (current + 1) + " / " + questions.length;
    document.getElementById("score").textContent = score;
    document.getElementById("progress").style.width = ((current + 1) / questions.length * 100) + "%";
    question.textContent = questions[current].question;
    options.innerHTML = "";
    explanation.textContent = "";
    next.disabled = true;
    next.textContent = current === questions.length - 1 ? "Finish" : "Next";
    questions[current].options.forEach(function (option) {
        var button = document.createElement("button");
        button.textContent = option;
        button.onclick = function () { checkAnswer(button, option) };
        options.appendChild(button);
    });
    timer = setInterval(function () {
        time--;
        document.getElementById("time").textContent = time;
        if (time === 0) checkAnswer(null, "");
    }, 1000);
}

function checkAnswer(button, answer) {
    if (answered) return;
    answered = true;
    clearInterval(timer);
    var item = questions[current];
    var buttons = options.querySelectorAll("button");
    buttons.forEach(function (itemButton) {
        itemButton.disabled = true;
        if (itemButton.textContent === item.answer) itemButton.classList.add("correct");
    });
    if (answer === item.answer) {
        score++;
        if (button) button.classList.add("correct");
        explanation.textContent = "Correct! " + item.explanation;
    } else {
        if (button) button.classList.add("wrong");
        wrong.push({ question: item.question, chosen: answer || "No answer", correct: item.answer });
        explanation.textContent = "Wrong! " + item.explanation;
    }
    document.getElementById("score").textContent = score;
    next.disabled = false;
}

next.onclick = function () {
    if (current < questions.length - 1) { current++; showQuestion() } else showResult();
};

function showResult() {
    clearInterval(timer);
    document.getElementById("quiz").classList.add("hide");
    document.getElementById("result").classList.remove("hide");
    document.getElementById("finalScore").textContent = score + " / " + questions.length;
    document.getElementById("rating").textContent = score >= 8 ? "Excellent work!" : score >= 5 ? "Good job!" : "Keep practising!";
}

document.getElementById("restart").onclick = start;
document.getElementById("again").onclick = start;
document.getElementById("review").onclick = function () {
    document.getElementById("result").classList.add("hide");
    document.getElementById("reviewBox").classList.remove("hide");
    var box = document.getElementById("wrongAnswers");
    box.innerHTML = wrong.length ? "" : "<p>You got every answer right!</p>";
    wrong.forEach(function (item, index) {
        box.innerHTML += "<div class=\"wrongItem\"><b>" + (index + 1) + ". " + item.question + "</b><p>Your answer: " + item.chosen + "</p><p>Correct answer: " + item.correct + "</p></div>";
    });
};

function start() {
    current = 0;
    score = 0;
    wrong = [];
    document.getElementById("result").classList.add("hide");
    document.getElementById("reviewBox").classList.add("hide");
    document.getElementById("quiz").classList.remove("hide");
    showQuestion();
}
start();
