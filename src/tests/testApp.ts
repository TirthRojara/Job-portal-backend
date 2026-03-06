import express from 'express';
import cookieParser from 'cookie-parser';
import authRoute from '../features/auth/auth.route';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoute);

export default app;
