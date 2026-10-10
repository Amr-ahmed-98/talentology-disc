import { HttpError } from "../../lib/http-error";
import { prisma } from "../../lib/prisma";
import { buildReport, resultScores } from "../assessment/assessment.service";

export type ParticipantStatus = "COMPLETED" | "PENDING";

export function participantStatus(result: object | null): ParticipantStatus {
    return result ? "COMPLETED" : "PENDING";
}

export async function listParticipants() {
    const participants = await prisma.participant.findMany({
        include: { result: true },
        orderBy: { name: "asc" },
    });

    return participants.map(({ result, ...participant }) => ({
        id: participant.id,
        name: participant.name,
        email: participant.email,
        inviteToken: participant.inviteToken,
        status: participantStatus(result),
        profileCode: result?.profileCode ?? null,
        scores: result ? resultScores(result) : null,
        completedAt: result?.completedAt ?? null,
    }));
}

export async function getParticipantReport(id: string) {
    const participant = await prisma.participant.findUnique({
        where: { id },
        include: { result: true },
    });
    if (!participant) throw new HttpError(404, "Participant not found");
    if (!participant.result) throw new HttpError(404, "Assessment not completed yet");

    return buildReport(participant, participant.result);
}