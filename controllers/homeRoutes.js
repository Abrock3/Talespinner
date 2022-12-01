const router = require('express').Router();
const { Library, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  res.render('landpage', { layout: 'main' });
});
// Attempts to create a new room for a user
router.post('/room', withAuth, (req, res) => {
  if (req.app.locals.rooms[req.body.room] != null) {
    return res
      .status(403)
      .json({ message: 'That library name already exists!' });
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
  res.redirect(`/libraries/${req.body.room}`);
});

router.get('/libraries/:room', withAuth, async (req, res) => {
  // if there are 6 people in a room already the user will be redirected to the lobby
  if (req.app.locals.rooms[req.params.room] == null) {
    return res.status(404).render('libraryDoesntExist', { layout: 'error' });
  }
  if (Object.keys(req.app.locals.rooms[req.params.room].users).length >= 6) {
    return res.status(403).render('fullLibrary', { layout: 'error' });
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

router.get('/lobby', (req, res) => {
  res.render('lobby', { layout: 'main', logged_in: req.session.logged_in });
});

router.get('/login', (req, res) => {
  res.render('login', { layout: 'main', logged_in: req.session.logged_in });
});

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
