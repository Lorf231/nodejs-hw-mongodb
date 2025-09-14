import express from 'express';
import {
  handleRegister,
  handleLogin,
  handleRefresh,
  handleLogout,
  handleSendResetEmail,
  handleResetPassword,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../schemas/authSchema.js';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema),  ctrlWrapper(handleRegister));
router.post('/login', validateBody(loginUserSchema), ctrlWrapper(handleLogin));
router.post('/refresh', ctrlWrapper(handleRefresh));
router.post('/logout', ctrlWrapper(handleLogout));
router.post('/send-reset-email', validateBody(sendResetEmailSchema), ctrlWrapper(handleSendResetEmail));
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(handleResetPassword));

export default router;