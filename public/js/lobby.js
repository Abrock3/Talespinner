const joinRoomFormEl = document.getElementById('joinRoomForm');
const joinRoomInputEl = document.getElementById('joinRoomInput');
joinRoomFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchedRoom = joinRoomInputEl.value;
  document.location = '/' + searchedRoom;
});
