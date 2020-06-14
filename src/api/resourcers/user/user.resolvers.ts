import { User, UserInterface } from './user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../../../config';
import { checkRight } from '../../../security';
import { Subject } from '../subject/subject.model';

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
const getMe = (root, { input }, { user }) => {
  return user;
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
  const hashPassword = await bcrypt.hashSync(input.password, 10);

  const user = {
    ...input,
    password: hashPassword,
  };

  return User.create(user);
};

/**
 * 
 * @param {any} root 
 * @param {Object} input 
 * @param {Object} user 
 */
const updateMyself = async (root, { input }, { user }) => {
  const dbSubjects = await Subject.find({ name: { $in: input.subjects } });

  return User.findOneAndUpdate(
    { _id: user.id },
    { ...input, subjects: dbSubjects.map((subj) => subj._id) },
    { new: true }
  )
};

/**
 * Login user
 * @param {Object} root
 * @param {Object} input
 * @return {Promise<{user: *, token: (undefined|*)}>}
 */
const login = async (root, { input }) => {
  const user = await User.findOne({ loginName: input.loginName });

  if (!user) throw Error('No user');

  const passwordMatch = await bcrypt.compareSync(input.password, user.password);

  if (!passwordMatch) throw Error('Wrong password');

  const userPayload = {
    id: user.id,
    name: user.name,
    loginName: user.loginName,
  };

  const token = jwt.sign(
    { ...userPayload },
    config.secrets.JWT_SECRET,
    { expiresIn: config.expireTime }
  );

  return { ...userPayload, token };
};

export const userResolvers = {
  UserInterface: {
    __resolveType(obj, ctx, info) {
        return 'User';
    }
  },
  UserReturn: {
    subjects: (parent, args) => {
      return Subject.find({ _id: { $in: parent.subjects } });
    },
  },
  Query: {
    getMe,
  },
  Mutation: {
    createUser,
    updateMyself,
    login
  },
};