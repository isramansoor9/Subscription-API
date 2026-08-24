import cors from "cors";
import express from 'express';
import { PORT } from './config/env.js';

import userRouter from './router/user.routes.js';
import authRouter from './router/auth.routes.js';   
import subscriptionRouter from './router/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';

import { DB_URI, NODE_ENV } from './config/env.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
// import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './router/workflow.routes.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.use(arcjetMiddleware);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    await connectToDatabase();

    console.log(`Connected to MongoDB in ${NODE_ENV} environment`);
});

export default app;