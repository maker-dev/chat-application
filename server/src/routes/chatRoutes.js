import express from 'express';
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from '../controllers/chatController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", verifyToken, accessChat);
router.get("/", verifyToken, fetchChats);
router.post("/group", verifyToken, createGroupChat)
router.put("/rename", verifyToken, renameGroup);
router.delete("/groupRemove", verifyToken, removeFromGroup);
router.put("/groupAdd", verifyToken, addToGroup);

export default router;