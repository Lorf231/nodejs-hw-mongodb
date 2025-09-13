import express from 'express';
import { handleRegister, handleLogin, handleRefresh, handleLogout } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../schemas/authSchema.js';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema), ctrlWrapper(handleRegister));
router.post('/login', validateBody(loginUserSchema), ctrlWrapper(handleLogin));
router.post('/refresh', ctrlWrapper(handleRefresh));
router.post('/logout', ctrlWrapper(handleLogout));

export default router;