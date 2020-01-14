import { Subject } from './subject.model';

const findByName = async (_, args) => {
  return Subject.findOne({ name: args.name });
};

const createSubject = async (_, args) => {
  return Subject.create(args);
};

export const subjectResolvers = {
  Query: {
    findByName,
  },

  Mutation: {
    createSubject
  },
};
