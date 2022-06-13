const socket = io();
const messageContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('chat-form');
const messageInput = document.getElementById('msg');

if (messageForm != null) {
  const name = prompt("What is your name?");
  appendMessage("You joined");
  const roomName = window.location.pathname.replace("/", "");
  socket.emit("new-user", roomName, name);

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;

    appendMessage(`You: ${message}`);

    socket.emit("send-chat-message", roomName, message);
    messageInput.value = "";
  });
}

socket.on("chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on("user-connected", (name) => {
  appendMessage(`${name} connected`);
});

socket.on("user-disconnected", (name) => {
  appendMessage(`${name} disconnected`);
});

function appendMessage(message) {
  const messageElement = document.createElement("li");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}