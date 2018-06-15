const express = require('express');
const passport = require('passport');
const path = require('path');

const UserController = require('./../controllers/UserController');
const CategoryController = require('./../controllers/CategoryController');
const HomeController = require('./../controllers/HomeController');
const custom = require('./../middleware/custom');

const router = express.Router();

require('./../middleware/passport')(passport);
/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ status: 'success', message: 'Parcel Pending API', data: { version_number: 'v1.0.0' } });
});

router.post('/users', UserController.create);
router.get('/users', passport.authenticate('jwt', { session: false }), UserController.get);
router.put('/users', passport.authenticate('jwt', { session: false }), UserController.update);
router.delete('/users', passport.authenticate('jwt', { session: false }), UserController.remove);
router.post('/users/login', UserController.login);

router.post('/categories', passport.authenticate('jwt', { session: false }), CategoryController.create);
router.get('/categories', passport.authenticate('jwt', { session: false }), CategoryController.getAll);

router.get('/categories/:category_id', passport.authenticate('jwt', { session: false }), custom.categoryMiddleware, CategoryController.get);
router.put('/categories/:category_id', passport.authenticate('jwt', { session: false }), custom.categoryMiddleware, CategoryController.update);
router.delete('/categories/:category_id', passport.authenticate('jwt', { session: false }), custom.categoryMiddleware, CategoryController.remove);

router.get('/dash', passport.authenticate('jwt', { session: false }), HomeController.Dashboard);

// ********* API DOCUMENTATION **********
router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
