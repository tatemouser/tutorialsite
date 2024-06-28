document.addEventListener('DOMContentLoaded', () => {
    const map = document.getElementById('map');
    const pin = document.getElementById('pin');
    const coordinatesDisplay = document.getElementById('coordinates');
    const imageSizeDisplay = document.getElementById('image-size');
    const startButton = document.getElementById('start-button');
    const questionText = document.getElementById('question-text');
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

    function handleStartButton() {
        if (questions.length === 0) {
            alert('Questions not loaded yet.');
            return;
        }
    
        // Clear the old correct region
        if (correctRegionDiv) {
            correctRegionDiv.remove();
            correctRegionDiv = null;
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
    
        // Display images for the current question
        displayImages(currentQuestion.images);
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
        } else {
            pin.style.backgroundColor = 'red';
        }

        highlightCorrectRegion();
    }

    // Function to convert percentage-based regions to pixel-based regions
    function getRegionCoordinates(region) {
        return {
            xMin: mapWidth * (region.xPercent / 100),
            xMax: mapWidth * ((region.xPercent + region.widthPercent) / 100),
            yMin: mapHeight * (region.yPercent / 100),
            yMax: mapHeight * ((region.yPercent + region.heightPercent) / 100)
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
        correctRegionDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'; // Transparent green
        correctRegionDiv.style.left = `${correctRegion.xMin}px`;
        correctRegionDiv.style.top = `${correctRegion.yMin}px`;
        correctRegionDiv.style.width = `${correctRegion.xMax - correctRegion.xMin}px`;
        correctRegionDiv.style.height = `${correctRegion.yMax - correctRegion.yMin}px`;
        correctRegionDiv.style.pointerEvents = 'none'; // Ensure it doesn't interfere with clicking

        document.querySelector('.container').appendChild(correctRegionDiv);
    }

    function highlightCorrectRegion() {
        if (!correctRegionDiv) {
            showCorrectRegion();
        }
        correctRegionDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.4)'; // Highlight with a more opaque green
    }
    
    

    // Function to display images for the current question
    function displayImages(images) {
        // Remove any existing images
        const existingImages = document.querySelectorAll('.dynamic-image');
        existingImages.forEach(image => image.remove());

        // Add new images based on the current question
        images.forEach(imageData => {
            const img = document.createElement('img');
            img.src = imageData.src;
            img.classList.add('dynamic-image');
            img.style.position = 'absolute';
            img.style.left = `${mapWidth * (imageData.xPercent / 100)}px`;
            img.style.top = `${mapHeight * (imageData.yPercent / 100)}px`;
            img.style.width = `${mapWidth * (imageData.widthPercent / 100)}px`;
            img.style.height = `${mapHeight * (imageData.heightPercent / 100)}px`;

            if (imageData.rotation) {
                img.style.transform = `rotate(${imageData.rotation}deg)`;
                img.style.transformOrigin = 'center';
            }

            document.querySelector('.container').appendChild(img);
        });
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
