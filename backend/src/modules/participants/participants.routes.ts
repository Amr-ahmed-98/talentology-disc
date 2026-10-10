import { Router } from "express";
import { requireRole } from "../../middleware/auth";
import { getParticipantReport, listParticipants } from "./participants.controller";

export const participantsRouter = Router();

participantsRouter.use(requireRole("FACILITATOR"));
participantsRouter.get("/", listParticipants);
participantsRouter.get("/:id/report", getParticipantReport);