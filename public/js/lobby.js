// allows users to join lobbies by typing into an input and submitting a form
const createLibraryForm = document.getElementById('createLibraryForm');
const createLibraryInput = document.getElementById('createLibraryInput');
const createLibraryBtn = document.getElementById('createLibraryBtn');
const joinLibraryForm = document.getElementById('joinLibraryForm');
const joinLibraryInput = document.getElementById('joinLibraryInput');
const joinLibraryBtn = document.getElementById('joinLibraryBtn');

joinLibraryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  document.location = `/libraries/${joinLibraryInput.value}`;
});
createLibraryBtn.addEventListener('click', (e) => {
  createRoom();
});

async function createRoom() {
  const response = await fetch('/room', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ room: createLibraryInput.value }),
  });
  console.log(response);
  if (response.ok) {
    document.location = `/libraries/${createLibraryInput.value}`;
  } else {
    const { message } = await response.json();
    window.alert(message);
  }
}
