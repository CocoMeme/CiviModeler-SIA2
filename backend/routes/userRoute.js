import express from 'express';
import { getUserData, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/all', userAuth, getAllUsers);
userRouter.put('/update/:id', userAuth, updateUser); // Add this line
userRouter.delete('/delete/:id', userAuth, deleteUser); // Add this line

export default userRouter;