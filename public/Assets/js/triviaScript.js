document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const restartBtn = document.getElementById('restart-btn');
    const endBtn = document.createElement('button');
    const correctCounter = document.getElementById('correct-counter');
    const wrongCounter = document.getElementById('wrong-counter');

    let currentQuestionIndex = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let shuffledQuestions = [];

    const questions = [
        {
            question: "What is the capital of France?",
            answers: [
                { text: "Paris", correct: true },
                { text: "London", correct: false },
                { text: "Berlin", correct: false },
                { text: "Madrid", correct: false }
            ]
        },
        {
            question: "What is 2 + 2?",
            answers: [
                { text: "3", correct: false },
                { text: "4", correct: true },
                { text: "5", correct: false },
                { text: "6", correct: false }
            ]
        },
        {
            question: "What is the color of the sky?",
            answers: [
                { text: "Blue", correct: true },
                { text: "Green", correct: false },
                { text: "Red", correct: false },
                { text: "Yellow", correct: false }
            ]
        }
    ];

    startBtn.addEventListener('click', startQuiz);
    restartBtn.addEventListener('click', restartQuiz);
    endBtn.addEventListener('click', restartQuiz);

    endBtn.innerText = 'End Quiz';
    endBtn.classList.add('btn', 'hide');
    questionContainer.appendChild(endBtn);

    function startQuiz() {
        startBtn.classList.add('hide');
        questionContainer.classList.remove('hide');
        endBtn.classList.remove('hide');
        shuffledQuestions = shuffleArray(questions);
        currentQuestionIndex = 0;
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    }

    function showQuestion(question) {
        questionElement.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        clearStatusClass(document.body);
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === 'true';
        if (correct) {
            correctCount++;
            correctCounter.innerText = correctCount;
        } else {
            wrongCount++;
            wrongCounter.innerText = wrongCount;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex >= shuffledQuestions.length) {
            currentQuestionIndex = 0;
            shuffledQuestions = shuffleArray(questions);
        }
        setNextQuestion();
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        correctCount = 0;
        wrongCount = 0;
        correctCounter.innerText = correctCount;
        wrongCounter.innerText = wrongCount;
        restartBtn.classList.add('hide');
        endBtn.classList.add('hide');
        startBtn.classList.remove('hide');
        questionContainer.classList.add('hide');
    }

    function clearStatusClass(element) {
        element.classList.remove('correct');
        element.classList.remove('wrong');
    }

    function shuffleArray(array) {
        const newArray = array.slice();
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
});
