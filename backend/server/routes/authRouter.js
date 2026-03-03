import express from 'express'
import { login, logOut, register } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logOut',logOut);

export default authRouter;
