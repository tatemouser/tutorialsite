let currentIndex = {
    beginner: 0,
    advanced: 0,
    expert: 0
};

function showPrev(section) {
    const carouselInner = document.querySelector(`#${section} .carousel-inner`);
    const items = document.querySelectorAll(`#${section} .carousel-item`);
    currentIndex[section] = (currentIndex[section] === 0) ? items.length - 1 : currentIndex[section] - 1;
    updateCarousel(section);
}

function showNext(section) {
    const carouselInner = document.querySelector(`#${section} .carousel-inner`);
    const items = document.querySelectorAll(`#${section} .carousel-item`);
    currentIndex[section] = (currentIndex[section] === items.length - 1) ? 0 : currentIndex[section] + 1;
    updateCarousel(section);
}

function jumpTo(section, index) {
    currentIndex[section] = index;
    updateCarousel(section);
}

function updateCarousel(section) {
    const carouselInner = document.querySelector(`#${section} .carousel-inner`);
    const buttons = document.querySelectorAll(`#${section} .carousel-buttons button`);
    carouselInner.style.transform = `translateX(-${currentIndex[section] * 100}%)`;
    buttons.forEach((button, index) => {
        button.classList.toggle('active', index === currentIndex[section]);
    });
}

function showSection(section) {
    const sections = ['beginner', 'advanced', 'expert'];
    sections.forEach(sec => {
        document.getElementById(sec).style.display = (sec === section) ? 'block' : 'none';
        if (sec === section) {
            updateCarousel(section);
        }
    });
}

function toggleDropdown() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks.style.display === 'block') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'block';
    }
}

// Initialize by showing the first section
document.addEventListener("DOMContentLoaded", () => {
    showSection('beginner');
});
