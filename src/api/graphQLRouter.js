import { merge } from 'lodash';
import { ApolloServer, makeExecutableSchema, gql } from 'apollo-server-express';
import userType from './resourcers/user/user.graphql';
import { userResolvers } from './resourcers/user/user.resolvers';
import config from '../config';
import jwt from 'jsonwebtoken';

export const schema = makeExecutableSchema({ typeDefs: [userType] });

const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, config.secrets.JWT_SECRET);
    }
  } catch (err) {
    throw Error('Something hapend');
  }
};

const server = new ApolloServer({
  typeDefs: [
    userType,
  ],
  resolvers: merge(
    {},
    userResolvers,
  ),
  context: ({ req }) => {
    const tokenWithBearer = req.headers.authorization || '';
    const token = tokenWithBearer.split(' ')[1];

    const user = getUser(token);
    console.log('ctx', user);

    // if (!user) throw Error('Token bad');

    return {
      user
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