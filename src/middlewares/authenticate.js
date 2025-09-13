import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';

const { JWT_SECRET } = process.env;

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw createHttpError(401, 'Invalid access token');
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err?.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid access token');
    }

    const session = await Session.findOne({
      userId: payload.sub,
      accessToken: token,
    });

    if (!session) {
      throw createHttpError(401, 'Invalid access token');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(payload.sub).select('-password');
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = {
      _id: String(user._id),
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};