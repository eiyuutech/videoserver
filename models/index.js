const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const CONFIG = require('../config/config');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
  host: CONFIG.db_host,
  dialect: CONFIG.db_dialect,
  port: CONFIG.db_port,
  operatorsAliases: false,
});

fs
.readdirSync(__dirname)
.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
.forEach((file) => {
  const model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
