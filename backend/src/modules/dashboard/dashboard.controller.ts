import type { Request, Response } from "express";
import * as dashboardService from "./dashboard.service";

export async function getSummary(_req: Request, res: Response) {
    res.json(await dashboardService.getSummary());
}