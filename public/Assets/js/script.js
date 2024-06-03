// Array of roles
const roles = [
    "I am a Software Developer^1000",
    "I am a Database Developer^1000",
    "I am a Student^1000",
    "I am a UI/UX Designer^1000",
    "I am a Frontend Engineer^1000",
    "I am a Web Developer^1000"
];

// Function to update the role strings
function updateRole() {
    try {
        initializeTyped(roles); // Initialize Typed.js with the predefined roles
    } catch (error) {
        console.error('Error updating role:', error);
    }
}

// Function to initialize Typed.js for the role placeholder
function initializeTyped(role) {
    var typed = new Typed(".auto-type", {
        strings: role, // Use the predefined role strings
        startDelay: 1000,
        typeSpeed: 100,
        backSpeed: 50,
        cursorChar: '\u25ae',
        loop: true,
        autoInsertCss: true,
        smartBackspace: true,
        showCursor: false  // Hide the cursor
    });
}

// Update role initially
updateRole();
