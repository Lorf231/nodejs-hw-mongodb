import createHttpError from 'http-errors';
import { registerUser, loginUser, refreshSession, logoutSession } from '../services/auth.js';

export const handleRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerUser({ name, email, password });
  if (!user) throw createHttpError(409, 'Email in use');

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken, refreshTokenValidUntil } = await loginUser({ email, password });

  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    expires: refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};

export const handleRefresh = async (req, res) => {
  const refreshTokenFromCookie = req.cookies?.refreshToken;

  const { accessToken, refreshToken, refreshTokenValidUntil } =
    await refreshSession(refreshTokenFromCookie);

  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    expires: refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const handleLogout = async (req, res) => {
  const refreshTokenFromCookie = req.cookies?.refreshToken;

  await logoutSession(refreshTokenFromCookie);

  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });

  res.status(204).send();
};