import { Subject } from './subject.model';

const findSubjectByName = async (_, args, {}) => {
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
    findSubjectByName,
    findAllSubjects,
  },

  Mutation: {
    createSubject
  },
};
