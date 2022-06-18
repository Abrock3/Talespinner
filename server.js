// requiring and initializing express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
// requiring and creating the socket server
const server = require('http').Server(app);
const io = require('socket.io')(server);

const exphbs = require('express-handlebars');

// const sess = {
//   secret: 'Super secret secret',
//   cookie: {},
//   resave: false,
//   saveUninitialized: true,
//   store: new SequelizeStore({
//     db: sequelize
//   })
// };

// app.use(session(sess));
// initializing handlebars and telling JS which templating engine we're using
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

////cookies

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');

// //cookies middle
// const sess = {
//   secret: 'Super secret secret',
//   cookie: {},
//   resave: false,
//   saveUninitialized: true,
// Sets up session store
// store: new SequelizeStore({
//   db: sequelize,
// }),
// };

// app.use(session(sess));

// rooms is the central object that will store all game information, including room names, the users inside those rooms,
// and any game info related to those rooms
const rooms = {
  // testRoom: {
  //   cumulativeStory: `<p> Corey: Blah Blah Blah.<p>
  //   <p>Erica: Nah Nah Nah.</p>
  //   <p>Laura: Dah Dah Dah</p>`,
  //   users: {
  //     ebRk5MdnEo72Nd9gAAAX: 'Laura',
  //     '4n0nhhd0JCzp1NdjAAAN': 'Erica',
  //     L9UJwgk8zAwxPemQAAAR: 'Corey',
  //   },
  //   turnsLeft: 17,
  //   gameStarted: 1,
  //   nextPrompt: 'Gatling Gun',
  //   playerTurn: 2,
  //   turnOrder: [
  //     { socketId: 'L9UJwgk8zAwxPemQAAAR', name: 'Corey' },
  //     { socketId: '4n0nhhd0JCzp1NdjAAAN', name: 'Erica' },
  //     { socketId: 'ebRk5MdnEo72Nd9gAAAX', name: 'Laura' },
  //   ],
  //   hostPlayer: { socketId: 'ebRk5MdnEo72Nd9gAAAX', name: 'Laura' },
  // },
};

// res.render nests landpage.handlebars inside the main.handlebars layout and sends that to the user;
app.get('/', (req, res) => {
  res.render('landpage', { layout: 'main' });
});
// works similarly to the above route
app.get('/lobby', (req, res) => {
  res.render('lobby', { layout: 'main' });
});
app.get('/login', (req, res) => {
  res.render('login', { layout: 'main' });
});

// /room is not a page, it's a route for the "lobby" page to send info when a user is attempting to create a room
app.post('/room', (req, res) => {
  // If the user types a room name that already exists, they'll be redirected back to /lobby to try again
  if (rooms[req.body.room] != null) {
    return res.redirect('/lobby');
  }

  // creates a room key inside of the rooms object; the key's name is identical to the user's input. it also adds a .users object to be added to later
  rooms[req.body.room] = {
    cumulativeStory: '',
    users: {},
    turnsLeft: 20,
    gameStarted: 0,
    nextPrompt: ``,
    playerTurn: 0,
    turnOrder: [],
    hostPlayer: {},
  };
  console.log('rooms');
  console.log(rooms);
  // this will redirect the client to the relative path of "/[their chosen room name]". This is handled below, in the "/:room" route
  res.redirect(req.body.room);
});

app.get('/:room', (req, res) => {
  // if the user attempts to manually type a URL that leads to a room that doesn't exist within the room object, they are redirected to /lobby
  if (rooms[req.params.room] == null) {
    return res.redirect('/lobby');
  }
  // if the room exists, then the user is supplied the HTML from room.handlebars
  res.render('room', { layout: 'main' });
});

// the final step of server initialization
server.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
});

