import { Student } from './student.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import { Subject } from '../subject/subject.model';

const getMe = (_, __, { student }) => {
  return student;
};

/**
 * Update student property
 * @param {any} root
 * @param {Object} input
 * @return {Promise<*>}
 */
const updateStudent = async (root, { input }) => {
  let subjects = [];
  if (input.subjects) {
    subjects = await Subject.find({ name: { $in: input.subjects } });
  }

  let pipelines = {};
  if (subjects.length) {
    pipelines = {
      ...pipelines,
      subjects: subjects.map((s) => s._id)
    }
  }

  if (input.name) {
    pipelines = {
      ...pipelines,
      name: input.name
    }
  }

  return Student.findOneAndUpdate(
    { name: input.name },
    pipelines,
    { new: true });
};

/**
 * Create student
 * @param {any} root
 * @param {Object} input
 * @param {Object} ctx
 * @return {Promise<user>}
 */
const createStudent = async (root, { input }, ctx) => {
  const hashPassword = await bcrypt.hash(input.password, 10);

  const user = {
    name: input.name,
    password: hashPassword,
    subjects: input.subjects,
  };

  return Student.create(user);
};

/**
 * Find all students
 * @param {Object} root
 * @param {Object} data
 * @param {Object} ctx
 * @return {Promise<*>}
 */
const findAll = async (root, data, ctx) => {
  return Student.find();
};

const login = async (_, { input }, ctx) => {
  const student = await Student.findOne({ name: input.name });

  if (!student) throw Error('No student');

  const passwordMatch = await bcrypt.compareSync(input.password, student.password);

  if (!passwordMatch) throw Error('Wrong password');

  const token = jwt.sign({
      id: student.id,
      name: student.name,
    },
    config.secrets.JWT_SECRET,
    { expiresIn: config.expireTime }
  );

  return {
    student,
    token,
  }
};

export const studentResolvers = {
  Query: {
    getMe,
    findAll
  },
  Mutation: {
    updateStudent,
    createStudent,
    login
  },

  Student: {
    subjects: async (parent) => {
      return await Subject.find({ _id: { $in: parent.subjects } });
    }
  }
};