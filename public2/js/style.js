// Lobby 
// Cards
var createCard = document.querySelector("#create")
var historyCard = document.querySelector("#history")
var searchCard = document.querySelector("#results")

// Buttons

var searchBtn = document.querySelector("#searchBtn")
var viewLibraryBtn = document.querySelector("#viewLibrary")
var createLibraryBtn = document.querySelector("#createLibrary")


// Event listeners



createLibraryBtn.addEventListener("click", function() {
    createCard.style.visibility="visible";
})

viewLibraryBtn.addEventListener("click", function() {
    historyCard.style.visibility="visible";
})


searchBtn.addEventListener("click", function(e) {
    e.preventDefault();
    searchCard.style.visibility="visible";
})

