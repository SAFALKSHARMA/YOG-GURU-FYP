import express from "express";
import userAuth from "../middlewares/userAuth.js";
import {
  getUserData,
  getAllUsers,
  updateProfileImage,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.get("/all-users", getAllUsers);
userRouter.put("/update-profile-img", updateProfileImage);

export default userRouter;
