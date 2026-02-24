import express from "express";
import { loginUser, logoutUser, registerUser } from "../controller/user/auth.controller";
import { isAuthenticated } from "../middleware/authMiddleware";
import { me } from "../controller/user/me.controller";

export const authRouter = express.Router();

authRouter.post("/signup",registerUser);
authRouter.post("/login",loginUser);
authRouter.post("/logout",logoutUser);
authRouter.get("/me",isAuthenticated,me);