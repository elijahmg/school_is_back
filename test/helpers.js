import mongoose from 'mongoose';
import config from '../src/config';

mongoose.Promise = global.Promise;

export const removeModel = (modelName) => {
  const model = mongoose.model(modelName);
  return new Promise((resolve, reject) => {
    if (!model) {
      return resolve()
    }
    model.deleteOne((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
};

export const dropDb = () => {
  mongoose.set('createIndexes', true);
  return mongoose.connect(config.db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => Promise.all(mongoose.modelNames().map(removeModel)))
};