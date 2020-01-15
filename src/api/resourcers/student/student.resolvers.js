import { Student } from './student.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import { Subject } from '../subject/subject.model';

const getMe = (_, __, { student }) => {
  return student;
};

const updateStudent = async (_, { input }) => {
  const subject = await Subject.findOne({ name: input.subjects });
  const student = await Student.findOneAndUpdate( { name: input.name }, [{ $set: { subjects: subject._id } }]);
  console.log('', student);
  return student
};

const createStudent = async (_, { input }, __) => {
  const hashPassword = await bcrypt.hash(input.password, 10);

  const user = {
    name: input.name,
    password: hashPassword,
    subjects: input.subjects,
  };

  return Student.create(user);
};

const findAll = async (_, data, ctx) => {
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