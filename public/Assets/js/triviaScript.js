document.addEventListener('DOMContentLoaded', () => {
    const easyButton = document.getElementById('easy-button');
    const hardButton = document.getElementById('hard-button');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');

    let questions = [];
    let currentQuestionIndex = 0;

    easyButton.addEventListener('click', () => loadQuestions('../questions1.json'));
    hardButton.addEventListener('click', () => loadQuestions('../questions2.json'));
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);

    function loadQuestions(jsonFile) {
        fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                questions = data;
                console.log('Questions loaded:', questions);
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    function startGame() {
        if (questions.length === 0) {
            alert('Please select a difficulty level first.');
            return;
        }
        currentQuestionIndex = 0;
        displayQuestion();
    }

    function restartGame() {
        currentQuestionIndex = 0;
        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            const answers = question.answers;

            document.getElementById('question-text').innerText = question.question;
            document.getElementById('question-button-1').innerText = answers[0];
            document.getElementById('question-button-2').innerText = answers[1];
            document.getElementById('question-button-3').innerText = answers[2];
            document.getElementById('question-button-4').innerText = answers[3];

            console.log('Displaying question:', question.question);
        } else {
            console.log('No more questions.');
        }
    }

    document.getElementById('question-button-1').addEventListener('click', () => handleAnswer(0));
    document.getElementById('question-button-2').addEventListener('click', () => handleAnswer(1));
    document.getElementById('question-button-3').addEventListener('click', () => handleAnswer(2));
    document.getElementById('question-button-4').addEventListener('click', () => handleAnswer(3));

    function handleAnswer(answerIndex) {
        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswer = currentQuestion.correctAnswer;
        if (answerIndex === correctAnswer) {
            console.log('Correct answer!');
        } else {
            console.log('Wrong answer.');
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            console.log('Game over.');
        }
    }
});
