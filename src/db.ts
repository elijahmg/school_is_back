import config from './config';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export const connect = () => {
  mongoose.set('createIndexes', true);
  return mongoose.connect(config.db.url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
};
