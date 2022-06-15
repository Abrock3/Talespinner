// creating the socket object for this client
const socket = io();
// just retrieving the elements we need (these specifically are only in the game-lobby)
const messageContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('chat-form');
const messageInput = document.getElementById('msg');
const gameStatusEl =document.getElementById('game-status-display');
const libraryNameEl = document.getElementById('library-name');
const playerListEl = document.getElementById('player-list');
const gameStatusAnnouncmentEl = document.getElementById('game-status-announcement');
const startGameButtonEl = document.getElementById('start-game-button');

// this determines if the client is in the game lobby and if so runs the code below
if (messageForm != null) {
  // just stores the nickname that the user will use during their time on the page, this gets referenced while sending socket events
  const name = prompt('What is your name?');
  appendMessage('You joined');
  // this will store the name of the room, this will get referenced by socket events
  const roomName = window.location.pathname.replace('/', '');
  // lets the server know that there's a new user, there is a listener in server.js that will pick this up and use the information it sends
  socket.emit('new-user', roomName, name);

  // handles the function of the chat box form
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    // sends your chat message up to the server, where there's a listener that will decide what to do with it (most likely send it to the other people in your room)
    socket.emit('send-chat-message', roomName, message);
    messageInput.value = '';
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

 <section id = "game-status-display">
    {{!-- lobby name will get inserted with js --}}
    <h3 id ="library-name" ></h3>
    {{!-- player names will be inserted with js --}}
    <ul id = "player-list">
    </ul>
{{!-- game status will appear here --}}
    <p id="game-status-announcement"></p>
    <button id = "start-game-button" class = "hidden">Start Game</button>
  </section>