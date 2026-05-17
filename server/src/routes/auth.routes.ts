import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { asyncWrapper } from "../utils/asyncWrapper";

export const authRouter = Router();

authRouter.post("/register", asyncWrapper(authController.register));
authRouter.post("/login", asyncWrapper(authController.login));
authRouter.post("/logout", asyncWrapper(authController.logout));
authRouter.get("/me", verifyToken, asyncWrapper(authController.me));
