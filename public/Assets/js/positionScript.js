document.addEventListener('DOMContentLoaded', () => {
    const map = document.getElementById('map');
    const pin = document.getElementById('pin');
    const coordinatesDisplay = document.getElementById('coordinates');
    const imageSizeDisplay = document.getElementById('image-size');
    const startButton = document.getElementById('start-button');
    const questionText = document.getElementById('question-text');
    const feedbackDisplay = document.getElementById('feedback');
    const devButton = document.createElement('button');
    devButton.textContent = 'Toggle Correct Region';
    document.body.appendChild(devButton);
    let questions = [];
    let currentQuestion = null;
    let pinPosition = { x: 0, y: 0 };
    let isClickable = false;
    let correctRegionDiv = null;
    let mapWidth = 0;
    let mapHeight = 0;

    // Function to load questions from JSON
    function loadQuestions() {
        fetch('../positionQuestions.json')
            .then(response => response.json())
            .then(data => {
                questions = data;
            })
            .catch(error => console.error('Error loading questions:', error));
    }

    // Function to handle pin drop
    function dropPin(event) {
        if (!isClickable || !currentQuestion) return;

        // Calculate position relative to the image
        const rect = map.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        // Set pin position
        pin.style.left = `${offsetX}px`;
        pin.style.top = `${offsetY}px`;
        pin.style.display = 'block';

        // Store coordinates
        pinPosition = { x: offsetX, y: offsetY };
        coordinatesDisplay.textContent = `(${offsetX}, ${offsetY})`;

        // Validate the pin position
        validatePinPosition();

        isClickable = false;
    }

    // Function to display image size
    function displayImageSize() {
        mapWidth = map.width;
        mapHeight = map.height;
        imageSizeDisplay.textContent = `Width: ${mapWidth}px, Height: ${mapHeight}px`;
    }

    // Function to handle start button click
    function handleStartButton() {
        if (questions.length === 0) {
            alert('Questions not loaded yet.');
            return;
        }

        // Pick a random question
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];

        // Display the question text
        questionText.textContent = currentQuestion.question;

        // Allow pin dropping
        isClickable = true;

        // Hide pin if it exists and clear coordinates display
        pin.style.display = 'none';
        coordinatesDisplay.textContent = '';
        feedbackDisplay.textContent = '';

        // Display the correct region for developer purposes
        showCorrectRegion();
    }

    // Function to validate pin position
    function validatePinPosition() {
        const correctRegion = getRegionCoordinates(currentQuestion.regions[currentQuestion.correctRegion]);
        const isCorrect = (
            pinPosition.x >= correctRegion.xMin &&
            pinPosition.x <= correctRegion.xMax &&
            pinPosition.y >= correctRegion.yMin &&
            pinPosition.y <= correctRegion.yMax
        );

        if (isCorrect) {
            pin.style.backgroundColor = 'green';
            feedbackDisplay.textContent = 'Correct!';
        } else {
            pin.style.backgroundColor = 'red';
            feedbackDisplay.textContent = 'Wrong, try again!';
        }
    }

    // Function to convert percentage-based regions to pixel-based regions
    function getRegionCoordinates(region) {
        return {
            xMin: mapWidth * (region.xMinPercent / 100),
            xMax: mapWidth * (region.xMaxPercent / 100),
            yMin: mapHeight * (region.yMinPercent / 100),
            yMax: mapHeight * (region.yMaxPercent / 100)
        };
    }

    // Function to display the correct region for development purposes
    function showCorrectRegion() {
        if (correctRegionDiv) {
            correctRegionDiv.remove();
            correctRegionDiv = null;
        }

        const correctRegion = getRegionCoordinates(currentQuestion.regions[currentQuestion.correctRegion]);

        correctRegionDiv = document.createElement('div');
        correctRegionDiv.style.position = 'absolute';
        correctRegionDiv.style.border = '2px dashed blue';
        correctRegionDiv.style.left = `${correctRegion.xMin}px`;
        correctRegionDiv.style.top = `${correctRegion.yMin}px`;
        correctRegionDiv.style.width = `${correctRegion.xMax - correctRegion.xMin}px`;
        correctRegionDiv.style.height = `${correctRegion.yMax - correctRegion.yMin}px`;

        document.querySelector('.container').appendChild(correctRegionDiv);
    }

    // Event listener for clicking on the map
    map.addEventListener('click', dropPin);

    // Event listener for start button
    startButton.addEventListener('click', handleStartButton);

    // Event listener for developer button
    devButton.addEventListener('click', () => {
        if (correctRegionDiv) {
            correctRegionDiv.style.display = correctRegionDiv.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Display image size on load
    displayImageSize();

    // Load questions from JSON
    loadQuestions();
});
