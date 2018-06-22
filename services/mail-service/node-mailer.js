import Promise from 'bluebird';
import nodemailer from 'nodemailer';

export default Promise.promisifyAll(nodemailer);
