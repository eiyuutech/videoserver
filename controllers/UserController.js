const authService = require('./../services/AuthService');
const { to, ReE, ReS }  = require('../services/UtilService');

const create = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { body } = req;

  if (!body.unique_key && !body.email && !body.phone) {
    return ReE(res, 'Please enter an email or phone number to register.');
  } else if (!body.password) {
    return ReE(res, 'Please enter a password to register.');
  } else {
    let err;
    let user;

    [err, user] = await to(authService.createUser(body));

    if (err) return ReE(res, err, 422);
    return ReS(res, { message: 'Successfully created new user.', user: user.toWeb(), token: user.getJWT() }, 201);
  }
};
module.exports.create = create;

const get = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  let { user } = req;

  return ReS(res, { user: user.toWeb() });
};
module.exports.get = get;

const update = async function(req, res) {
  let err;
  let { user } = req;
  let data = req.body;

  user.set(data);

  [err, user] = await to(user.save());
  if (err) {
    if (err.message === 'Validation error') err = 'The email address or phone number is already in use';
    return ReE(res, err);
  }
  return ReS(res, { message: `Updated User: ${user.email}` });
};
module.exports.update = update;

const remove = async function(req, res) {
  let { user } = req;
  let err;

  [err, user] = await to(user.destroy());
  if (err) return ReE(res, 'error occured trying to delete user');

  return ReS(res, { message: 'Deleted User' }, 204);
};
module.exports.remove = remove;

const login = async function(req, res) {
  let err;
  let user;

  [err, user] = await to(authService.authUser(req.body));
  if (err) return ReE(res, err, 422);

  return ReS(res, { token: user.getJWT(), user: user.toWeb() });
};
module.exports.login = login;
