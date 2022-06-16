const router = require('express').Router();
const { Library } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newLibrary = await Library.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newLibrary);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const libraryData = await Library.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!libraryData) {
      res.status(404).json({ message: 'No library found with this id!' });
      return;
    }

    res.status(200).json(libraryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
