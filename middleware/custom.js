const Category = require('./../models').categories;

let categoryMiddleware = async function (req, res, next) {
  let { category_id: categoryId } = req.params;
  let err;
  let category;

  [err, category] = await to(Category.findOne({
    where: {
      id: categoryId,
    },
  }));
  if (err) return ReE(res, 'err finding category');

  if (!category) return ReE(res, `Category not found with id: ${categoryId}`);

  req.category = category;
  next();
};
module.exports.categoryMiddleware = categoryMiddleware;
