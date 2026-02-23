import express from "express";
import { loginUser, logoutUser, registerUser } from "../controller/user/auth.controller";

export const authRouter = express.Router();

authRouter.post("/signup",registerUser);
authRouter.post("/login",loginUser);
authRouter.post("/logout",logoutUser);