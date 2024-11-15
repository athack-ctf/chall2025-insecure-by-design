const {Sequelize, DataTypes} = require('sequelize');
const path = require("path");
const fs = require("fs");
const dbFilePath = path.resolve(__dirname, "../../db", "database.sqlite");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbFilePath,
    // TODO: Disable logging for cleaner output
    // logging: false,
    logging: (msg) => console.debug(msg),
});

const User = require('./user')(sequelize, DataTypes);
const Quote = require('./quote')(sequelize, DataTypes);

// Define relationships
User.hasMany(Quote, {foreignKey: 'userId'});
Quote.belongsTo(User, {foreignKey: 'userId'});

async function checkIfDbFileExists() {
    return fs.existsSync(dbFilePath);
}

module.exports = {sequelize, User, Quote, checkIfDbFileExists};
