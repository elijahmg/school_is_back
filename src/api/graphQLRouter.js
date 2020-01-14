import { merge } from 'lodash';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

/** Types **/
import studentType from './resourcers/student/student.graphql';
import subjectType from './resourcers/subject/subject.graphql';

/** Resolvers **/
import { studentResolvers } from './resourcers/student/student.resolvers';
import { subjectResolvers } from './resourcers/subject/subject.resolvers';

import config from '../config';

const getStudent = (token) => {
  try {
    if (token) {
      return jwt.verify(token, config.secrets.JWT_SECRET);
    }
  } catch (err) {
    throw Error('Something happen');
  }
};

const server = new ApolloServer({
  typeDefs: [studentType, subjectType],
  resolvers: merge(
    {},
    studentResolvers,
    subjectResolvers
  ),
  context: ({ req }) => {
    if (req) {
      const tokenWithBearer = req.headers.authorization || '';
      const token = tokenWithBearer.split(' ')[1];

      const student = getStudent(token);

      return { student }
    }
  },
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'light',
    }
  },
});

export default server