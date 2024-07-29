import UserModel from "../models/User.js";
import generateToken from '../config/generateToken.js';

//@description     Register new user
//@route           POST /api/user/register
//@access          Public
const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({message: "Please Enter all the Fields"})
    }

    const userExists = await UserModel.findOne({ email }); 

    if (userExists) {
        res.status(400).json({message: "User already exists"})
    }

    const user = await UserModel.create({
        name,
        email,
        password,
        pic
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({ message: "Something went wrong" });
    }
}

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(401).json({ message: "Invalid Email or Password" });
    }
}


//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = async (req, res) => {

    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};

    const users = await UserModel.find(keyword).find({ _id: { $ne: req.user._id } }).select("-password");
    
    res.send(users);
}

export { registerUser, loginUser, allUsers };