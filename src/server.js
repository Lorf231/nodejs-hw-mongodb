import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import { swaggerServe, swaggerSetup } from './swagger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(pino());
app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerServe, swaggerSetup);

app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const { MONGODB_URL, MONGODB_DB, MONGODB_USER, MONGODB_PASSWORD, PORT = 3000, JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Please add it to your environment variables.');
  process.exit(1);
}

const mongoUri = MONGODB_URL.includes('mongodb+srv')
  ? MONGODB_URL
  : `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

startServer();