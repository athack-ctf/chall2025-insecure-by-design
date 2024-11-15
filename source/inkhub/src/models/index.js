const {Sequelize, DataTypes} = require('sequelize');
const path = require("path");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, "../../db", "database.sqlite")
});

const User = require('./user')(sequelize, DataTypes);
const Quote = require('./quote')(sequelize, DataTypes);

// Define relationships
User.hasMany(Quote, {foreignKey: 'userId'});
Quote.belongsTo(User, {foreignKey: 'userId'});

module.exports = {sequelize, User, Quote};
