// requiring and initializing express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const routes = require('./controllers');
// requiring and creating the socket server
const server = require('http').Server(app);
const io = require('socket.io')(server);
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const withAuth = require('./utils/auth');
const { User } = require('./models');

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));
// initializing handlebars and telling JS which templating engine we're using
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
// brings in routes from the controllers folder
app.use(routes);

// rooms is the central object that will store all game information, including room names, the users inside those rooms,
// and any game info related to those rooms. The commented out section represents what a typical rooms object
// will look like during play.
app.locals.rooms = {};

// the final step of server initialization
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});

// this is a socket event listener. io.on "connection" listens for any time a client connects and executes the code in the callback
io.on('connection', (socket) => {
  // logs when a user connects
  console.log(`${socket.id} connected`);
  // this is a socket event listener for the custom event "new-user", which is emitted by index.js when a user connects to an existent game lobby
  // room and name are both custom pieces of data that were sent by index.js while emitting the new-user event
  // the "socket" object represents a single user, not every user (as io does)
  socket.on('new-user', (room, name) => {
    if (app.locals.rooms[room]) {
      // the socket method .join() will ask socket.io to add that specific socket to the room
      try {
        socket.join(room);
        // adds the user's socket ID as a key to the users object (for that specific room), and then sets their chosen name as the value paired with that key
        app.locals.rooms[room].users[socket.id] = name;
        if (Object.keys(app.locals.rooms[room].hostPlayer).length === 0) {
          app.locals.rooms[room].hostPlayer = { socketId: socket.id, name: name };
        }

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
    if (app.locals.rooms[room]) {
      // sends a custom socket event "chat-message" to all members of the room that the user was in, sending the message and name as well
      // this event is paired with a listener in index.js that will deal with how to use that information
      try {
        socket.to(room).emit('chat-message', {
          message: message,
          name: app.locals.rooms[room].users[socket.id],
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      gameDoesNotExist(socket);
    }
  });
  socket.on('start-game', (room, newPrompt) => {
    if (app.locals.rooms[room]) {
      try {
        app.locals.rooms[room].gameStarted = 1;
        let turnOrderArray = [];
        for (const user in app.locals.rooms[room].users) {
          turnOrderArray.push({
            socketId: user,
            name: app.locals.rooms[room].users[user],
          });
        }
        app.locals.rooms[room].turnOrder = turnOrderArray;
        app.locals.rooms[room].playerTurn = Math.floor(
          Math.random() * turnOrderArray.length
        );
        app.locals.rooms[room].turnsLeft = 10;
        app.locals.rooms[room].nextPrompt = newPrompt;

        updateAllPlayersInRoom(room, socket);
      } catch (err) {
        console.log(err);
      }
    } else {
      gameDoesNotExist(socket);
    }
  });
  // updates a specific client's game info, if they navigated away and came back
  socket.on('update-my-game-info', (room) => {
    if (app.locals.rooms[room]) {
      io.to(socket.id).emit('game-status-update', {
        cumulativeStory: app.locals.rooms[room].cumulativeStory,
        turnOrder: app.locals.rooms[room].turnOrder,
        gameStarted: app.locals.rooms[room].gameStarted,
        nextPrompt: app.locals.rooms[room].nextPrompt,
        playerTurn: app.locals.rooms[room].playerTurn,
        users: app.locals.rooms[room].users,
        turnsLeft: app.locals.rooms[room].turnsLeft,
        hostPlayer: app.locals.rooms[room].hostPlayer,
        gameStarted: app.locals.rooms[room].gameStarted,
      });
    } else {
      gameDoesNotExist(socket);
    }
  });

  // this is the standard socket event listener for whenever the game has changed in some way
  // for example, if a user joins, their client will send this event to the server, and this will catch
  // it and send an update request back to all clients in the game lobby
  socket.on('request-status-update', (room) => {
    updateAllPlayersInRoom(room, socket);
  });

  // this is the custom event listener that listens for when a player finishes their turn
  socket.on('send-new-story-snippet', (room, story, newPrompt, name) => {
    if (app.locals.rooms[room]) {
      try {
        if (name === app.locals.rooms[room].turnOrder[app.locals.rooms[room].playerTurn].name) {
          app.locals.rooms[room].turnsLeft--;
          app.locals.rooms[room].cumulativeStory += `${
            app.locals.rooms[room].users[socket.id]
          }: ${story}\n`;
          app.locals.rooms[room].nextPrompt = newPrompt;

          if (app.locals.rooms[room].playerTurn === app.locals.rooms[room].turnOrder.length - 1) {
            app.locals.rooms[room].playerTurn = 0;
          } else {
            app.locals.rooms[room].playerTurn++;
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
    try {
      getUserRooms(socket).forEach((room) => {
        // sends a custom socket event to the room they left, to be dealt with by the index.js code of the other users
        socket.to(room).emit('user-disconnected', app.locals.rooms[room].users[socket.id]);
        // deletes their socket id key from the users object of that room
        delete app.locals.rooms[room].users[socket.id];

        // if the room has 0 clients left connected to it,
        // it will set a timeout that will delete the room from our rooms object after 30 seconds.
        if (Object.keys(app.locals.rooms[room].users).length === 0) {
          roomKillTimer(room);
        }
        updateAllPlayersInRoom(room, socket);
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// called within the socket "disconnect" listener to retrieve the room that the client was in
function getUserRooms(socket) {
  return Object.entries(app.locals.rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}
// if a game lobby is empty, this will use an interval to periodically check whether the room is still empty;
// if after 30 seconds no one has connected, it will be destroyed. If someone connects, it will end the interval
function roomKillTimer(room) {
  console.log(
    `The room "${room}" will be deleted after 30 seconds with no connection.`
  );
  let seconds = 0;
  let roomKillInterval = setInterval(() => {
    seconds++;
    if (Object.keys(app.locals.rooms[room].users).length > 0) {
      console.log(
        `The room "${room}" will not be deleted, as a user rejoined.`
      );
      clearInterval(roomKillInterval);
    }
    if (seconds >= 29) {
      delete app.locals.rooms[room];
      console.log(`The room "${room}" has been deleted.`);
      clearInterval(roomKillInterval);
    }
  }, 1000);
}

// this function will send a "game-status-update" socket event to all players in a room, which
// sends all necessary game information to the users, to be dealt with by the client-side js
function updateAllPlayersInRoom(room, socket) {
  // error handling in case someone somehow accesses a room while it doesn't exist
  if (app.locals.rooms[room]) {
    try {
      io.in(room).emit('game-status-update', {
        cumulativeStory: app.locals.rooms[room].cumulativeStory,
        turnOrder: app.locals.rooms[room].turnOrder,
        gameStarted: app.locals.rooms[room].gameStarted,
        nextPrompt: app.locals.rooms[room].nextPrompt,
        playerTurn: app.locals.rooms[room].playerTurn,
        users: app.locals.rooms[room].users,
        turnsLeft: app.locals.rooms[room].turnsLeft,
        hostPlayer: app.locals.rooms[room].hostPlayer,
        gameStarted: app.locals.rooms[room].gameStarted,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    gameDoesNotExist(socket);
  }
}

// this will notify a user that a game no longer exists if they, for example, lose their internet connection,
// return later and try to resume playing the game in the same room (after the room has been destroyed)
function gameDoesNotExist(socket) {
  try {
    io.to(socket.id).emit('game-does-not-exist');
  } catch (err) {
    console.log(err);
  }
}
// If for some reason our logic misses the destruction of a room, this will check hourly to make sure
// that every room in the rooms object is also in the io object. If it's not, that means it shouldn't exist;
// we'll set an interval to check for 30 seconds whether it's still not in the object (maybe the client needed to reconnect)
// if it doesn't appear in the socket.io list of rooms again, then it will be destroyed in 30 seconds
// commenting this out until I do more research on how this will work on heroku
// function roomSweep() {
//   try {
//     let roomSweepInterval = setInterval(() => {
//       if (Object.keys(app.locals.rooms).length) {
//         console.log('Sweep starting');
//         let socketRoomArr = [];
//         Array.from(io.sockets.adapter.rooms).forEach((room) => {
//           socketRoomArr.push(room[0]);
//         });
//         console.log(socketRoomArr);
//         console.log(Object.keys(app.locals.rooms));
//         Object.keys(app.locals.rooms).forEach((room) => {
//           if (!socketRoomArr.includes(room)) {
//             console.log(
//               `The room "${room}" has been identified to be persisting with no users in it. It will be deleted after 30 seconds with no connection.`
//             );
//             let roomKillInterval = setInterval(() => {
//               seconds++;
//               if (socketRoomArr.includes(room)) {
//                 console.log(
//                   `The room "${room}" will not be deleted, as it was found in the rooms object again.`
//                 );
//                 clearInterval(roomKillInterval);
//               }
//               if (seconds >= 29) {
//                 delete app.locals.rooms[room];
//                 console.log(
//                   `The room "${room}" has been deleted as part of the room sweep.`
//                 );
//                 clearInterval(roomKillInterval);
//               }
//             }, 1000);
//           }
//         });
//       }
//     }, 86400000);
//   } catch (err) {
//     console.log(err);
//   }
// }

// roomSweep();
