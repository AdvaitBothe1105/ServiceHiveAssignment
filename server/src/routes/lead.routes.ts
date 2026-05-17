import { Router } from "express";
import { leadController } from "../controllers/lead.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";

export const leadRouter = Router();

leadRouter.get("/", verifyToken, leadController.list);
leadRouter.post("/", verifyToken, leadController.create);
leadRouter.get("/export", verifyToken, requireRole("admin"), leadController.exportCsv);
leadRouter.get("/:id", verifyToken, leadController.getById);
leadRouter.put("/:id", verifyToken, leadController.update);
leadRouter.delete("/:id", verifyToken, requireRole("admin"), leadController.remove);
