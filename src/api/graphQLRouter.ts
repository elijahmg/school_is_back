/// <reference path="../../@types/graphql.d.ts"/>
import { merge } from 'lodash';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

/** Types **/
import userType from './resourcers/user/user.graphql';
import subjectType from './resourcers/subject/subject.graphql';

/** Resolvers **/
import { userResolvers } from './resourcers/user/user.resolvers';
import { subjectResolvers } from './resourcers/subject/subject.resolvers';

import config from '../config';

const getUser = (token) => {
  if (token) {
    return jwt.verify(token, config.secrets.JWT_SECRET);
  }
  return undefined
};

const server = new ApolloServer({
  typeDefs: [userType, subjectType],
  resolvers: merge(
    {},
    userResolvers,
    subjectResolvers
  ),
  context: ({ req }) => {
    if (req) {
      const tokenWithBearer = req.headers.authorization || '';
      const token = tokenWithBearer.split(' ')[1];

      const user = getUser(token);

      return { user }
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