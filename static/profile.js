const carousel = document.querySelector('.carousel-container');
const leftButton = document.querySelector('.nav.left');
const rightButton = document.querySelector('.nav.right');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');
const header = document.querySelector('header'); // Select the header

let currentIndex = 0;
const cardWidth = 310;
const visibleCards = 3;
const totalCards = carousel.children.length;
const maxIndex = totalCards - visibleCards;

// Carousel navigation buttons event listeners
leftButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }
});

rightButton.addEventListener('click', () => {
  if (currentIndex < maxIndex) {
    currentIndex++;
    carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }
});

// Handling the "Information" button click to show the modal
document.querySelectorAll('.info-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const imgSrc = e.target.dataset.img;
    modal.style.display = 'flex';  // Show the modal
    modalImage.src = imgSrc;

    // Hide the carousel navigation buttons
    leftButton.style.visibility = 'hidden';
    rightButton.style.visibility = 'hidden';

    // Hide the header
    header.style.visibility = 'hidden';  // Use visibility instead of display
  });
});

// Closing the modal and showing the buttons and header again
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';  // Hide the modal

  // Show the carousel navigation buttons again
  leftButton.style.visibility = 'visible';
  rightButton.style.visibility = 'visible';

  // Show the header again
  header.style.visibility = 'visible';  // Restore the header visibility
});
