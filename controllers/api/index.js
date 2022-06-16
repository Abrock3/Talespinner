const router = require('express').Router();
const userRoutes = require('./userRoutes');
const projectRoutes = require('./libraryRoutes');

router.use('/users', userRoutes);
router.use('/library', libraryRoutes);

module.exports = router;
