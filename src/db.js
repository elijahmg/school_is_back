import config from './config';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export const connect = () => {
  return mongoose.connect(config.db.url, {
    useMongoClient: true
  })
};
