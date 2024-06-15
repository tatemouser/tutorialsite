function toggleDropdown() {
    var navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("show");
  }

  document.addEventListener('DOMContentLoaded', (event) => {
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');

    video1.addEventListener('ended', () => {
        video1.style.display = 'none';
        video2.style.display = 'block';
        video2.play();
    });

    video2.addEventListener('ended', () => {
        video2.style.display = 'none';
        video1.style.display = 'block';
        video1.play();
    });
});