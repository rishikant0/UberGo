import express from "express";
import { body } from "express-validator";
import userController from "../controllers/user.controller.js";
import  {authUser}  from '../middlewares/auth.middleware.js'


const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters"),
    body("fullname.lastname")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  userController.registerUser
);

router.post("/login",[
    body("email").isEmail().withMessage("Invalid email"),
     body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
],
userController.loginUser
)
router.get('/profile',authUser,userController.getUserProfile)

router.get('/logout',authUser,userController.getUserProfile)
export default router;
