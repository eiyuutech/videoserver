const CONFIG = require('../../config/config');
const env = CONFIG.app;

const emailAddress = (email) => {
  const to = (env === 'production' || env === 'stg') ? email : 'development@evolable.asia';
  return to;
};

export default emailAddress;
