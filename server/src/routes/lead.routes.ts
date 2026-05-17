import { Router } from "express";
import { leadController } from "../controllers/lead.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import { asyncWrapper } from "../utils/asyncWrapper";

export const leadRouter = Router();

leadRouter.get("/", verifyToken, asyncWrapper(leadController.list));
leadRouter.post("/", verifyToken, asyncWrapper(leadController.create));
leadRouter.get("/export", verifyToken, requireRole("admin"), asyncWrapper(leadController.exportCsv));
leadRouter.get("/:id", verifyToken, asyncWrapper(leadController.getById));
leadRouter.put("/:id", verifyToken, asyncWrapper(leadController.update));
leadRouter.delete("/:id", verifyToken, requireRole("admin"), asyncWrapper(leadController.remove));
