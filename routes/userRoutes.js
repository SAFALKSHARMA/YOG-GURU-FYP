import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { getUserData, getAllUsers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.get("/all-users", getAllUsers);

export default userRouter;
