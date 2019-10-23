import { User } from './user.model';
import { merge } from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config';

const getMe = (_, __, { user }) => {
  return user;
};

const updateUser = (_, { input }, { user }) => {
  merge(user, input);
  user.save()
};

const createUser = async (_, { input }, __) => {
  const hashPassword = await bcrypt.hash(input.password, 10);

  const user = {
    username: input.username,
    password: hashPassword,
  };

  return User.create(user);
};

const login = async (_, { input }, ctx) => {
  const user = await User.findOne({ username: input.username });

  if (!user) throw Error('No user');

  const passwordMatch = await bcrypt.compareSync(input.password, user.password);

  if (!passwordMatch) throw Error('Wrong password');

  const token = jwt.sign({
      id: user.id,
      username: user.name,
    },
    config.secrets.JWT_SECRET,
    { expiresIn: config.expireTime }
  );

  return {
    user,
    token,
  }
};

export const userResolvers = {
  Query: {
    getMe
  },
  Mutation: {
    updateUser,
    createUser,
    login
  }
};