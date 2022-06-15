const User = require('./User');
const Project = require('./Project');
const Library = require('./Library');

User.hasMany(Project, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Project.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(Library, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Library.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = { User, Project, Library };
