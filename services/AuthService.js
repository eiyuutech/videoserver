import validator from 'validator';
import models from '../models';
import mailCreator from './mail-service/mail-creator';
import mailService from './mail-service';
import mailConfig from '../config/mail-server.json';

const {TE, to}          = require('../services/UtilService');
const CONFIG            = require('../config/config');
const User = models.users;
const env = CONFIG.app;

const getUniqueKeyFromBody = function(body) { // this is so they can send in 3 options unique_key, email, or phone and it will work
  let uniqueKey = body.unique_key;
  if (typeof uniqueKey === 'undefined') {
    if (typeof body.email !== 'undefined') {
      uniqueKey = body.email;
    } else if (typeof body.phone !== 'undefined') {
      uniqueKey = body.phone;
    } else {
      uniqueKey = null;
    }
  }

  return uniqueKey;
};
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async function(userInfo) {
  let uniqueKey;
  let authInfo = {};
  let err;
  let user;

  authInfo.status = 'create';

  uniqueKey = getUniqueKeyFromBody(userInfo);
  if (!uniqueKey) TE('An email or phone number was not entered.');

  if (validator.isEmail(uniqueKey)) {
    authInfo.method = 'email';
    userInfo.email = uniqueKey;

    [err, user] = await to(User.create(userInfo));
    if (err) TE('user already exists with that email');

    const mailText = mailCreator('signup.txt', { email: userInfo.email });
    const option = {
      from: mailConfig.from_address.main,
      to: userInfo.email,
      subject: 'test',
      text: mailText,
    };
    if (env !== 'test') {
      try {
        await mailService.send(option);
      } catch (e) {
        TE(e);
      }
    }
  } else if (validator.isMobilePhone(uniqueKey, 'any')) { // checks if only phone number was sent
    authInfo.method = 'phone';
    userInfo.phone = uniqueKey;

    [err, user] = await to(User.create(userInfo));
    if (err) TE('user already exists with that phone number');
  } else {
    TE('A valid email or phone number was not entered.');
  }

  return user;
};
module.exports.createUser = createUser;

const authUser = async function(userInfo) { // returns token
  let uniqueKey = getUniqueKeyFromBody(userInfo);
  let authInfo = {};
  let user;
  let err;

  authInfo.status = 'login';

  if (!uniqueKey) TE('Please enter an email or phone number to login');

  if (!userInfo.password) TE('Please enter a password to login');

  if (validator.isEmail(uniqueKey)) {
    authInfo.method = 'email';

    [err, user] = await to(User.findOne({
      where: {
        email: uniqueKey,
      },
    }));
    // console.log(err, user, uniqueKey);
    if (err) TE(err.message);
  } else if (validator.isMobilePhone(uniqueKey, 'any')) { // checks if only phone number was sent
    authInfo.method = 'phone';

    [err, user] = await to(User.findOne({
      where: {
        phone: uniqueKey,
      },
    }));
    if (err) TE(err.message);
  } else {
    TE('A valid email or phone number was not entered');
  }

  if (!user) TE('Not registered');

  [err, user] = await to(user.comparePassword(userInfo.password));

  if (err) TE(err.message);

  return user;
};
module.exports.authUser = authUser;
