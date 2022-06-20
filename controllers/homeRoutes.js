const router = require('express').Router();
const { Library, User } = require('../models');
const withAuth = require('../utils/auth');
let rooms = require('../server.js');

router.get('/', async (req, res) => {
  // Pass session flag into template
  res.render('landpage', { layout: 'main', logged_in: req.session.logged_in });
});

// works similarly to the above route
router.get('/lobby', (req, res) => {
  res.render('lobby', { layout: 'main', logged_in: req.session.logged_in });
});
router.get('/login', (req, res) => {
  res.render('login', { layout: 'main', logged_in: req.session.logged_in });
});



router.get('/library/:id', withAuth, async (req, res) => {
  try {
    const libraryData = await Library.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const library = libraryData.get({ plain: true });

    res.render('library', {
      ...library,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Library }],
    });

    const user = userData.get({ plain: true });

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
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