// this is a socket event listener. io.on "connection" listens for any time a client connects and executes the code in the callback
io.on('connection', (socket) => {
  // logs when a user connects
  console.log(`${socket.id} connected`);

  // this is a socket event listener for the custom event "new-user", which is emitted by index.js when a user connects to an existent game lobby
  // room and name are both custom pieces of data that were sent by the index.js while emitting the new-user event
  // the "socket" object represents a single user, not every user (as io does)
  socket.on('new-user', (room, name) => {
    if (rooms[room]) {
      // the socket method .join() will ask socket.io to add that specific socket to the room
      try {
        socket.join(room);
        // adds the user's socket ID as a key to the users object (for that specific room), and then sets their chosen name as the value paired with that key
        rooms[room].users[socket.id] = name;
        if (Object.keys(rooms[room].hostPlayer).length === 0) {
          rooms[room].hostPlayer = { socketId: socket.id, name: name };
        }
        console.log('rooms object');
        console.log(rooms);
        // the socket.io .to() method, when combined with .emit(), will send a custom message to all users that are connected to a specific room
        // this message specifically will let all people in the room that's being joined know that there is a new user, and what their name is.
        // index.js will handle how to deal with that information
        socket.to(room).emit('user-connected', name);
        updateAllPlayersInRoom(room, socket);
      } catch (err) {
        console.log(err);
      }
    } else {
      gameDoesNotExist(socket);
    }
  });
  // another listener for a custom socket event, this one triggers when the "send-chat-message" event gets sent by a client.
  // the room the user is in and their message will also be passed into this listener, which can then be used in the callback
  socket.on('send-chat-message', (room, message) => {
    if (rooms[room]) {
      // sends a custom socket event "chat-message" to all members of the room that the user was in, sending the message and name as well
      // this event is paired with a listener in index.js that will deal with how to use that information
      try {
        socket.to(room).emit('chat-message', {
          message: message,
          name: rooms[room].users[socket.id],
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      gameDoesNotExist(socket);
    }
  });
  socket.on('start-game', (room, newPrompt) => {
    if (rooms[room]) {
      try {
        rooms[room].gameStarted = 1;
        let turnOrderArray = [];
        for (const user in rooms[room].users) {
          turnOrderArray.push({
            socketId: user,
            name: rooms[room].users[user],
          });
        }
        rooms[room].turnOrder = turnOrderArray;
        rooms[room].playerTurn = Math.floor(
          Math.random() * turnOrderArray.length
        );
        rooms[room].turnsLeft = 20;
        rooms[room].nextPrompt = newPrompt;

        updateAllPlayersInRoom(room, socket);
      } catch (err) {
        console.log(err);
      }
    } else {
      gameDoesNotExist(socket);
    }
  });

  socket.on('update-my-game-info', (room) => {
    if (rooms[room]) {
      io.to(socket.id).emit('game-status-update', {
        cumulativeStory: rooms[room].cumulativeStory,
        turnOrder: rooms[room].turnOrder,
        gameStarted: rooms[room].gameStarted,
        nextPrompt: rooms[room].nextPrompt,
        playerTurn: rooms[room].playerTurn,
        users: rooms[room].users,
        turnsLeft: rooms[room].turnsLeft,
        hostPlayer: rooms[room].hostPlayer,
        gameStarted: rooms[room].gameStarted,
      });
    } else {
      gameDoesNotExist(socket);
    }
  });

  socket.on('request-status-update', (room) => {
    updateAllPlayersInRoom(room, socket);
  });

  socket.on('send-new-story-snippet', (room, story, newPrompt) => {
    if (rooms[room]) {
      try {
        if (
          socket.id === rooms[room].turnOrder[rooms[room].playerTurn].socketId
        ) {
          rooms[room].cumulativeStory += `${
            rooms[room].users[socket.id]
          }: ${story}<br>`;
          rooms[room].nextPrompt = newPrompt;
          rooms[room].turnsLeft--;

          if (rooms[room].playerTurn === rooms[room].turnOrder.length - 1) {
            rooms[room].playerTurn = 0;
          } else {
            rooms[room].playerTurn++;
          }
          updateAllPlayersInRoom(room, socket);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      gameDoesNotExist(socket);
    }
  });

  // this listener listens for when a user disconnects from a room
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach((room) => {
      // sends a custom socket event to the room they left, to be dealt with by the index.js code of the other users
      socket.to(room).emit('user-disconnected', rooms[room].users[socket.id]);
      // deletes their socket id key from the users object of that room
      delete rooms[room].users[socket.id];
      console.log(rooms[room].users);
      // if the room has 0 clients left connected to it, it will set a timeout that will delete the room from our rooms object after 30 seconds.
      if (Object.keys(rooms[room].users).length === 0) {
        roomKillTimer(room);
      }
      updateAllPlayersInRoom(room, socket);
    });
  });
});
// called within the socket "disconnect" listener to retrieve the room that the client was in
function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}
function roomKillTimer(room) {
  console.log(
    `The room "${room}" will be deleted after 30 seconds with no connection.`
  );
  let seconds = 0;
  let roomKillInterval = setInterval(() => {
    seconds++;
    if (Object.keys(rooms[room].users).length > 0) {
      console.log(
        `The room "${room}" will not be deleted, as a user rejoined.`
      );
      clearInterval(roomKillInterval);
    }
    if (seconds >= 29) {
      delete rooms[room];
      console.log(`The room "${room}" has been deleted.`);
      clearInterval(roomKillInterval);
    }
  }, 1000);
}

function updateAllPlayersInRoom(room, socket) {
  if (rooms[room]) {
    try {
      io.in(room).emit('game-status-update', {
        cumulativeStory: rooms[room].cumulativeStory,
        turnOrder: rooms[room].turnOrder,
        gameStarted: rooms[room].gameStarted,
        nextPrompt: rooms[room].nextPrompt,
        playerTurn: rooms[room].playerTurn,
        users: rooms[room].users,
        turnsLeft: rooms[room].turnsLeft,
        hostPlayer: rooms[room].hostPlayer,
        gameStarted: rooms[room].gameStarted,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    gameDoesNotExist(socket);
  }
}

function gameDoesNotExist(socket) {
  try {
    io.to(socket.id).emit('game-does-not-exist');
  } catch (err) {
    console.log(err);
  }
}
