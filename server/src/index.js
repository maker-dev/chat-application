import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import http from 'http';
import {Server} from 'socket.io';

//config env
config();

//connect to db
connectDb();

//variables
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173"
    }
})
const PORT = process.env.PORT || 5000; 

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

//Error handling middlewares
app.use(notFound);
app.use(errorHandler);

//socket io
io.on("connection", (socket) => {
    console.log("connected to socket io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
    })

    socket.on("join chat", (room) => {
        socket.join(room);
    })

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return 

            socket.in(user._id).emit("message received", newMessageReceived);
        })
    })    
})

//launch server
server.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`);
})