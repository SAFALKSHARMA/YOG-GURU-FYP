import express from "express";
import userAuth from "../middlewares/userAuth.js";
import {
  getUserData,
  getAllUsers,
  updateProfileImage,
  deleteUser,
  banUser,
  unbanUser,
  updateUserProfile,
  getAllAdmins,
  createAdmin,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.get("/all-users", getAllUsers);
userRouter.get("/all-admins", getAllAdmins);
userRouter.post("/create-admin", createAdmin);

userRouter.put("/update-profile-img", updateProfileImage);
userRouter.put("/update-profile/:userId", updateUserProfile);
userRouter.delete("/delete/:userId", deleteUser);
// Ban and Unban routes
userRouter.patch("/ban/:userId", banUser);
userRouter.patch("/unban/:userId", unbanUser);

export default userRouter;
