import { Router } from "express";
import { leadController } from "../controllers/lead.controller";
import { verifyToken } from "../middleware/auth.middleware";

export const leadRouter = Router();

leadRouter.get("/", verifyToken, leadController.list);
