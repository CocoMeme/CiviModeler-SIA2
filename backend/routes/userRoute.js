import express from 'express';
import { getUserData, getAllUsers, updateUser, deleteUser, updateStatus, getGenderData, getAccountStatusData, recordLoginHistory, updatePassword, getUserById } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';
import { isAuthenticated } from '../controllers/authController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, isAuthenticated, getUserData);
userRouter.get('/all', getAllUsers);
userRouter.put('/update-status/:id', userAuth, updateStatus);
userRouter.put('/update/:id', userAuth, updateUser); 
userRouter.delete('/delete/:id', userAuth, deleteUser);
userRouter.get('/gender-data', getGenderData);
userRouter.get('/account-status-data', getAccountStatusData);
userRouter.get('/:id', getUserById);

// New routes
userRouter.post('/login-history/:id', userAuth, recordLoginHistory);
userRouter.put('/update-password/:id', userAuth, updatePassword);

export default userRouter;