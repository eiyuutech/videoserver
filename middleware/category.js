const Category = require('./../models').categories;

const categoryAddParamsMiddleware = async (req, res, next) => {
  const { category_id: categoryId } = req.params;
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
module.exports.categoryAddParamsMiddleware = categoryAddParamsMiddleware;

const categoryAddConditionsMiddleware = (req, res, next) => {
  const {
    name,
    parent_id: parentId,
    offset = 0,
    limit = 100,
  } = req.query;
  let conditions = {
    where: {},
    offset: +offset,
    limit: +limit,
  };

  if (name) {
    conditions.where.name = name;
  }

  if (parentId) {
    conditions.where.parent_id = parentId;
  }

  req.conditions = conditions;
  next();
};
module.exports.categoryAddConditionsMiddleware = categoryAddConditionsMiddleware;
