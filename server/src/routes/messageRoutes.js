import express from 'express';
import {allMessages, sendMessage} from '../controllers/messageController.js';
import {verifyToken} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route("/").post(verifyToken, sendMessage);

router.route("/:chatId").get(verifyToken, allMessages)

export default router;