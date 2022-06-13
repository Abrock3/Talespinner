const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const exphbs = require('express-handlebars');
const path = require('path');
const hbs = exphbs.create({});
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const rooms = {};

app.get('/', (req, res) => {
  res.render('landpage', { layout: 'main' });
});

app.get('/home', (req, res) => {
  res.render('home', { layout: 'main' });
});

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/');
  }

  rooms[req.body.room] = { users: {} };
  console.log('rooms');
  console.log(rooms);
  res.redirect(req.body.room);
});

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/');
  }
  res.render('game-lobby', { layout: 'main' });
});

server.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('socket.rooms on connect');
  console.log(socket.rooms);
  console.log('connected');
  socket.on('new-user', (room, name) => {
    socket.join(room);
    console.log('room:');
    console.log(room);
    console.log('name');
    console.log(name);
    console.log('socket.rooms');
    console.log(socket.rooms);
    rooms[room].users[socket.id] = name;
    socket.to(room).emit('user-connected', name);
  });
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).emit('chat-message', {
      message: message,
      name: rooms[room].users[socket.id],
    });
  });
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach((room) => {
      socket.to(room).emit('user-disconnected', rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
});

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}
