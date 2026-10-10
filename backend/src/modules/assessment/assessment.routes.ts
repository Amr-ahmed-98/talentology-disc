import { Router } from "express";
import { getAssessment, getResult, submitAssessment } from "./assessment.controller";

export const assessmentRouter = Router();

assessmentRouter.get("/:token", getAssessment);
assessmentRouter.post("/:token/submit", submitAssessment);
assessmentRouter.get("/:token/result", getResult);