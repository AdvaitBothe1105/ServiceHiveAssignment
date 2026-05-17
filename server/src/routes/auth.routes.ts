import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", verifyToken, authController.me);
