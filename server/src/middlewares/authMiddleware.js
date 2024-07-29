import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';


const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part from the Authorization header

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserModel.findById(decoded.id).select("-password");
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired'});
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export {verifyToken}