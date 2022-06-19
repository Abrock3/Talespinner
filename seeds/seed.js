const sequelize = require('../config/connection');
const { User, Library } = require('../models');

const userData = require('./userData.json');
const libraryData = require('./libraryData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Library.bulkCreate(libraryData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
