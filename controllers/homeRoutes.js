const router = require('express').Router();
const { Library, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  res.render('landpage', { layout: 'main' });
});
// A route for the client to send info to when a user is attempting to create a room.
// I would have put this and other routes in the controllers folder,
// but it needs to be able to modify the rooms object
router.post('/room', withAuth, (req, res) => {
  // If the user types a room name that already exists, they'll be redirected back to /lobby to try again
  if (req.app.locals.rooms[req.body.room] != null) {
    return res.redirect('/lobby');
  }

  // creates a room key inside of the rooms object; the key's name is identical to the user's input.
  // it also adds a .users object to be added to later, this will be how the game logic is handled
  req.app.locals.rooms[req.body.room] = {
    cumulativeStory: '',
    users: {},
    turnsLeft: 10,
    gameStarted: 0,
    nextPrompt: ``,
    playerTurn: 0,
    turnOrder: [],
    hostPlayer: {},
  };
  console.log(`Room created: ${req.body.room}`);
  // this will redirect the client to the relative path of "/[their chosen room name]". This is handled below, in the "/:room" route
  res.redirect(`/libraries/` + req.body.room);
});

// gets the user's username from the database and passes it into handlebars
// handlebars will then establish their username as a variable in the client-side JS
router.get('/libraries/:room', withAuth, async (req, res) => {
  // if the user attempts to join a room that doesn't exist within the room object, they are redirected to /lobby
  // also, if there are 6 people in a room already the user will be redirected to the lobby
  if (
    req.app.locals.rooms[req.params.room] == null ||
    Object.keys(req.app.locals.rooms[req.params.room].users).length >= 6
  ) {
    return res.redirect('/lobby');
  }
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password', 'email', 'id'] },
    });
    const user = userData.get({ plain: true });
    // prevents a user from using multiple tabs to enter the same room multiple times
    if (
      !Object.values(req.app.locals.rooms[req.params.room].users).includes(
        user.name
      )
    ) {
      return res.render('room', {
        layout: 'main',
        roomName: req.params.room,
        name: user.name,
      });
    } else {
      return res.redirect('/lobby');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// works similarly to the above route, but passes in whether the user is logged in
router.get('/lobby', (req, res) => {
  res.render('lobby', { layout: 'main', logged_in: req.session.logged_in });
});

router.get('/login', (req, res) => {
  res.render('login', { layout: 'main', logged_in: req.session.logged_in });
});

// Use withAuth middleware to prevent access to route if the user isn't logged in
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Library }],
    });

    const user = userData.get({ plain: true });
    console.log(user);
    res.render('profile', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/lobby');
    return;
  }
  res.render('login');
});

module.exports = router;
