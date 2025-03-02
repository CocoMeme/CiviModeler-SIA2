import express from 'express';
import { getUserData, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';
import { isAuthenticated } from '../controllers/authController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, isAuthenticated, getUserData);
userRouter.get('/all', userAuth, getAllUsers);
userRouter.put('/update/:id', userAuth, updateUser); 
userRouter.delete('/delete/:id', userAuth, deleteUser); 

export default userRouter;