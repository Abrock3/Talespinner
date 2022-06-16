const router = require('express').Router();
const userRoutes = require('./userRoutes');
const libraryRoutes = require('./libraryRoutes');

router.use('/users', userRoutes);
router.use('/libraries', libraryRoutes);

module.exports = router;
