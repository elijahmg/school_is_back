import express from 'express';
import { userRouter } from './resourcers/user';

export const restRouter = express.Router();

restRouter.use('/user', userRouter);