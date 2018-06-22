import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const mailCreator = (fileName, option) => {
  const pathName = path.join(__dirname, '../../public/assets/mail-template/');
  const TEMPLATE = fs.readFileSync(path.join(pathName, fileName), 'utf-8');
  const FOOTER = fs.readFileSync(path.join(pathName, 'footer/default.txt'), 'utf-8');

  const compiler = _.template(TEMPLATE);

  return compiler(option) + FOOTER;
};

export default mailCreator;
