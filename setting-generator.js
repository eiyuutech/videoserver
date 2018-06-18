require('./config/config');

const path = require('path');

const username = CONFIG.db_user;
const password = CONFIG.db_password;
const host = CONFIG.db_host;
const database = CONFIG.db_name;

module.exports = {
  'url': `mysql://${username}:${password}@${host}/${database}`,
  'migrations-path': path.resolve('migrations'),
  'seeders-path': path.resolve('seeders'),
};
