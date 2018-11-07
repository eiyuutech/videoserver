const { ReS } = require('../services/UtilService');

const getAll = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  let todosJson = [
    {
      id: 1,
      text: 'Learn React',
      completed: true
    },
    {
      id: 2,
      text: 'Learn Redux',
      completed: true
    },
    {
      id: 3,
      text: 'Start an app',
      completed: true
    }
  ];

  return ReS(res, { todos: todosJson });
};
module.exports.getAll = getAll;