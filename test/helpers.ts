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
  return mongoose.connect(config.db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
    .then(async () => await Promise.all(mongoose.modelNames().map(removeModel)))
};