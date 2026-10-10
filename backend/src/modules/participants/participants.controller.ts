import type { Request, Response } from "express";
import * as participantsService from "./participants.service";

export async function listParticipants(_req: Request, res: Response) {
    res.json(await participantsService.listParticipants());
}

export async function getParticipantReport(req: Request<{ id: string }>, res: Response) {
    res.json(await participantsService.getParticipantReport(req.params.id));
}