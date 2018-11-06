const bcrypt = require('bcrypt');
const bcryptPromise = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const {TE, to}          = require('../services/UtilService');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('users', {
    first: DataTypes.STRING,
    last: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Phone number invalid.',
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: {
          args: [7, 20],
          msg: 'Phone number invalid, too short.',
        },
        isNumeric: {
          msg: 'not a valid phone number.',
        },
      },
    },
    password: DataTypes.STRING,
  }, {
     underscored: true
  });

  // Model.associate = function(models){
  //     this.categories = this.belongsToMany(models.categories, {through: 'UserCategory'});
  // };

  Model.beforeSave(async (user) => {
    let err;
    if (user.changed('password')) {
      let salt;
      let hash;
      [err, salt] = await to(bcrypt.genSalt(10));
      if (err) TE(err.message, true);

      [err, hash] = await to(bcrypt.hash(user.password, salt));
      if (err) TE(err.message, true);

      user.password = hash;
    }
  });

  Model.prototype.comparePassword = async function (pw) {
    let err;
    let pass;
    if (!this.password) TE('password not set');

    [err, pass] = await to(bcryptPromise.compare(pw, this.password));
    if (err) TE(err);

    if (!pass) TE('invalid password');

    return this;
  };

  Model.prototype.getJWT = function () {
    const expirationTime = parseInt(CONFIG.jwt_expiration, 10);
    return `Bearer ${jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, { expiresIn: expirationTime })}`;
  };

  Model.prototype.toWeb = function () {
    let json = this.toJSON();
    return json;
  };

  return Model;
};
