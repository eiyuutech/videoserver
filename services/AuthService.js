const User = require('./../models').users;
const validator = require('validator');

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

    return user;
  } else if (validator.isMobilePhone(uniqueKey, 'any')) { // checks if only phone number was sent
    authInfo.method = 'phone';
    userInfo.phone = uniqueKey;

    [err, user] = await to(User.create(userInfo));
    if (err) TE('user already exists with that phone number');

    return user;
  } else {
    TE('A valid email or phone number was not entered.');
  }
};
module.exports.createUser = createUser;

const authUser = async function(userInfo) { // returns token
  let uniqueKey;
  let authInfo = {};
  authInfo.status = 'login';
  uniqueKey = getUniqueKeyFromBody(userInfo);

  if (!uniqueKey) TE('Please enter an email or phone number to login');


  if (!userInfo.password) TE('Please enter a password to login');

  let user;
  let err;

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
