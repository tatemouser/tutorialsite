document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const restartBtn = document.getElementById('restart-btn');
    const endBtn = document.createElement('button');
    const correctCounter = document.getElementById('correct-counter');
    const wrongCounter = document.getElementById('wrong-counter');
    const netImage = document.getElementById('netImage');
    const easyButton = document.getElementById('easyButton');
    const hardButton = document.getElementById('hardButton');

    let currentQuestionIndex = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let shuffledQuestions = [];
    let questions;

    startBtn.addEventListener('click', startQuiz);
    restartBtn.addEventListener('click', restartQuiz);
    endBtn.addEventListener('click', restartQuiz);

    endBtn.innerText = 'End Quiz';
    endBtn.classList.add('btn', 'hide');
    questionContainer.appendChild(endBtn);

    easyButton.addEventListener('click', function() {
        selectDifficulty('easy', easyButton, hardButton);
    });

    hardButton.addEventListener('click', function() {
        selectDifficulty('hard', hardButton, easyButton);
    });

    function startQuiz() {
        const selectedDifficulty = getSelectedDifficulty();
        if (!selectedDifficulty) {
            alert('Please select a difficulty level before starting the game.');
            return;
        }
        startBtn.classList.add('hide');
        questionContainer.classList.remove('hide');
        endBtn.classList.remove('hide');
        fetchQuestionsAndStart(selectedDifficulty);
        netImage.style.opacity = '1';
        netImage.style.width = 'initial';
    }

    function selectDifficulty(difficulty, selectedButton, otherButton) {
        selectedButton.classList.add('active');
        otherButton.classList.remove('active');
        selectedButton.dataset.selected = true;
        otherButton.dataset.selected = false;
    }

    function getSelectedDifficulty() {
        if (easyButton.dataset.selected === 'true') {
            return 'easy';
        }
        if (hardButton.dataset.selected === 'true') {
            return 'hard';
        }
        return null;
    }

    function fetchQuestionsAndStart(difficulty) {
        let questionsFile;
        if (difficulty === 'easy') {
            questionsFile = '../questions1.json';
        } else if (difficulty === 'hard') {
            questionsFile = '../questions2.json';
        } else {
            console.error('Invalid difficulty specified.');
            return;
        }

        fetch(questionsFile)
            .then(response => response.json())
            .then(data => {
                questions = data;
                shuffledQuestions = shuffleArray(questions);
                setNextQuestion();
            })
            .catch(error => {
                console.error('Error loading questions:', error);
            });
    }

    function setNextQuestion() {
        resetState();
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    }

    function showQuestion(question) {
        questionElement.innerText = question.question;
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn', 'btn-answer');
            if (index % 2 === 0) {
                button.classList.add('btn-left');
            } else {
                button.classList.add('btn-right');
            }
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
        netImage.style.opacity = '0';
        netImage.style.width = '1px';
        easyButton.classList.remove('active');
        hardButton.classList.remove('active');
        easyButton.dataset.selected = false;
        hardButton.dataset.selected = false;
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
