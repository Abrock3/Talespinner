// creating the socket object for this client
const socket = io();
const messageContainerEl = document.getElementById('chat-container');
const messageFormEl = document.getElementById('chat-form');
const messageInputEl = document.getElementById('msg');
const libraryNameEl = document.getElementById('library-name');
const playerListEl = document.getElementById('player-list');
const startGameButtonEl = document.getElementById('start-game-button');
const storyTextEl = document.getElementById('user-text');
const submitStoryFormEl = document.getElementById('submit-story-form');
const storyInputEl = document.getElementById('story-text-input');
const promptInputEl = document.getElementById('prompt-input');
const promptDisplayEl = document.getElementById('prompt-text');
const genreSpanEl = document.getElementById('genre-span');
const settingSpanEl = document.getElementById('setting-span');
const objectSpanEl = document.getElementById('object-span');
const characterSpanEl = document.getElementById('character-span');
const hostPlayerSettingsFormEl = document.getElementById(
  'host-player-settings-form'
);
const gameStatusInfoParaEl = document.getElementById('game-status-info');
const randomizePromptsBtnEl = document.getElementById('randomize-prompts-btn');

// just stores the nickname that the user will use during their time on the page,
// this gets referenced while sending socket events.
// Preferably this will be established by an authorized username later
appendMessage('You joined');
// this will store the name of the room, this will get referenced by socket events

libraryNameEl.innerHTML = roomName;

// lets the server know that there's a new user,
// there is a listener in server.js that will pick this up and update the other users
socket.emit('new-user', roomName, name);

function updatePlayerList(data) {
  playerListEl.innerHTML = '';
  if (data.gameStarted === 0) {
    Object.entries(data.users).forEach((e, index) => {
      const playerEl = document.createElement('li');
      playerEl.innerHTML = `Player ${index + 1}: ${e[1]}`;
      if (data.hostPlayer.name === e[1] && data.gameStarted === 0) {
        playerEl.innerHTML += ` (host)`;
      }
      playerEl.classList.add('player-name-element', 'p-1');
      playerListEl.append(playerEl);
    });
  } else {
    for (let i = 0; i < data.turnOrder.length; i++) {
      const playerEl = document.createElement('li');
      playerEl.innerHTML = `Player ${i + 1}: ${data.turnOrder[i].name}`;
      if (i === data.playerTurn) {
        playerEl.classList.add('this-players-turn');
      }
      playerEl.classList.add('player-name-element', 'p-1');
      if (Object.values(data.users).indexOf(data.turnOrder[i].name) === -1) {
        playerEl.innerHTML += ` (currently disconnected)`;
      }
      playerListEl.append(playerEl);
    }
  }
}

function updateCumulativeStory(data) {
  storyTextEl.innerHTML = data.cumulativeStory;
}

function updateFormStatus(socket, data) {
  if (data.hostPlayer.name === name && data.gameStarted === 0) {
    if (genreSpanEl.innerText === '') {
      randomizePrompts();
    }
    hostPlayerSettingsFormEl.classList.remove('hidden');
    submitStoryFormEl.classList.add('hidden');
    gameStatusInfoParaEl.classList.add('hidden');
  } else if (data.hostPlayer.name !== name && data.gameStarted === 0) {
    hostPlayerSettingsFormEl.classList.add('hidden');
    submitStoryFormEl.classList.add('hidden');
    gameStatusInfoParaEl.classList.remove('hidden');
    gameStatusInfoParaEl.innerText = 'Waiting on the host to start the game...';
  } else if (
    data.turnOrder[data.playerTurn].name === name &&
    data.gameStarted === 1
  ) {
    hostPlayerSettingsFormEl.classList.add('hidden');
    submitStoryFormEl.classList.remove('hidden');
    gameStatusInfoParaEl.classList.add('hidden');
    promptDisplayEl.innerText = data.nextPrompt;
  } else if (
    data.turnOrder[data.playerTurn].name !== name &&
    data.gameStarted === 1
  ) {
    hostPlayerSettingsFormEl.classList.add('hidden');
    submitStoryFormEl.classList.add('hidden');
    gameStatusInfoParaEl.classList.remove('hidden');
    gameStatusInfoParaEl.innerText = `Currently it's ${
      data.turnOrder[data.playerTurn].name
    }'s turn; they're writing a new line with this prompt: ${data.nextPrompt}`;
  }
}

function fullGameStatusUpdate(socket, data) {
  updatePlayerList(data);
  updateCumulativeStory(data);
  updateFormStatus(socket, data);
}

socket.on('game-status-update', (data) => {
  fullGameStatusUpdate(socket, data);
  if (data.turnsLeft === 0) {
    hostPlayerSettingsFormEl.classList.add('hidden');
    submitStoryFormEl.classList.add('hidden');
    gameStatusInfoParaEl.classList.remove('hidden');
    gameStatusInfoParaEl.innerText =
      'The game is over! I hope you had fun writing a story with your friends!';
  }
});

socket.on('game-does-not-exist', () => {
  hostPlayerSettingsFormEl.classList.add('hidden');
  submitStoryFormEl.classList.add('hidden');
  gameStatusInfoParaEl.classList.remove('hidden');
  gameStatusInfoParaEl.innerText = `This room no longer exists; go back to the lobby to create another game.`;
});

// listens for a chat-message from the server (which originally came from another client) and displays it
socket.on('chat-message', (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

// listens for when the server sends a message that a user connected and announces it to the previously connected clients
socket.on('user-connected', (name) => {
  appendMessage(`${name} connected`);
});

// listens for when the server sends a message that a user disconnected and announces it to the clients that remain in the room
socket.on('user-disconnected', (name) => {
  appendMessage(`${name} disconnected`);
});

// handles how chat and join messages are displayed to each user.
function appendMessage(message) {
  const messageElement = document.createElement('li');
  messageElement.innerText = message;
  messageContainerEl.append(messageElement);
}

// presents the host player with randomized prompts to start the game with
function randomizePrompts() {
  genreSpanEl.innerText = genres[Math.floor(Math.random() * genres.length)];
  settingSpanEl.innerText =
    settings[Math.floor(Math.random() * settings.length)];
  objectSpanEl.innerText = objects[Math.floor(Math.random() * objects.length)];
  characterSpanEl.innerText =
    characters[Math.floor(Math.random() * characters.length)];
}

submitStoryFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const story = storyInputEl.value;
  const newPrompt = promptInputEl.value;
  // sends your chat message up to the server, where there's a listener that will decide what to do with it (most likely send it to the other people in your room)
  socket.emit('send-new-story-snippet', roomName, story, newPrompt);
  storyInputEl.value = '';
  promptInputEl.value = '';
});

// handles the function of the chat box form
messageFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInputEl.value;
  appendMessage(`You: ${message}`);
  // sends your chat message up to the server, where there's a listener that will decide what to do with it (most likely send it to the other people in your room)
  socket.emit('send-chat-message', roomName, message);
  messageInputEl.value = '';
});

randomizePromptsBtnEl.addEventListener('click', () => {
  randomizePrompts();
});

hostPlayerSettingsFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const newPrompt = `Genre: ${genreSpanEl.innerText}
    Setting: ${settingSpanEl.innerText}
   Object: ${objectSpanEl.innerText}
  Character: ${characterSpanEl.innerText}`;
  socket.emit('start-game', roomName, newPrompt);
});

window.addEventListener('focus', function () {
  socket.emit('update-my-game-info', roomName);
});
