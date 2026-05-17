import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";

export const userRouter = Router();

userRouter.get("/", verifyToken, requireRole("admin"), userController.list);
userRouter.patch("/:id/role", verifyToken, requireRole("admin"), userController.updateRole);
