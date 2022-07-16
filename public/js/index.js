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
const storySaveBtnEl = document.getElementById('story-save-button');
let finalStory = ``;
// displays that you joined in the chat box
appendMessage('You joined');

// sets the title of the library to the room's name
libraryNameEl.innerHTML = libraryName;
roomName = libraryNameEl.innerText;

// lets the server know that there's a new user,
// there is a listener in server.js that will pick this up and update the other users
socket.emit('new-user', roomName, name);

// this is one of several functions that updates elements on the page
// this one uses data obtained from the server using socket.io to update the current list of players that are in the room
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

// this uses data from the server to update the story so far
function updateCumulativeStory(data) {
  storyTextEl.innerHTML = '';
  const storyElement = document.createElement('p');
  storyElement.style.whiteSpace = 'pre-line';
  storyElement.innerText = data.cumulativeStory;
  storyTextEl.append(storyElement);
  storyElement.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest',
  });
}

// based on the state of the game (whether the game is started, if you're the host, or if it's your turn)
// this will make elements visible or invisible to allow the correct player to start the game, take their turn, or
// update them on what's going on at that moment
function updateFormStatus(data) {
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
    storyInputEl.focus();
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

// this wraps up all of the functions into one; preferably later I'll make more specific socket events so less
// information is getting passed between server and client with each action
function fullGameStatusUpdate(data) {
  updatePlayerList(data);
  updateCumulativeStory(data);
  updateFormStatus(data);
}

// this is a socket event listener that listens for a custom event from the server. On receiving that event,
// it will use the data passed in to update the entire page for each person
socket.on('game-status-update', (data) => {
  fullGameStatusUpdate(data);
  if (data.turnsLeft === 0) {
    hostPlayerSettingsFormEl.classList.add('hidden');
    submitStoryFormEl.classList.add('hidden');
    gameStatusInfoParaEl.classList.remove('hidden');
    gameStatusInfoParaEl.innerText =
      'The game is over! I hope you had fun writing a story with your friends!';
    // this determines if the user is one of the "players", and if so allows them to save the story
    // players get locked in when the game starts, so others can watch but can't save the story if they
    // weren't a player
    let playerBool = false;
    for (let i = 0; i < data.turnOrder.length; i++) {
      if (data.turnOrder[i].name === name) {
        playerBool = true;
      }
    }
    if (playerBool) {
      finalStory = data.cumulativeStory;
      storySaveBtnEl.classList.remove('hidden');
    }
  }
});

// if a client gets disconnected for long periods of time, the game lobby may get shut down
// after 30 seconds without a user connected any room will be destroyed. If a user reconnects while their client
// is still in a lobby, this event gets displayed to them
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
  if (
    messageContainerEl.scrollHeight -
      messageContainerEl.scrollTop -
      messageContainerEl.clientHeight <
    200
  ) {
    messageElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }
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

// This collects the story the user wrote and the prompt they submitted and sends them to the server
// the server will update the cumulative story, the turn, and the prompt in the central rooms object
// and then that information will be sent back to all members of this room
submitStoryFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const story = storyInputEl.value;
  const newPrompt = promptInputEl.value;
  // sends your chat message up to the server, where there's a listener that will decide what to do with it (most likely send it to the other people in your room)
  socket.emit('send-new-story-snippet', roomName, story, newPrompt, name);
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

// gives the host player the ability to randomize prompts from preset arrays if they wish
randomizePromptsBtnEl.addEventListener('click', () => {
  randomizePrompts();
});

// this allows the user to permanently save a story after it's complete, in a server side db.
// this can be accessed in their profile
storySaveBtnEl.addEventListener('click', async () => {
  const name = roomName;
  const story = finalStory;
  if (story) {
    const response = await fetch(`/api/libraries`, {
      method: 'POST',
      body: JSON.stringify({ name, story }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Your story saved!');
    } else {
      alert('Your story failed to save. Sorry!');
    }
  }
});

// collects the "settings" the host player selected and uses them to start the game with a socket event
hostPlayerSettingsFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const newPrompt = `Genre: ${genreSpanEl.innerText}
    Setting: ${settingSpanEl.innerText}
   Object: ${objectSpanEl.innerText}
  Character: ${characterSpanEl.innerText}`;
  socket.emit('start-game', roomName, newPrompt);
});

// I wasn't sure exactly how the page would do if a user navigated to another tab while playing;
// when the user navigates back, this will request a full game update from the server
window.addEventListener('focus', function () {
  socket.emit('update-my-game-info', roomName);
});
