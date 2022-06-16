// creating the socket object for this client
const socket = io();
// just retrieving the elements we need (these specifically are only in the game-lobby)
const messageContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('chat-form');
const messageInput = document.getElementById('msg');
const libraryNameEl = document.getElementById('library-name');
const playerListEl = document.getElementById('player-list');
const gameStatusAnnouncementEl = document.getElementById(
  'game-status-announcement'
);
const startGameButtonEl = document.getElementById('start-game-button');
const storyTextEl = document.getElementById('story-text');

// this determines if the client is in the game lobby and if so runs the code below
if (messageForm != null) {
  // just stores the nickname that the user will use during their time on the page, this gets referenced while sending socket events
  const name = prompt('What is your name?');
  appendMessage('You joined');
  // this will store the name of the room, this will get referenced by socket events
  const roomName = window.location.pathname.replace('/', '');
  libraryNameEl.innerHTML = roomName;
  // lets the server know that there's a new user, there is a listener in server.js that will pick this up and use the information it sends
  socket.emit('new-user', roomName, name);
  socket.emit('request-status-update', roomName);
  // handles the function of the chat box form
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    // sends your chat message up to the server, where there's a listener that will decide what to do with it (most likely send it to the other people in your room)
    socket.emit('send-chat-message', roomName, message);
    messageInput.value = '';
  });

  function updatePlayerList(data) {
    console.log(data);
    playerListEl.innerHTML = '';
    if (data.gameStarted === 0) {
      Object.values(data.users).forEach((e, index) => {
        const playerEl = document.createElement('li');
        playerEl.innerHTML = `Player ${index + 1}: ${e}`;
        playerEl.classList.add('player-name-element', 'p-1');
        playerListEl.append(playerEl);
      });
    } else {
      for (let i = 0; i < data.turnOrder.length; i++) {
        const playerEl = document.createElement('li');
        playerEl.innerHTML = `Player ${i + 1}: ${data.turnOrder[i].name}`;
        if (i === data.playerTurn) {
          playerEl.style.border = 'solid 1px black';
          playerEl.classList.add('this-players-turn');
        }
        playerEl.classList.add('player-name-element', 'p-1');
        playerListEl.append(playerEl);
      }
    }
  }

  function updateGameStatus(socket, data) {
    console.log(data);
    if (data.gameStarted) {
      gameStatusAnnouncementEl.innerHTML = `It is ${
        socket.id === data.turnOrder[data.playerTurn].socketId
          ? 'your'
          : data.turnOrder[data.playerTurn].name + "'s"
      } turn. There are ${
        data.turnsLeft
      } turns left in the game. The next statement must include "${
        data.nextPrompt
      }."`;
    } else {
      gameStatusAnnouncementEl.innerHTML = `Game status: the host has not started the game yet.`;
    }
  }

  function updateCumulativeStory(data) {
    console.log(data);
    storyTextEl.innerHTML = data.cumulativeStory;
  }

  function fullGameStatusUpdate(socket, data) {
    console.log('Fullgamestatusupdate');
    updatePlayerList(data);
    updateGameStatus(socket, data);
    updateCumulativeStory(data);
  }
  socket.on('game-status-update', (data) => {
    fullGameStatusUpdate(socket, data);
  });
  window.addEventListener('focus', function () {
    socket.emit('update-my-game-info', roomName);
  });
}

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

// handles how the messages are displayed to each user. We'll have to make a similar function to handle the outputted game text,
// since it will be displayed in another element
function appendMessage(message) {
  const messageElement = document.createElement('li');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
