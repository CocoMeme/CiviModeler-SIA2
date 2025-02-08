import express from 'express';
import { getUserData, getAllUsers } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/all', userAuth, getAllUsers);

export default userRouter;