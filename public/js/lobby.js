const joinRoomFormEl = document.getElementsById('joinRoomForm');

joinRoomFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchedRoom = joinRoomFormEl.innerText;
  window.location.href = `https://talespinner.herokuapp.com/${searchedRoom}`;
});
