// Landing Page
var landingPageBtn = document.querySelector('#landingPageBtn');

// Cards
var createCard = document.querySelector('#create');

// Buttons
var createLibraryBtn = document.querySelector('#createLibrary');

// Event listeners
// this toggles the visibility of the Lobby Creation card
createLibraryBtn.addEventListener('click', function () {
  if (createCard.style.visibility !== 'visible') {
    createCard.style.visibility = 'visible';
  } else {
    createCard.style.visibility = 'hidden';
  }
});
