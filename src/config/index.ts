import { merge } from 'lodash'

let env = process.env.NODE_ENV || 'development';

const baseConfig = {
  port: 3000,
  secrets: {
    JWC_SECRET: 'boost-dev',
    JWT_SECRET: 'boost-dev'
  },
  expireTime: '30d',
  db: {
    url: 'mongodb://localhost/jams'
  }
};

let envConfig = {};

switch (env) {
  case 'development':
  case 'dev':
    envConfig = require('./dev').config;
    break;
  case 'test':
  case 'testing':
    envConfig = require('./testing').config;
    break;
  case 'prod':
  case 'production':
    envConfig = require('./prod').config;
    break;
  default:
    envConfig = require('./dev').config
}

export default merge(baseConfig, envConfig);