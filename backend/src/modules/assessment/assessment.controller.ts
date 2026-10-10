import type { Request, Response } from "express";
import { submitSchema } from "./assessment.schema";
import * as assessmentService from "./assessment.service";

type TokenParams = { token: string };

export async function getAssessment(req: Request<TokenParams>, res: Response) {
    res.json(await assessmentService.getAssessment(req.params.token));
}

export async function submitAssessment(req: Request<TokenParams>, res: Response) {
    const { rankings } = submitSchema.parse(req.body);
    const report = await assessmentService.submitAssessment(req.params.token, rankings);
    res.status(201).json(report);
}

export async function getResult(req: Request<TokenParams>, res: Response) {
    res.json(await assessmentService.getResult(req.params.token));
}