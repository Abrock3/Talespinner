const User = require('./User');
const Library = require('./Library');


User.hasMany(Library, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Library.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = { User, Library };
