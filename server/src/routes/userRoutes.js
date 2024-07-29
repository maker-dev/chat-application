import express from 'express';
import { registerUser, loginUser, allUsers } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/", verifyToken, allUsers);


export default router;