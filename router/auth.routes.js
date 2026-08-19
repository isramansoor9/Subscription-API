import express from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

// End points. PATH = /api/auth/v1/sign-up (POST)
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;