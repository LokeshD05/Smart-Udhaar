import express from 'express'
import { login, logOut, register, getProfile } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const authRouter = express.Router();
authRouter.get('/me', authMiddleware, getProfile);

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logOut',logOut);

export default authRouter;
