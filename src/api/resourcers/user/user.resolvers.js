import { User } from './user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../../../config';

/** QUERIES **/

/**
 * Return current logged in user
 *
 * Object to be return has to be the same as token object during authorization
 * @param {Object} root
 * @param {Object} data
 * @param {Object} user
 * @return {*}
 */
const getMe = (root, data, { user }) => {
  return user;
};

/**
 * Find all users
 * @param {Object} root
 * @param {Object} data
 * @param {Object} ctx
 * @return {Promise<*>}
 */
const findAllUsers = async (root, data, ctx) => {
  return User.find();
};

/** MUTATIONS **/

/**
 * Create user
 * @param {any} root
 * @param {Object} input
 * @param {Object} ctx
 * @return {Promise<user>}
 */
const createUser = async (root, { input }, ctx) => {
  const hashPassword = await bcrypt.hash(input.password, 10);

  const user = {
    ...input,
    password: hashPassword,
  };

  return User.create(user);
};

/**
 * Update user property
 * @param {any} root
 * @param {Object} input
 * @return {Promise<*>}
 */
const updateUser = async (root, { input }) => {
  // @todo
  let newProps = {};

  return User.findOneAndUpdate(
    { name: input.name },
    newProps,
    { new: true });
};

/**
 * Login user
 * @param {Object} root
 * @param {Object} input
 * @param {Object} ctx
 * @return {Promise<{user: *, token: (undefined|*)}>}
 */
const login = async (root, { input }, ctx) => {
  const user = await User.findOne({ loginName: input.loginName });

  if (!user) throw Error('No user');

  const passwordMatch = await bcrypt.compareSync(input.password, user.password);

  if (!passwordMatch) throw Error('Wrong password');

  const userPayload = {
    id: user.id,
    name: user.name,
    loginName: user.loginName,
    roles: user.roles,
  };

  const token = jwt.sign(
    { ...userPayload },
    config.secrets.JWT_SECRET,
    { expiresIn: config.expireTime }
  );

  return { ...userPayload, token };
};

export const userResolvers = {
  Query: {
    getMe,
    findAllUsers,
  },
  Mutation: {
    updateUser,
    createUser,
    login
  },
  User: {
    loginName: (par, root, { user }) => user.roles.includes('ADMIN') ? '' : par.loginName,
  }
};