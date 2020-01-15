import { Subject } from './subject.model';

const findByName = async (_, args) => {
  return Subject.findOne({ name: args.name });
};

const createSubject = async (_, args) => {
  return Subject.create(args.input);
};

const findAllSubjects = async () => {
  return Subject.find();
};

export const subjectResolvers = {
  Query: {
    findByName,
    findAllSubjects,
  },

  Mutation: {
    createSubject
  },
};
