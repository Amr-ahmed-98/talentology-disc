import { Router } from "express";
import { requireRole } from "../../middleware/auth";
import { getSummary } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.use(requireRole("MANAGER"));
dashboardRouter.get("/", getSummary);