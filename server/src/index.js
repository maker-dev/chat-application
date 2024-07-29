import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

//config env
config();

//connect to db
connectDb();

//variables
const app = express();
const PORT = process.env.PORT || 5000; 

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

//Error handling middlewares
app.use(notFound);
app.use(errorHandler);

//launch server
app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`);
})