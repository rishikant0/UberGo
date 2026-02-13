import userModel from "../models/user.model.js";
import userService from "../services/user.services.js";
import { validationResult } from "express-validator";
import blacklistTokenModel from "../models/blacklistToken.model.js";

/* =====================
   REGISTER
===================== */
const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const { firstname, lastname } = fullname;

    const isUserAlready = await userModel.findOne({email});

    if(isUserAlready){
      return res.status(400).json({message:'Captain alreay exits'});
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

/* =====================
   LOGIN
===================== */
const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.cookie('token',token);

    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

const logout = async (req,res,next) => {
    res.clearCookie('token');
     
     const token = req.cookie.token || req.headeers.authoriety.split(" ")[1];

     await blacklistTokenModel.create({token});
     res.status(200).json({mesage:'Logged out'});
}

export default {
  registerUser,
  loginUser,
  getUserProfile
};
