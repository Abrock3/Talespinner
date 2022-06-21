const router = require('express').Router();
const { Library, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  res.render('landpage', { layout: 'main' });
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
