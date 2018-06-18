const Category = require('../models').categories;

const create = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  let err;
  let category;
  // let user = req.user;

  let categoryInfo = req.body;


  [err, category] = await to(Category.create(categoryInfo));
  if (err) return ReE(res, err, 422);

  // category.addUser(user, { through: { status: 'started' }})

  [err, category] = await to(category.save());
  if (err) return ReE(res, err, 422);

  let categoryJson = category.toWeb();
  // categoryJson.users = [{user:user.id}];

  return ReS(res, { category: categoryJson }, 201);
};
module.exports.create = create;

const getAll = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  let err;
  let categories;

  [err, categories] = await to(Category.findAll(req.conditions));
  if (err) return ReE(res, err, 422);

  let categoriesJson = [];
  categories.forEach((category) => {
    categoriesJson.push(category.toWeb());
  });

  return ReS(res, { categories: categoriesJson });
};
module.exports.getAll = getAll;

const get = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  let { category } = req;

  return ReS(res, { category: category.toWeb() });
};
module.exports.get = get;

const update = async function(req, res) {
  let err;
  let { category } = req;
  let data = req.body;
  category.set(data);

  [err, category] = await to(category.save());
  if (err) {
    return ReE(res, err);
  }
  return ReS(res, { category: category.toWeb() });
};
module.exports.update = update;

const remove = async function(req, res) {
  let { category } = req;
  let err;

  [err, category] = await to(category.destroy());
  if (err) return ReE(res, 'error occured trying to delete the category');

  return ReS(res, { message: 'Deleted Category' }, 204);
};
module.exports.remove = remove;
