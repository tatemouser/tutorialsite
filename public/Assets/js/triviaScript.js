document.addEventListener('DOMContentLoaded', () => {
    const easyButton = document.getElementById('easy-button');
    const hardButton = document.getElementById('hard-button');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');

    let originalQuestions = []; // Store original questions to preserve order
    let questions = []; // Store randomized questions
    let currentQuestionIndex = 0;
    let correctCount = 0; // Counter for correct answers
    let wrongCount = 0; // Counter for wrong answers

    // Initialize buttons as disabled
    startButton.disabled = true;
    restartButton.disabled = true;

    // Event listeners for mode selection buttons
    easyButton.addEventListener('click', () => loadQuestions('../questions1.json'));
    hardButton.addEventListener('click', () => loadQuestions('../questions2.json'));

    // Event listener for start button
    startButton.addEventListener('click', startGame);

    // Event listener for restart button
    restartButton.addEventListener('click', restartGame);

    function loadQuestions(jsonFile) {
        fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                originalQuestions = data.map(question => {
                    // Add a 'correctAnswer' property to each question
                    question.correctAnswer = question.correctIndex; // Assuming correctIndex is present in JSON
                    return question;
                });
                console.log('Original Questions loaded:', originalQuestions);
                // Enable the start and restart buttons once questions are loaded
                startButton.disabled = false;
                restartButton.disabled = false;
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    function startGame() {
        if (originalQuestions.length === 0) {
            alert('Please select a difficulty level first.');
            return;
        }
        // Shuffle questions to create randomized order
        questions = shuffleArray([...originalQuestions]);
        currentQuestionIndex = 0;
        correctCount = 0; // Reset correct answer count
        wrongCount = 0; // Reset wrong answer count
        updateScoreDisplay();
        displayQuestion();
    }

    function restartGame() {
        // Shuffle questions again to reset order
        questions = shuffleArray([...originalQuestions]);
        currentQuestionIndex = 0;
        correctCount = 0; // Reset correct answer count
        wrongCount = 0; // Reset wrong answer count
        updateScoreDisplay();
        displayQuestion();

        // Clear question text and answer buttons
        document.getElementById('question-text').innerText = '';
        document.getElementById('question-button-1').innerText = '';
        document.getElementById('question-button-2').innerText = '';
        document.getElementById('question-button-3').innerText = '';
        document.getElementById('question-button-4').innerText = '';

        // Disable start and restart buttons until a mode is selected again
        startButton.disabled = true;
        restartButton.disabled = true;
    }
    
    function displayQuestion() {
        if (questions.length === 0) {
            console.log('No questions available.');
            return;
        }

        const question = questions[currentQuestionIndex];
        const answers = question.answers;

        document.getElementById('question-text').innerText = question.question;
        document.getElementById('question-button-1').querySelector('span').innerText = answers[0];
        document.getElementById('question-button-2').querySelector('span').innerText = answers[1];
        document.getElementById('question-button-3').querySelector('span').innerText = answers[2];
        document.getElementById('question-button-4').querySelector('span').innerText = answers[3];

        console.log('Displaying question:', question.question);

        // Move to the next question index, looping back to the start if at the end
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    }

    // Event listeners for answer buttons
    document.getElementById('question-button-1').addEventListener('click', () => handleAnswer(0));
    document.getElementById('question-button-2').addEventListener('click', () => handleAnswer(1));
    document.getElementById('question-button-3').addEventListener('click', () => handleAnswer(2));
    document.getElementById('question-button-4').addEventListener('click', () => handleAnswer(3));

    function handleAnswer(answerIndex) {
        const currentQuestion = questions[(currentQuestionIndex - 1 + questions.length) % questions.length];
        const correctAnswer = currentQuestion.correctAnswer;
        const correctButton = document.getElementById(`question-button-${correctAnswer + 1}`);

        if (answerIndex === correctAnswer) {
            console.log('Correct answer!');
            correctCount++; // Increment correct answer count
        } else {
            console.log('Wrong answer.');
            wrongCount++; // Increment wrong answer count
        }

        updateScoreDisplay();
        highlightCorrectAnswer(correctButton);
    }

    function highlightCorrectAnswer(correctButton) {
        correctButton.style.backgroundColor = 'green';

        setTimeout(() => {
            correctButton.style.backgroundColor = ''; // Reset background color
            displayQuestion();
        }, 1000); // Wait for 2 seconds before displaying the next question
    }

    function updateScoreDisplay() {
        document.getElementById('correct-count').innerText = correctCount;
        document.getElementById('wrong-count').innerText = wrongCount;
    }

    // Function to shuffle array (Fisher-Yates shuffle algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
