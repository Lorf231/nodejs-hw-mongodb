import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Please add it to your environment variables.');
}

const ACCESS_TTL_MS = 15 * 60 * 1000;
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ name, email, password: hashedPassword });

  const userObj = newUser.toObject();
  delete userObj.password;

  return userObj;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password is wrong');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401, 'Email or password is wrong');

  const now = Date.now();
  const accessTokenValidUntil = new Date(now + ACCESS_TTL_MS);
  const refreshTokenValidUntil = new Date(now + REFRESH_TTL_MS);

  const payload = { sub: String(user._id), email: user.email, name: user.name };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

  await Session.deleteMany({ userId: user._id });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil };
};

export const refreshSession = async (refreshTokenFromCookie) => {
  if (!refreshTokenFromCookie) {
    throw createHttpError(401, 'Refresh token missing');
  }

  let payload;
  try {
    payload = jwt.verify(refreshTokenFromCookie, JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const userId = payload.sub;

  const existingSession = await Session.findOne({ userId, refreshToken: refreshTokenFromCookie });
  if (!existingSession) throw createHttpError(401, 'Session not found');

  if (existingSession.refreshTokenValidUntil < new Date()) {
    await Session.deleteMany({ userId });
    throw createHttpError(401, 'Refresh token expired');
  }

  await Session.deleteMany({ userId });

  const now = Date.now();
  const accessTokenValidUntil = new Date(now + ACCESS_TTL_MS);
  const refreshTokenValidUntil = new Date(now + REFRESH_TTL_MS);

  const newPayload = { sub: userId, email: payload.email, name: payload.name };
  const accessToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: '30d' });

  await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken, refreshTokenValidUntil };
};

export const logoutSession = async (refreshTokenFromCookie) => {
  if (!refreshTokenFromCookie) {
    throw createHttpError(401, 'Refresh token missing');
  }

  const session = await Session.findOne({ refreshToken: refreshTokenFromCookie });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  await Session.deleteOne({ _id: session._id, refreshToken: refreshTokenFromCookie });

  return true;
};