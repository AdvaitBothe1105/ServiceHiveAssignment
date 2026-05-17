import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import { asyncWrapper } from "../utils/asyncWrapper";

export const userRouter = Router();

userRouter.get("/", verifyToken, requireRole("admin"), asyncWrapper(userController.list));
userRouter.patch("/:id/role", verifyToken, requireRole("admin"), asyncWrapper(userController.updateRole));
